FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Railway will provide PORT environment variable
EXPOSE 8000

# Run diagnostics and then start gunicorn
CMD echo "🚀 Iniciando MyPyme en Railway..." && \
    python check_django.py && \
    echo "✅ Diagnóstico completado, iniciando servidor..." && \
    gunicorn backend.mypyme.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 2 --timeout 120