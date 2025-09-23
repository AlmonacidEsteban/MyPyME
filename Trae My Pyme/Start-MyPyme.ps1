# Script para iniciar el proyecto MyPyme con Docker en PowerShell
Write-Host "Iniciando MyPyme..." -ForegroundColor Green

# Verificar si Docker está instalado
try {
    docker --version
    Write-Host "Docker encontrado correctamente" -ForegroundColor Green
} catch {
    Write-Host "Error: Docker no está instalado o no está en el PATH" -ForegroundColor Red
    Write-Host "Por favor instala Docker Desktop desde https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
    exit 1
}

# Iniciar los contenedores con docker-compose
Write-Host "Iniciando contenedores con docker-compose..." -ForegroundColor Cyan
docker-compose up -d

# Verificar si los contenedores están funcionando
Write-Host "Verificando estado de los contenedores..." -ForegroundColor Cyan
docker-compose ps

Write-Host "`nMyPyme está ejecutándose!" -ForegroundColor Green
Write-Host "- Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "- Backend API: http://localhost:8000/api" -ForegroundColor Yellow
Write-Host "- Admin Django: http://localhost:8000/admin" -ForegroundColor Yellow

Write-Host "`nPara detener los servicios, ejecuta: docker-compose down" -ForegroundColor Cyan