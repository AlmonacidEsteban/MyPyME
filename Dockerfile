FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Railway provides PORT environment variable
EXPOSE $PORT

# Use gunicorn for production with Railway's PORT
CMD gunicorn backend.mypyme.wsgi:application --bind 0.0.0.0:$PORT