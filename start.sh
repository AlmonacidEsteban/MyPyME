#!/usr/bin/env bash

echo "=== Iniciando aplicación MyPyme ==="
echo "Directorio actual: $(pwd)"
echo "Contenido del directorio:"
ls -la

echo "=== Cambiando al directorio backend ==="
cd backend

echo "Directorio backend: $(pwd)"
echo "Contenido del directorio backend:"
ls -la

echo "=== Verificando archivo wsgi.py ==="
if [ -f "mypyme/wsgi.py" ]; then
    echo "✅ Archivo wsgi.py encontrado"
else
    echo "❌ Archivo wsgi.py NO encontrado"
    exit 1
fi

echo "=== Iniciando Gunicorn ==="
exec gunicorn mypyme.wsgi:application --bind 0.0.0.0:$PORT