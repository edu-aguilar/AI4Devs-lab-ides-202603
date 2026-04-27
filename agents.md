# LTI - Sistema de Seguimiento de Talento

## Project Overview

- **Name**: LTI (Applicant Tracking System)
- **Type**: Full-stack web application
- **Purpose**: Gestionar candidatos en procesos de selección
- **Status**: Proyecto en desarrollo activo

## Tech Stack

### Frontend
- React 18 (Create React App)
- TypeScript 4.9.5
- Puerto: `http://localhost:3000`
- Testing: Jest + React Testing Library

### Backend
- Express.js 4.x
- TypeScript 4.9.5
- Prisma ORM 5.x
- PostgreSQL
- Puerto: `http://localhost:3010`
- Testing: Jest + Supertest
- API Docs: Swagger UI (`/api-docs`)
- Validation: Zod
- XSS: xss library
- File Upload: Multer

### Infrastructure
- Docker Compose (PostgreSQL)

## Project Structure

```
AI4Devs-lab-ides-202603/
├── backend/
│   ├── src/
│   │   ├── app.ts            # Express app factory
│   │   ├── index.ts          # Entry point (listen)
│   │   ├── ui/               # Capa UI (routes, validators, middleware)
│   │   │   ├── routes/
│   │   │   ├── validators/
│   │   │   └── middleware/
│   │   ├── domain/           # Capa Domain (entities, use cases, interfaces)
│   │   │   ├── entities/
│   │   │   ├── repositories/
│   │   │   └── useCases/
│   │   ├── infrastructure/   # Capa Infrastructure (Prisma repositories)
│   │   │   └── repositories/
│   │   └── tests/
│   │       ├── app.test.ts
│   │       └── candidates.test.ts
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env                  # Environment variables
│   ├── .eslintrc.js          # ESLint config
│   ├── .prettierrc          # Code formatting rules
│   └── jest.config.js
├── frontend/
│   ├── src/
│   │   ├── App.tsx           # Main component
│   │   ├── index.tsx         # Entry point
│   │   ├── index.css         # Global styles
│   │   └── tests/            # Tests
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
├── docker-compose.yml
├── README.md
└── agents.md
```

## Environment Variables

### Backend (.env)
```env
DB_PASSWORD=<password>
DB_USER=LTIdbUser
DB_NAME=LTIdb
DB_PORT=5432
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}"
```

### Database Connection (Docker Compose)
- **Host**: localhost
- **Port**: 5432
- **User**: LTIdbUser
- **Database**: LTIdb

## Testing

### Frontend Testing
- **Skill**: [frontend/.opencode/testing.md](frontend/.opencode/testing.md) - Configuración, patrones y mejores prácticas de testing

## Backend Skills

### Architecture
- **Skill**: [backend/.opencode/architecture.md](backend/.opencode/architecture.md) - Patrón ui/domain/infrastructure, Repository pattern, Use case pattern

### API Development
- **Skill**: [backend/.opencode/api.md](backend/.opencode/api.md) - Endpoints REST, routing, Multer for file uploads

### Validation
- **Skill**: [backend/.opencode/validation.md](backend/.opencode/validation.md) - Zod schemas, XSS sanitization

### Testing
- **Skill**: [backend/.opencode/testing.md](backend/.opencode/testing.md) - Jest + Supertest for API testing

### Swagger
- **Skill**: [backend/.opencode/swagger.md](backend/.opencode/swagger.md) - OpenAPI docs, JSDoc annotations

### Database
- **Skill**: [backend/.opencode/database.md](backend/.opencode/database.md) - Prisma ORM, models, migrations

## Available Commands

### Backend

| Command | Description |
|---------|-------------|
| `source ~/.nvm/nvm.sh && nvm use` | Activar Node 22 (requerido antes de npm/npx) |
| `npm install` | Instalar dependencias |
| `npm run dev` | Iniciar desarrollo (ts-node-dev, puerto 3010) |
| `npm run build` | Compilar TypeScript a `dist/` |
| `npm start` | Ejecutar versión producción (`dist/index.js`) |
| `npm test` | Ejecutar tests Jest |
| `npm run prisma:init` | Inicializar Prisma en nuevo proyecto |
| `npm run prisma:generate` | Generar cliente Prisma |
| `npx prisma migrate dev --name <name>` | Crear y aplicar migración (desarrollo) |
| `npx prisma migrate deploy` | Aplicar migraciones (producción) |
| `npm run start:prod` | Build + start producción |

### Frontend

| Command | Description |
|---------|-------------|
| `npm install` | Instalar dependencias |
| `npm start` | Iniciar desarrollo (puerto 3000) |
| `npm run build` | Crear build de producción en `build/` |
| `npm test` | Ejecutar tests Jest |

### Database

| Command | Description |
|---------|-------------|
| `docker-compose up -d` | Iniciar contenedor PostgreSQL |
| `docker-compose down` | Detener contenedor PostgreSQL |

## Database Schema (Prisma)

- **Skill**: [backend/.opencode/database.md](backend/.opencode/database.md) - Configuración, modelos, comandos y mejores prácticas de Prisma

### User Model
```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

## Code Conventions

### Backend
- **Linting**: ESLint con plugin Prettier (`plugin:prettier/recommended`)
- **Formatting**: Prettier (single quotes, trailing commas)
- **TypeScript**: Estricto (`strict: true`)
- **Testing**: Jest + Supertest para API tests
- **ES Target**: ES5

### Frontend
- **React**: Components en `.tsx`, hooks para estado
- **TypeScript**: Estricto
- **Testing**: React Testing Library + Jest
- **ES Target**: ES5

## Getting Started

### Prerequisites
- Node.js 22 (managed via nvm)
- Docker & Docker Compose

### Setup
1. Clonar repositorio
2. Activar nvm:
   ```bash
   source ~/.nvm/nvm.sh && nvm use
   ```
3. Iniciar PostgreSQL:
   ```bash
   docker-compose up -d
   ```
4. Backend:
   ```bash
   cd backend
   npm install
   npx prisma generate
   npm run dev
   ```
5. Frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Documentation

- README.md: Instrucciones completas de setup