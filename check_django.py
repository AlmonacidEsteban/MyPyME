#!/usr/bin/env python
"""
Script de diagnóstico para verificar la configuración de Django en Railway
"""
import os
import sys

def check_environment():
    print("=== DIAGNÓSTICO DE DJANGO EN RAILWAY ===")
    print()
    
    # Verificar variables de entorno críticas
    print("🔍 Variables de entorno:")
    env_vars = ['SECRET_KEY', 'DEBUG', 'RAILWAY_ENVIRONMENT', 'DATABASE_URL', 'PORT']
    for var in env_vars:
        value = os.environ.get(var, 'NO DEFINIDA')
        if var == 'SECRET_KEY' and value != 'NO DEFINIDA':
            value = f"{value[:10]}..." if len(value) > 10 else value
        print(f"  {var}: {value}")
    
    print()
    
    # Verificar configuración de Django
    print("🔧 Configuración de Django:")
    try:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.mypyme.settings')
        import django
        django.setup()
        
        from django.conf import settings
        print(f"  DEBUG: {settings.DEBUG}")
        print(f"  ALLOWED_HOSTS: {settings.ALLOWED_HOSTS}")
        print(f"  DATABASE ENGINE: {settings.DATABASES['default']['ENGINE']}")
        print(f"  SECRET_KEY configurado: {'Sí' if settings.SECRET_KEY else 'No'}")
        
    except Exception as e:
        print(f"  ❌ Error al cargar Django: {e}")
        return False
    
    print()
    
    # Verificar conexión a base de datos
    print("🗄️ Base de datos:")
    try:
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        print("  ✅ Conexión exitosa")
    except Exception as e:
        print(f"  ❌ Error de conexión: {e}")
        return False
    
    print()
    print("✅ Diagnóstico completado")
    return True

if __name__ == "__main__":
    success = check_environment()
    sys.exit(0 if success else 1)