#!/usr/bin/env python3
"""
Archivo de entrada para Render.com
Redirige a la aplicación Django en el directorio backend
"""

import os
import sys

# Agregar el directorio backend al path de Python
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

# Configurar Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mypyme.settings')

# Importar la aplicación WSGI de Django
from mypyme.wsgi import application

# Esta es la aplicación que Gunicorn usará
app = application

if __name__ == "__main__":
    print("=== MyPyme Application Entry Point ===")
    print(f"Backend path: {backend_path}")
    print(f"Django settings: {os.environ.get('DJANGO_SETTINGS_MODULE')}")
    print("Application ready!")