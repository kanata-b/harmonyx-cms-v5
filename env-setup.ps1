# HarmonyX CMS v5 - Environment Setup PowerShell Script
# This script creates .env files based on existing templates

param(
    [Parameter(Mandatory=$false)]
    [string]$Command = "help"
)

function Show-Help {
    Write-Host "HarmonyX CMS v5 - Environment Setup" -ForegroundColor Green
    Write-Host ""
    Write-Host "Available commands:" -ForegroundColor Cyan
    Write-Host "  help                    Show this help message" -ForegroundColor White
    Write-Host "  env-all                 Create all .env files from templates" -ForegroundColor White
    Write-Host "  env-cms                 Create .env.example for CMS app" -ForegroundColor White
    Write-Host "  env-directus            Create .env.example for Directus app" -ForegroundColor White
    Write-Host "  env-directus-template   Create .env.example for Directus template app" -ForegroundColor White
    Write-Host "  env-postgres            Create .env.example for PostgreSQL app" -ForegroundColor White
    Write-Host "  env-nginx               Create .env.example for Nginx app" -ForegroundColor White
    Write-Host "  env-redis               Create .env.example for Redis app" -ForegroundColor White
    Write-Host ""
    Write-Host "Usage: .\env-setup.ps1 [command]" -ForegroundColor Yellow
    Write-Host "Example: .\env-setup.ps1 env-all" -ForegroundColor Yellow
}

function Create-CmsEnv {
    Write-Host "Creating CMS environment template..." -ForegroundColor Yellow
    
    if (!(Test-Path "apps\cms")) {
        New-Item -ItemType Directory -Path "apps\cms" -Force | Out-Null
    }
    
    $envContent = @"
# =============================================================================
# HarmonyX CMS - Next.js Application Environment Variables
# =============================================================================

# Next.js Environment Variables
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055

# Development optimizations
NODE_ENV=development
# If run on Docker : http://directus:8055 
# If run on Local : http://localhost:8055 
DIRECTUS_URL=http://directus:8055 

# Auth configuration
AUTH_SECRET=TsV7D4wQZBEzQ6JIlXxifJl0/5YAarRyfFkDiDrfsj/UbzlXf0/sTRkcTbc=
AUTH_URL=http://localhost:3000
AUTH_TRUST_HOST=true

# Stage configuration
STAGE=development

# Skip environment validation during development for faster builds
SKIP_ENV_VALIDATION=false

# Fast Refresh optimization
NEXT_TELEMETRY_DISABLED=1
"@
    
    $envContent | Out-File -FilePath "apps\cms\.env.example" -Encoding UTF8
    Write-Host "Created apps/cms/.env.example" -ForegroundColor Green
}

function Create-DirectusEnv {
    Write-Host "Creating Directus environment template..." -ForegroundColor Yellow
    
    if (!(Test-Path "apps\directus")) {
        New-Item -ItemType Directory -Path "apps\directus" -Force | Out-Null
    }
    
    $envContent = @"
# =============================================================================
# HarmonyX CMS - Directus CMS Environment Variables
# =============================================================================

# Directus Server Configuration
PORT=8055
PUBLIC_URL=http://localhost:8055

# Admin User Setup - Change in production!
ADMIN_EMAIL=admin@harmonyx.com
ADMIN_PASSWORD=admin123
ADMIN_FIRSTNAME=admin
ADMIN_SURNAME=user

# Database Configuration
DATABASE_CLIENT=pg
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_NAME=directus
DATABASE_USER=directus
DATABASE_PASSWORD=directus

# Extensions
EXTENSIONS_PATH=/directus/extensions

# CORS Configuration
CORS_ENABLED=true
CORS_ORIGIN=*
"@
    
    $envContent | Out-File -FilePath "apps\directus\.env.example" -Encoding UTF8
    Write-Host "Created apps/directus/.env.example" -ForegroundColor Green
}

function Create-DirectusTemplateEnv {
    Write-Host "Creating Directus template environment..." -ForegroundColor Yellow
    
    if (!(Test-Path "apps\directus_cms_template")) {
        New-Item -ItemType Directory -Path "apps\directus_cms_template" -Force | Out-Null
    }
    
    $envContent = @"
# =============================================================================
# HarmonyX CMS - Directus CMS Template Environment Variables
# =============================================================================

# Directus Connection
DIRECTUS_URL=http://directus:8055

# Admin Credentials - Change in production!
ADMIN_EMAIL=admin@harmonyx.com
ADMIN_PASSWORD=admin123
"@
    
    $envContent | Out-File -FilePath "apps\directus_cms_template\.env.example" -Encoding UTF8
    Write-Host "Created apps/directus_cms_template/.env.example" -ForegroundColor Green
}

function Create-PostgresEnv {
    Write-Host "Creating PostgreSQL environment template..." -ForegroundColor Yellow
    
    if (!(Test-Path "apps\postgres")) {
        New-Item -ItemType Directory -Path "apps\postgres" -Force | Out-Null
    }
    
    $envContent = @"
# =============================================================================
# HarmonyX CMS - PostgreSQL Database Environment Variables
# =============================================================================

# PostgreSQL Database Configuration - Change passwords in production!
POSTGRES_DB=directus
POSTGRES_USER=directus
POSTGRES_PASSWORD=directus
"@
    
    $envContent | Out-File -FilePath "apps\postgres\.env.example" -Encoding UTF8
    Write-Host "Created apps/postgres/.env.example" -ForegroundColor Green
}

function Create-NginxEnv {
    Write-Host "Creating Nginx environment template..." -ForegroundColor Yellow
    
    if (!(Test-Path "apps\nginx")) {
        New-Item -ItemType Directory -Path "apps\nginx" -Force | Out-Null
    }
    
    $envContent = @"
# =============================================================================
# HarmonyX CMS - Nginx Reverse Proxy Environment Variables
# =============================================================================

# Nginx Port Configuration
NGINX_HTTP_PORT=80
NGINX_HTTPS_PORT=443
"@
    
    $envContent | Out-File -FilePath "apps\nginx\.env.example" -Encoding UTF8
    Write-Host "Created apps/nginx/.env.example" -ForegroundColor Green
}

function Create-RedisEnv {
    Write-Host "Creating Redis environment template..." -ForegroundColor Yellow
    
    if (!(Test-Path "apps\redis")) {
        New-Item -ItemType Directory -Path "apps\redis" -Force | Out-Null
    }
    
    $envContent = @"
# =============================================================================
# HarmonyX CMS - Redis Cache Environment Variables
# =============================================================================

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
"@
    
    $envContent | Out-File -FilePath "apps\redis\.env.example" -Encoding UTF8
    Write-Host "Created apps/redis/.env.example" -ForegroundColor Green
}

function Create-AllEnv {
    Write-Host "Creating all environment files..." -ForegroundColor Cyan
    Create-CmsEnv
    Create-DirectusEnv
    Create-DirectusTemplateEnv
    Create-PostgresEnv
    Create-NginxEnv
    Create-RedisEnv
    Write-Host "All environment files created successfully!" -ForegroundColor Green
}

# Main script execution
switch ($Command.ToLower()) {
    "help" { Show-Help }
    "env-all" { Create-AllEnv }
    "env-cms" { Create-CmsEnv }
    "env-directus" { Create-DirectusEnv }
    "env-directus-template" { Create-DirectusTemplateEnv }
    "env-postgres" { Create-PostgresEnv }
    "env-nginx" { Create-NginxEnv }
    "env-redis" { Create-RedisEnv }
    default { 
        Write-Host "Unknown command: $Command" -ForegroundColor Red
        Write-Host ""
        Show-Help 
    }
}
