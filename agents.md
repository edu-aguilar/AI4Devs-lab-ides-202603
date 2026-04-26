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

### Infrastructure
- Docker Compose (PostgreSQL)

## Project Structure

```
AI4Devs-lab-ides-202603/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Entry point, Express app setup
│   │   └── tests/
│   │       └── app.test.ts   # API tests
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env                  # Environment variables
│   ├── .eslintrc.js          # ESLint config
│   ├── .prettierrc           # Code formatting rules
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

## Available Commands

### Backend

| Command | Description |
|---------|-------------|
| `npm install` | Instalar dependencias |
| `npm run dev` | Iniciar desarrollo (ts-node-dev, puerto 3010) |
| `npm run build` | Compilar TypeScript a `dist/` |
| `npm start` | Ejecutar versión producción (`dist/index.js`) |
| `npm test` | Ejecutar tests Jest |
| `npm run prisma:init` | Inicializar Prisma en nuevo proyecto |
| `npm run prisma:generate` | Generar cliente Prisma |
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

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

**Nota**: El modelo `User` es el único actualmente definido. El proyecto está en fase inicial de desarrollo.

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

1. Clonar repositorio
2. Iniciar PostgreSQL:
   ```bash
   docker-compose up -d
   ```
3. Backend:
   ```bash
   cd backend
   npm install
   npx prisma generate
   npm run dev
   ```
4. Frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Documentation

- README.md: Instrucciones completas de setup