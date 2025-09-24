#!/usr/bin/env python
"""
Script para ejecutar migraciones en producción
"""
import os
import sys
import django
from django.core.management import execute_from_command_line

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mypyme.settings')
    
    # Cambiar al directorio backend
    backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
    if os.path.exists(backend_dir):
        os.chdir(backend_dir)
    
    django.setup()
    
    print("🔄 Ejecutando migraciones...")
    try:
        execute_from_command_line(['manage.py', 'migrate'])
        print("✅ Migraciones completadas exitosamente")
    except Exception as e:
        print(f"❌ Error en migraciones: {e}")
        sys.exit(1)