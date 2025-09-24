FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Railway will provide PORT environment variable
EXPOSE 8000

# Use shell form to allow environment variable expansion
CMD gunicorn backend.mypyme.wsgi:application --bind 0.0.0.0:${PORT:-8000}