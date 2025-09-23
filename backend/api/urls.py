from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProjectViewSet, 
    ClientViewSet, 
    FinanceViewSet, 
    TeamMemberViewSet,
    WhatsAppMessageViewSet,
    DashboardView
)

router = DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'clients', ClientViewSet)
router.register(r'finances', FinanceViewSet)
router.register(r'team', TeamMemberViewSet)
router.register(r'whatsapp', WhatsAppMessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
]