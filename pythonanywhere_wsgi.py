import os
import sys

# Agregar el directorio del proyecto al path
path = '/home/yourusername/MyPyme/backend'
if path not in sys.path:
    sys.path.insert(0, path)

# Configurar Django
os.environ['DJANGO_SETTINGS_MODULE'] = 'mypyme.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()