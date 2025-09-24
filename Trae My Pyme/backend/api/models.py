from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):
    STATUS_CHOICES = (
        ('en_progreso', 'En Progreso'),
        ('planificacion', 'Planificación'),
        ('revision', 'Revisión'),
        ('completado', 'Completado'),
    )
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planificacion')
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    progress = models.IntegerField(default=0)  # Porcentaje de progreso
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

class Client(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

class Finance(models.Model):
    TRANSACTION_TYPE = (
        ('ingreso', 'Ingreso'),
        ('gasto', 'Gasto'),
    )
    
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPE)
    description = models.CharField(max_length=255)
    date = models.DateField()
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, blank=True, related_name='finances')
    client = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True, blank=True, related_name='finances')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.transaction_type} - {self.amount}"

class TeamMember(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    position = models.CharField(max_length=100)
    bio = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='team/', null=True, blank=True)
    projects = models.ManyToManyField(Project, related_name='team_members', blank=True)
    
    def __str__(self):
        return self.user.get_full_name() or self.user.username

class WhatsAppMessage(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='whatsapp_messages')
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_incoming = models.BooleanField(default=True)  # True si es recibido, False si es enviado
    
    def __str__(self):
        return f"Mensaje de {self.client.name} - {self.timestamp.strftime('%d/%m/%Y %H:%M')}"

class ClientSatisfaction(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='satisfaction_ratings')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='satisfaction_ratings')
    rating = models.IntegerField()  # Escala del 1 al 100
    feedback = models.TextField(blank=True)
    date = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return f"Satisfacción de {self.client.name} - {self.rating}%"