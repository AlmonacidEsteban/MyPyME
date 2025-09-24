#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Starting build process..."
echo "Python version: $(python --version)"

echo "=== VERIFICANDO VARIABLES DE ENTORNO ==="
echo "RENDER env var: ${RENDER:-'Not set'}"
echo "RAILWAY_ENVIRONMENT env var: ${RAILWAY_ENVIRONMENT:-'Not set'}"
echo "All RENDER-related env vars:"
env | grep -i render || echo "No RENDER env vars found"

# Upgrade pip first
pip install --upgrade pip

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Change to backend directory
cd backend

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --no-input

# Run database migrations
echo "Running migrations..."
echo "Current directory: $(pwd)"
echo "Database configuration check..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mypyme.settings')
import django
django.setup()
from django.conf import settings
print('Database engine:', settings.DATABASES['default']['ENGINE'])
print('Database path:', settings.DATABASES['default']['NAME'])
print('RENDER env var:', os.environ.get('RENDER', 'Not set'))
"

echo "=== EJECUTANDO MIGRACIONES ==="
echo "1. Ejecutando migrate normal..."
python manage.py migrate --verbosity=2

echo "2. Verificando si auth_user existe después de migrate..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mypyme.settings')
import django
django.setup()
from django.db import connection
cursor = connection.cursor()
cursor.execute(\"SELECT name FROM sqlite_master WHERE type='table' AND name='auth_user';\")
result = cursor.fetchone()
print('auth_user table exists after migrate:', result is not None)
if not result:
    print('⚠️ auth_user no existe, ejecutando migrate --run-syncdb...')
"

echo "3. Forzando creación de tablas con --run-syncdb..."
python manage.py migrate --run-syncdb --verbosity=2

echo "4. Creando superuser tables manualmente si es necesario..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mypyme.settings')
import django
django.setup()
from django.core.management import execute_from_command_line
from django.db import connection
from django.contrib.auth.models import User

# Verificar conexión a la base de datos
try:
    cursor = connection.cursor()
    cursor.execute('SELECT 1')
    print('✅ Conexión a base de datos exitosa')
except Exception as e:
    print(f'❌ Error de conexión: {e}')

# Intentar crear las tablas de auth manualmente
try:
    from django.core.management.sql import sql_create_index
    from django.db import models
    print('Intentando crear tablas de auth...')
    User.objects.exists()  # Esto forzará la creación de la tabla
    print('✅ Tablas de auth verificadas')
except Exception as e:
    print(f'⚠️ Error al verificar tablas de auth: {e}')
"

echo "=== VERIFICANDO TABLA AUTH_USER ==="
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mypyme.settings')
import django
django.setup()
from django.db import connection
cursor = connection.cursor()
cursor.execute(\"SELECT name FROM sqlite_master WHERE type='table' AND name='auth_user';\")
result = cursor.fetchone()
print('auth_user table exists:', result is not None)
if result:
    print('✅ Database setup successful!')
else:
    print('❌ Database setup failed!')
    exit(1)
"

echo "Build completed successfully!"