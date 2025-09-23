# MyPyme - Sistema de Gestión para PyMEs

MyPyme es un sistema de gestión integral para pequeñas y medianas empresas que permite administrar proyectos, finanzas, clientes, equipo y comunicaciones a través de WhatsApp.

## Tecnologías Utilizadas

- **Backend**: Django, Django REST Framework, PostgreSQL
- **Frontend**: React, Styled Components, Chart.js
- **Infraestructura**: Docker, Docker Compose
- **Control de Versiones**: GitHub

## Características Principales

- **Dashboard Interactivo**: Visualización de métricas clave del negocio
- **Gestión de Proyectos**: Seguimiento de proyectos, estados y progreso
- **Administración Financiera**: Control de ingresos y gastos
- **Gestión de Clientes**: Base de datos de clientes y satisfacción
- **Equipo de Trabajo**: Administración de miembros del equipo
- **Integración con WhatsApp**: Comunicación directa con clientes
- **Calendario**: Organización de eventos y reuniones
- **Reportes**: Generación de informes personalizados

## Estructura del Proyecto

```
MyPyme/
├── backend/               # Aplicación Django
│   ├── api/              # API REST
│   ├── mypyme/           # Configuración del proyecto
│   ├── Dockerfile        # Configuración de Docker para backend
│   └── requirements.txt  # Dependencias de Python
├── frontend/             # Aplicación React
│   ├── public/           # Archivos estáticos
│   ├── src/              # Código fuente
│   │   ├── components/   # Componentes reutilizables
│   │   ├── contexts/     # Contextos de React (Auth, etc.)
│   │   ├── layouts/      # Layouts de la aplicación
│   │   ├── pages/        # Páginas principales
│   │   └── App.js        # Componente principal
│   ├── Dockerfile        # Configuración de Docker para frontend
│   └── package.json      # Dependencias de Node.js
├── docker-compose.yml    # Configuración de servicios
└── README.md             # Documentación
```

## Requisitos Previos

- Docker y Docker Compose
- Git

## Instalación y Ejecución

1. Clonar el repositorio:
   ```
   git clone <URL_DEL_REPOSITORIO>
   cd MyPyme
   ```

2. Iniciar los servicios con Docker Compose:

   **Usando PowerShell:**
   ```powershell
   # Ejecutar el script de inicio
   .\Start-MyPyme.ps1
   
   # O manualmente
   docker-compose up -d
   ```

   **Usando Bash:**
   ```bash
   docker-compose up -d
   ```

3. Crear superusuario para el panel de administración:
   
   **PowerShell:**
   ```powershell
   docker-compose exec backend python manage.py createsuperuser
   ```
   
   **Bash:**
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

4. Acceder a la aplicación:
   - Frontend: http://localhost:3000
   - API: http://localhost:8000/api/
   - Admin: http://localhost:8000/admin/

## Desarrollo

### Backend

Para ejecutar migraciones o comandos de Django:

**PowerShell:**
```powershell
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py makemigrations
```

**Bash:**
```bash
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py makemigrations
```

### Frontend

Para instalar nuevas dependencias:

**PowerShell:**
```powershell
docker-compose exec frontend npm install <package-name>
```

**Bash:**
```bash
docker-compose exec frontend npm install <package-name>
```

## Contribución

1. Crear una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
2. Hacer commit de tus cambios: `git commit -m 'Añadir nueva funcionalidad'`
3. Hacer push a la rama: `git push origin feature/nueva-funcionalidad`
4. Enviar un Pull Request

## Licencia

Este proyecto está licenciado bajo [MIT License](LICENSE).