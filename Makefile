# HarmonyX CMS v5 - Environment Setup Makefile

.PHONY: help env-all env-cms env-directus env-directus-template env-postgres env-nginx env-redis

help:
	@echo "HarmonyX CMS v5 - Environment Setup"
	@echo ""
	@echo "Available commands:"
	@echo "  help                    Show this help message"
	@echo "  env-all                 Create all .env files"
	@echo "  env-cms                 Create .env.example for CMS app"
	@echo "  env-directus            Create .env.example for Directus app"
	@echo "  env-directus-template   Create .env.example for Directus template app"
	@echo "  env-postgres            Create .env.example for PostgreSQL app"
	@echo "  env-nginx               Create .env.example for Nginx app"
	@echo "  env-redis               Create .env.example for Redis app"

env-all: env-cms env-directus env-directus-template env-postgres env-nginx env-redis
	@echo "All environment files created successfully!"

env-cms:
	@echo "Creating CMS environment template..."
	@mkdir -p apps/cms
	@echo "# HarmonyX CMS - Next.js Application Environment Variables" > apps/cms/.env.example
	@echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" >> apps/cms/.env.example
	@echo "NODE_ENV=development" >> apps/cms/.env.example
	@echo "AUTH_SECRET=TsV7D4wQZBEzQ6JIlXxifJl0/5YAarRyfFkDiDrfsj/UbzlXf0/sTRkcTbc=" >> apps/cms/.env.example
	@echo "AUTH_URL=http://localhost:3000" >> apps/cms/.env.example
	@echo "AUTH_TRUST_HOST=true" >> apps/cms/.env.example
	@echo "STAGE=development" >> apps/cms/.env.example
	@echo "SKIP_ENV_VALIDATION=false" >> apps/cms/.env.example
	@echo "NEXT_TELEMETRY_DISABLED=1" >> apps/cms/.env.example
	@echo "Created apps/cms/.env.example"

env-directus:
	@echo "Creating Directus environment template..."
	@mkdir -p apps/directus
	@echo "# HarmonyX CMS - Directus CMS Environment Variables" > apps/directus/.env.example
	@echo "PORT=8055" >> apps/directus/.env.example
	@echo "PUBLIC_URL=http://localhost:8055" >> apps/directus/.env.example
	@echo "ADMIN_EMAIL=admin@harmonyx.com" >> apps/directus/.env.example
	@echo "ADMIN_PASSWORD=admin123" >> apps/directus/.env.example
	@echo "ADMIN_FIRSTNAME=admin" >> apps/directus/.env.example
	@echo "ADMIN_SURNAME=user" >> apps/directus/.env.example
	@echo "DATABASE_CLIENT=pg" >> apps/directus/.env.example
	@echo "DATABASE_HOST=db" >> apps/directus/.env.example
	@echo "DATABASE_PORT=5432" >> apps/directus/.env.example
	@echo "DATABASE_NAME=directus" >> apps/directus/.env.example
	@echo "DATABASE_USER=directus" >> apps/directus/.env.example
	@echo "DATABASE_PASSWORD=directus" >> apps/directus/.env.example
	@echo "EXTENSIONS_PATH=/directus/extensions" >> apps/directus/.env.example
	@echo "CORS_ENABLED=true" >> apps/directus/.env.example
	@echo "CORS_ORIGIN=*" >> apps/directus/.env.example
	@echo "Created apps/directus/.env.example"

env-directus-template:
	@echo "Creating Directus template environment..."
	@mkdir -p apps/directus_cms_template
	@echo "# HarmonyX CMS - Directus CMS Template Environment Variables" > apps/directus_cms_template/.env.example
	@echo "DIRECTUS_URL=http://directus:8055" >> apps/directus_cms_template/.env.example
	@echo "ADMIN_EMAIL=admin@harmonyx.com" >> apps/directus_cms_template/.env.example
	@echo "ADMIN_PASSWORD=admin123" >> apps/directus_cms_template/.env.example
	@echo "Created apps/directus_cms_template/.env.example"

env-postgres:
	@echo "Creating PostgreSQL environment template..."
	@mkdir -p apps/postgres
	@echo "# HarmonyX CMS - PostgreSQL Database Environment Variables" > apps/postgres/.env.example
	@echo "POSTGRES_DB=directus" >> apps/postgres/.env.example
	@echo "POSTGRES_USER=directus" >> apps/postgres/.env.example
	@echo "POSTGRES_PASSWORD=directus" >> apps/postgres/.env.example
	@echo "Created apps/postgres/.env.example"

env-nginx:
	@echo "Creating Nginx environment template..."
	@mkdir -p apps/nginx
	@echo "# HarmonyX CMS - Nginx Reverse Proxy Environment Variables" > apps/nginx/.env.example
	@echo "NGINX_HTTP_PORT=80" >> apps/nginx/.env.example
	@echo "NGINX_HTTPS_PORT=443" >> apps/nginx/.env.example
	@echo "Created apps/nginx/.env.example"

env-redis:
	@echo "Creating Redis environment template..."
	@mkdir -p apps/redis
	@echo "# HarmonyX CMS - Redis Cache Environment Variables" > apps/redis/.env.example
	@echo "REDIS_HOST=redis" >> apps/redis/.env.example
	@echo "REDIS_PORT=6379" >> apps/redis/.env.example
	@echo "REDIS_PASSWORD=" >> apps/redis/.env.example
	@echo "REDIS_DB=0" >> apps/redis/.env.example
	@echo "Created apps/redis/.env.example"
