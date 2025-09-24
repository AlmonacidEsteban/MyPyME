#!/usr/bin/env python3
"""
Archivo de entrada para Render.com
Redirige a la aplicación Django en el directorio backend
"""

import os
import sys
import logging

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

try:
    logger.info("=== MyPyme Application Starting ===")
    
    # Agregar el directorio backend al path de Python
    backend_path = os.path.join(os.path.dirname(__file__), 'backend')
    sys.path.insert(0, backend_path)
    logger.info(f"Backend path added: {backend_path}")

    # Configurar Django settings
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mypyme.settings')
    logger.info(f"Django settings: {os.environ.get('DJANGO_SETTINGS_MODULE')}")

    # Verificar que Django se puede importar
    import django
    logger.info(f"Django version: {django.get_version()}")
    
    # Configurar Django
    django.setup()
    logger.info("Django setup completed")

    # FORZAR MIGRACIONES EN PRODUCCIÓN
    if os.environ.get('RENDER') or os.environ.get('RAILWAY_ENVIRONMENT'):
        logger.info("=== EJECUTANDO MIGRACIONES AUTOMÁTICAS ===")
        try:
            from django.core.management import execute_from_command_line
            
            # Ejecutar migraciones
            logger.info("Ejecutando migrate...")
            execute_from_command_line(['manage.py', 'migrate', '--verbosity=2'])
            
            # Verificar que auth_user existe
            from django.contrib.auth.models import User
            logger.info("Verificando tabla auth_user...")
            User.objects.exists()
            logger.info("✅ Tabla auth_user confirmada")
            
        except Exception as migration_error:
            logger.error(f"❌ Error en migraciones: {migration_error}")
            # Intentar migrate --run-syncdb como último recurso
            try:
                logger.info("Intentando migrate --run-syncdb...")
                execute_from_command_line(['manage.py', 'migrate', '--run-syncdb', '--verbosity=2'])
                User.objects.exists()
                logger.info("✅ Tabla auth_user creada con --run-syncdb")
            except Exception as syncdb_error:
                logger.error(f"❌ Error con --run-syncdb: {syncdb_error}")
                raise

    # Importar la aplicación WSGI de Django
    from mypyme.wsgi import application
    logger.info("WSGI application imported successfully")

    # Esta es la aplicación que Gunicorn usará
    app = application
    logger.info("Application ready!")

except Exception as e:
    logger.error(f"Error during application startup: {e}")
    import traceback
    logger.error(traceback.format_exc())
    raise

if __name__ == "__main__":
    logger.info("=== MyPyme Application Entry Point ===")
    logger.info(f"Backend path: {backend_path}")
    logger.info(f"Django settings: {os.environ.get('DJANGO_SETTINGS_MODULE')}")
    logger.info("Application ready!")