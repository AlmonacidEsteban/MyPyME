#!/bin/bash

echo "🚀 Starting MyPyme Production Server..."

# Verificar que estamos en el directorio correcto
echo "📁 Current directory: $(pwd)"
echo "📋 Files in directory:"
ls -la

# Verificar Python y dependencias
echo "🐍 Python version: $(python --version)"
echo "📦 Pip version: $(pip --version)"

# Verificar que Django está instalado
echo "🔧 Checking Django installation..."
python -c "import django; print(f'Django version: {django.get_version()}')" || {
    echo "❌ Django not found!"
    exit 1
}

# Verificar estructura del proyecto
echo "📂 Checking project structure..."
if [ ! -d "backend" ]; then
    echo "❌ Backend directory not found!"
    exit 1
fi

if [ ! -f "backend/manage.py" ]; then
    echo "❌ manage.py not found in backend!"
    exit 1
fi

# Ejecutar migraciones
echo "🔄 Running migrations..."
cd backend
python manage.py migrate --noinput || {
    echo "❌ Migrations failed!"
    exit 1
}

# Verificar configuración de Django
echo "🔍 Checking Django configuration..."
python manage.py check || {
    echo "❌ Django check failed!"
    exit 1
}

# Volver al directorio raíz
cd ..

# Iniciar el servidor
echo "🌟 Starting Gunicorn server..."
exec gunicorn app:app --bind 0.0.0.0:${PORT:-8000} --workers 2 --timeout 120 --log-level info