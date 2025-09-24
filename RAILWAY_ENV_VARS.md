# Variables de Entorno para Railway

## Variables obligatorias que debes configurar en Railway:

### 1. SECRET_KEY
```
SECRET_KEY=tu-clave-secreta-super-segura-aqui-cambiar-por-una-real
```
**Importante**: Genera una clave secreta única y segura. Puedes usar: https://djecrety.ir/

### 2. DEBUG
```
DEBUG=0
```
**Importante**: Siempre debe ser 0 en producción

### 3. ALLOWED_HOSTS
```
ALLOWED_HOSTS=*.railway.app,tu-dominio-personalizado.com
```
**Nota**: Railway te dará un dominio como `tu-app.railway.app`. Reemplaza con tu dominio real.

### 4. DATABASE_URL
```
Esta variable la proporciona Railway automáticamente cuando agregas PostgreSQL
```

## Cómo configurar en Railway:

1. Ve a tu proyecto en Railway
2. Haz clic en la pestaña "Variables"
3. Agrega cada variable con su valor correspondiente
4. Haz clic en "Deploy" para aplicar los cambios

## Servicios adicionales necesarios:

1. **PostgreSQL Database**: 
   - En Railway, haz clic en "Add Service" 
   - Selecciona "PostgreSQL"
   - Railway configurará automáticamente DATABASE_URL

## Ejemplo de SECRET_KEY segura:
```
SECRET_KEY=django-insecure-@#$%^&*()_+{}|:<>?[]=-0987654321qwertyuiopasdfghjklzxcvbnm
```