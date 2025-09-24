from rest_framework import serializers
from .models import Project, Client, Finance, TeamMember, WhatsAppMessage, ClientSatisfaction

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class FinanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Finance
        fields = '__all__'

class TeamMemberSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = TeamMember
        fields = ['id', 'username', 'full_name', 'position', 'bio', 'profile_image', 'projects']

class WhatsAppMessageSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True)
    
    class Meta:
        model = WhatsAppMessage
        fields = ['id', 'client', 'client_name', 'message', 'timestamp', 'is_incoming']

class ClientSatisfactionSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)
    
    class Meta:
        model = ClientSatisfaction
        fields = ['id', 'client', 'client_name', 'project', 'project_name', 'rating', 'feedback', 'date']