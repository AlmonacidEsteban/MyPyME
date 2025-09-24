#!/bin/bash

# Build the project
echo "Building the project..."

cd backend
python3.9 -m pip install -r ../requirements.txt
python3.9 manage.py collectstatic --noinput --clear