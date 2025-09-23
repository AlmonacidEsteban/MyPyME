from rest_framework import viewsets, permissions, views
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum, Count, Avg, Max, Min
from django.utils import timezone
from datetime import timedelta
from .models import Project, Client, Finance, TeamMember, WhatsAppMessage, ClientSatisfaction
from .serializers import (
    ProjectSerializer, 
    ClientSerializer, 
    FinanceSerializer, 
    TeamMemberSerializer,
    WhatsAppMessageSerializer
)

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Project.objects.all()
        
        # Filtro por estado
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
            
        # Filtro por cliente
        client_id = self.request.query_params.get('client_id', None)
        if client_id:
            queryset = queryset.filter(client_id=client_id)
            
        # Filtro por fecha de inicio
        start_date = self.request.query_params.get('start_date', None)
        if start_date:
            queryset = queryset.filter(start_date__gte=start_date)
            
        # Filtro por fecha de fin
        end_date = self.request.query_params.get('end_date', None)
        if end_date:
            queryset = queryset.filter(end_date__lte=end_date)
            
        # Ordenamiento
        ordering = self.request.query_params.get('ordering', '-created_at')
        return queryset.order_by(ordering)

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """Endpoint para obtener estadísticas de clientes"""
        # Total de clientes
        total_clientes = Client.objects.count()
        
        # Clientes con proyectos activos
        clientes_con_proyectos = Client.objects.filter(
            finances__project__status__in=['en_progreso', 'planificacion', 'revision']
        ).distinct().count()
        
        # Clientes por satisfacción
        satisfaccion_promedio = ClientSatisfaction.objects.aggregate(
            promedio=Avg('rating'),
            maximo=Max('rating'),
            minimo=Min('rating')
        )
        
        # Top 5 clientes por ingresos
        top_clientes = Client.objects.annotate(
            total_ingresos=Sum('finances__amount')
        ).order_by('-total_ingresos')[:5]
        
        top_clientes_data = []
        for cliente in top_clientes:
            if cliente.total_ingresos:
                top_clientes_data.append({
                    'id': cliente.id,
                    'nombre': cliente.name,
                    'ingresos': cliente.total_ingresos
                })
        
        return Response({
            'total_clientes': total_clientes,
            'clientes_con_proyectos_activos': clientes_con_proyectos,
            'satisfaccion': {
                'promedio': satisfaccion_promedio['promedio'] or 0,
                'maximo': satisfaccion_promedio['maximo'] or 0,
                'minimo': satisfaccion_promedio['minimo'] or 0
            },
            'top_clientes_por_ingresos': top_clientes_data
        })

class FinanceViewSet(viewsets.ModelViewSet):
    queryset = Finance.objects.all()
    serializer_class = FinanceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def reportes(self, request):
        """Endpoint para generar reportes financieros"""
        # Parámetros de filtrado
        fecha_inicio = request.query_params.get('fecha_inicio', None)
        fecha_fin = request.query_params.get('fecha_fin', None)
        tipo = request.query_params.get('tipo', None)
        cliente_id = request.query_params.get('cliente_id', None)
        proyecto_id = request.query_params.get('proyecto_id', None)
        
        # Base de la consulta
        queryset = Finance.objects.all()
        
        # Aplicar filtros
        if fecha_inicio:
            queryset = queryset.filter(date__gte=fecha_inicio)
        if fecha_fin:
            queryset = queryset.filter(date__lte=fecha_fin)
        if tipo:
            queryset = queryset.filter(transaction_type=tipo)
        if cliente_id:
            queryset = queryset.filter(client_id=cliente_id)
        if proyecto_id:
            queryset = queryset.filter(project_id=proyecto_id)
            
        # Calcular totales
        ingresos = queryset.filter(transaction_type='ingreso').aggregate(total=Sum('amount'))['total'] or 0
        gastos = queryset.filter(transaction_type='gasto').aggregate(total=Sum('amount'))['total'] or 0
        balance = ingresos - gastos
        
        # Agrupar por mes
        from django.db.models.functions import TruncMonth
        resumen_mensual = queryset.annotate(
            mes=TruncMonth('date')
        ).values('mes', 'transaction_type').annotate(
            total=Sum('amount')
        ).order_by('mes', 'transaction_type')
        
        # Formatear resumen mensual
        resumen_formateado = []
        for item in resumen_mensual:
            resumen_formateado.append({
                'mes': item['mes'].strftime('%Y-%m'),
                'tipo': item['transaction_type'],
                'total': float(item['total'])
            })
        
        return Response({
            'ingresos_totales': float(ingresos),
            'gastos_totales': float(gastos),
            'balance': float(balance),
            'resumen_mensual': resumen_formateado
        })

class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

class WhatsAppMessageViewSet(viewsets.ModelViewSet):
    queryset = WhatsAppMessage.objects.all()
    serializer_class = WhatsAppMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

class DashboardView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        # Fecha actual y fecha hace un mes
        today = timezone.now().date()
        last_month = today - timedelta(days=30)
        
        # Ingresos totales
        total_income = Finance.objects.filter(
            transaction_type='ingreso'
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        # Ingresos del mes pasado para comparación
        last_month_income = Finance.objects.filter(
            transaction_type='ingreso',
            date__gte=last_month,
            date__lte=today
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        # Proyectos activos
        active_projects_count = Project.objects.exclude(
            status='completado'
        ).count()
        
        # Proyectos completados el mes pasado
        last_month_completed_projects = Project.objects.filter(
            status='completado',
            end_date__gte=last_month,
            end_date__lte=today
        ).count()
        
        # Miembros del equipo
        team_members_count = TeamMember.objects.count()
        
        # Satisfacción del cliente
        avg_satisfaction = ClientSatisfaction.objects.aggregate(
            avg=Avg('rating')
        )['avg'] or 0
        
        # Mensajes de WhatsApp
        whatsapp_messages_count = WhatsAppMessage.objects.count()
        
        # Proyectos recientes
        recent_projects = Project.objects.all().order_by('-created_at')[:5]
        recent_projects_data = ProjectSerializer(recent_projects, many=True).data
        
        # Actividad reciente
        recent_messages = WhatsAppMessage.objects.all().order_by('-timestamp')[:5]
        recent_messages_data = WhatsAppMessageSerializer(recent_messages, many=True).data
        
        return Response({
            'ingresos_totales': {
                'valor': total_income,
                'cambio_porcentual': 12.5  # Ejemplo, se calcularía con datos reales
            },
            'proyectos_activos': {
                'valor': active_projects_count,
                'cambio_porcentual': 4.2  # Ejemplo
            },
            'miembros_equipo': {
                'valor': team_members_count,
                'cambio_porcentual': 0  # Ejemplo
            },
            'satisfaccion_cliente': {
                'valor': avg_satisfaction,
                'cambio_porcentual': 1.7  # Ejemplo
            },
            'mensajes_whatsapp': {
                'valor': whatsapp_messages_count,
                'cambio_porcentual': 27  # Ejemplo
            },
            'proyectos_recientes': recent_projects_data,
            'actividad_reciente': recent_messages_data
        })