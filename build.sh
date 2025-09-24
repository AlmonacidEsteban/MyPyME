#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Starting build process..."
echo "Python version: $(python --version)"

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

echo "Running migrate command..."
python manage.py migrate --verbosity=2

echo "Checking if auth_user table exists..."
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