#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Change to backend directory
cd backend

# Collect static files
python manage.py collectstatic --no-input

# Run database migrations
python manage.py migrate