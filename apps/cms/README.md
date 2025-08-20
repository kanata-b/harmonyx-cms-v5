# 🎵 HarmonyX CMS v5

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Directus](https://img.shields.io/badge/Directus-19.1.0-6644FF?style=for-the-badge&logo=directus)](https://directus.io/)

A modern, full-stack Content Management System built with Next.js 15, TypeScript, and Directus. Features a beautiful UI, internationalization, and powerful performance optimizations.

## ✨ Features

### 🎨 **Modern UI/UX**
- Beautiful, responsive design with shadcn/ui components
- Dark/Light theme support with smooth transitions
- Modern header with gradient branding and mobile-first navigation
- Professional admin dashboard with advanced analytics

### 🌐 **Internationalization**
- Multi-language support (English, Thai)
- Next.js 15 App Router with locale-based routing
- Dynamic content localization through Directus

### 🚀 **Performance & SEO**
- Next.js 15 with Turbopack for lightning-fast development
- Server-side rendering and static generation
- Advanced caching strategies with Redis
- Optimized images with Next.js Image component
- SEO-friendly metadata generation

### 📝 **Content Management**
- Headless CMS powered by Directus
- Rich post management with categories and tags
- Image optimization and CDN integration
- Advanced content filtering and search

### 🔧 **Developer Experience**
- Full TypeScript support with strict type checking
- tRPC for end-to-end type safety
- ESLint and Prettier for code consistency
- Docker-compose for easy local development

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript 5.3.3
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: shadcn/ui with Radix UI primitives
- **State Management**: TanStack Query v5
- **API Layer**: tRPC v11

### Backend & Database
- **Headless CMS**: Directus 19.1.0
- **Database**: PostgreSQL 16
- **Caching**: Redis 7
- **File Storage**: Directus built-in with image transformations

### DevOps & Tools
- **Containerization**: Docker & Docker Compose
- **Package Manager**: pnpm
- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier
- **Build Tool**: Turbopack (development)

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17+
- pnpm 8+
- Docker & Docker Compose

### 1. Clone the Repository
```bash
git clone https://github.com/kanata-b/harmonyx-cms-v5.git
cd harmonyx-cms-v5
```

### 2. Environment Setup
```bash
# Copy environment files
cp apps/cms/.env.example apps/cms/.env
cp .env.example .env

# Configure your environment variables
# Edit apps/cms/.env with your settings
```

### 3. Start Development Environment
```bash
# Start all services (Directus, PostgreSQL, Redis)
docker compose up -d

# Install dependencies
cd apps/cms
pnpm install

# Start Next.js development server
pnpm dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Directus CMS**: http://localhost:8055

## 📁 Project Structure

```
harmonyx-cms-v5/
├── apps/
│   └── cms/                    # Next.js Frontend Application
│       ├── app/                # Next.js App Router
│       │   ├── [locale]/       # Internationalized routes
│       │   │   ├── admin/      # Admin dashboard
│       │   │   ├── posts/      # Post pages
│       │   │   └── pages/      # Static pages
│       │   └── api/            # API routes
│       ├── components/         # React components
│       │   ├── cms/            # CMS-specific components
│       │   ├── common/         # Shared components
│       │   ├── performance/    # Performance components
│       │   ├── theme/          # Theme components
│       │   └── ui/             # shadcn/ui components
│       ├── hooks/              # Custom React hooks
│       ├── i18n/               # Internationalization
│       ├── lib/                # Utility libraries
│       │   ├── auth/           # Authentication
│       │   └── directus/       # Directus integration
│       ├── messages/           # i18n message files
│       └── server/             # tRPC server setup
├── directus/                   # Directus CMS configuration
├── nginx/                      # Nginx reverse proxy
├── postgres/                   # PostgreSQL configuration
└── redis/                      # Redis configuration
```

## 🔧 Development

### Available Scripts
```bash
# Development
pnpm dev              # Start development server with Turbopack
pnpm dev:debug        # Start with debugging enabled

# Building
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint with auto-fix
pnpm lint:check       # Check linting without fixes
pnpm format           # Format code with Prettier

# Type Checking
pnpm type-check       # Run TypeScript compiler check
```

### Environment Variables

#### Required Variables
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/harmonyx
REDIS_URL=redis://localhost:6379

# Directus
DIRECTUS_URL=http://localhost:8055
DIRECTUS_TOKEN=your-directus-token

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

#### Optional Variables
```env
# Performance
NEXT_TELEMETRY_DISABLED=1
SKIP_ENV_VALIDATION=false

# Development
NODE_ENV=development
PORT=3000
```

## 🐳 Docker Development

### Services Overview
- **cms-app**: Next.js frontend application
- **directus**: Headless CMS backend
- **postgres**: PostgreSQL database
- **redis**: Redis caching layer
- **nginx**: Reverse proxy and SSL termination

### Docker Commands
```bash
# Start all services
docker compose up -d

# Start specific service
docker compose up directus

# View logs
docker compose logs cms-app
docker compose logs directus

# Rebuild services
docker compose build --no-cache

# Stop all services
docker compose down
```

## 🌐 Internationalization

### Supported Languages
- 🇺🇸 English (en)
- 🇹🇭 Thai (th)

### Adding New Languages
1. Add locale to `i18n/routing.ts`
2. Create message file in `messages/{locale}.json`
3. Configure Directus translations
4. Update navigation configuration

### Usage
```typescript
import { useTranslations } from 'next-intl';

function Component() {
  const t = useTranslations('common');
  return <h1>{t('welcome')}</h1>;
}
```

## 📊 Performance Features

### Caching Strategy
- **Static Generation**: Pre-generated pages for better performance
- **Incremental Static Regeneration**: Dynamic content with caching
- **Redis Caching**: API response caching
- **Image Optimization**: Next.js Image component with Directus

### Performance Components
- **LazyImage**: Lazy-loaded images with placeholders
- **CachedQueries**: Cached Directus API calls
- **Performance Monitoring**: Built-in performance tracking

## 🔒 Authentication & Security

### Features
- NextAuth.js integration
- Role-based access control
- Secure session management
- CSRF protection
- Environment variable validation

### Admin Access
- Protected admin routes
- Directus user management
- Role-based content access

## 🚀 Deployment

### Production Build
```bash
# Build application
pnpm build

# Start production server
pnpm start
```

### Environment Considerations
- Set `NODE_ENV=production`
- Configure proper database URLs
- Set secure `NEXTAUTH_SECRET`
- Configure image domains for optimization

### Recommended Platforms
- **Vercel**: Optimal Next.js deployment
- **Railway**: Full-stack with PostgreSQL
- **DigitalOcean**: Docker-based deployment
- **AWS**: ECS with RDS and ElastiCache

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards
- Follow TypeScript strict mode
- Use Prettier for formatting
- Follow ESLint rules
- Write meaningful commit messages
- Add tests for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- 📖 [Documentation](https://github.com/kanata-b/harmonyx-cms-v5/wiki)
- 🐛 [Issue Tracker](https://github.com/kanata-b/harmonyx-cms-v5/issues)
- 💬 [Discussions](https://github.com/kanata-b/harmonyx-cms-v5/discussions)

### Common Issues
- **Port conflicts**: Change ports in docker-compose.yml
- **Database connection**: Check PostgreSQL service status
- **Build errors**: Clear `.next` cache and rebuild
- **Image loading**: Verify Directus image domains configuration

---

<div align="center">
  <p>Built with ❤️ by the HarmonyX team</p>
  <p>
    <a href="https://nextjs.org">Next.js</a> •
    <a href="https://directus.io">Directus</a> •
    <a href="https://tailwindcss.com">Tailwind CSS</a> •
    <a href="https://www.typescriptlang.org">TypeScript</a>
  </p>
</div>
