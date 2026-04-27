# Database Skill - Backend

## Overview
Esta skill cubre todo lo relacionado con la base de datos PostgreSQL usando Prisma ORM.

## Tech Stack
- **ORM**: Prisma 5.x
- **Database**: PostgreSQL (Docker)
- **Language**: TypeScript 4.9.5

## Configuración

### Prisma Schema
Ubicación: `backend/prisma/schema.prisma`

### Environment Variables (.env)
```env
DB_PASSWORD=<password>
DB_USER=LTIdbUser
DB_NAME=LTIdb
DB_PORT=5432
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}"
```

### Docker Compose
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: LTIdbUser
      POSTGRES_PASSWORD: <password>
      POSTGRES_DB: LTIdb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Modelos Actuales

### User
```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

### Candidate
```prisma
enum CandidateStatus {
  NEW
  SCREENING
  INTERVIEW
  HIRED
  REJECTED
}

model Candidate {
  id             Int              @id @default(autoincrement())
  email          String          @unique @db.VarChar(255)
  firstName      String          @db.VarChar(100)
  lastName       String          @db.VarChar(100)
  phone          String?         @db.VarChar(20)
  address        String?         @db.VarChar(500)
  education      Json?
  experience     Json?
  cvData         Bytes?
  cvFileName     String?         @db.VarChar(255)
  cvContentType  String?
  status         CandidateStatus @default(NEW)
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
}
```

### Notas sobre tipos de datos
- **Json**: Para `education` y `experience` (arrays de objetos)
- **Bytes**: Para `cvData` (BLOB de archivos CV)
- **VarChar(n)**: Para strings con longitud limitada

## Comandos Prisma

### Inicialización
```bash
cd backend
npx prisma init
```

### Desarrollo
```bash
# Generar cliente Prisma
npx prisma generate

# Crear y aplicar migración (desarrollo)
npx prisma migrate dev --name <nombre_migracion>

# Resetear base de datos (desarrollo)
npx prisma migrate reset
```

### Producción
```bash
# Aplicar migraciones
npx prisma migrate deploy

# Generar cliente
npx prisma generate
```

### Otros comandos
```bash
# Visualizar DB en navegador
npx prisma studio

# Validar schema
npx prisma validate

# Pull schema desde DB existente
npx prisma db pull

# Format schema
npx prisma format
```

## Flujo de Trabajo

### Crear nuevo modelo
1. Editar `backend/prisma/schema.prisma`
2. Ejecutar `npx prisma generate`
3. Ejecutar `npx prisma migrate dev --name <nombre>`
4. Verificar con `npx prisma studio`

### Modificar modelo existente
1. Editar `backend/prisma/schema.prisma`
2. Ejecutar `npx prisma migrate dev --name <nombre>`
3. Si hay errores, usar `npx prisma migrate resolve` para marcar como aplicado

## Migraciones

### Estructura
```
backend/prisma/
├── schema.prisma
└── migrations/
    └── <timestamp>_<nombre>/
        └── migration.sql
```

### Verificar migraciones aplicadas
```bash
npx prisma migrate status
```

### Revertir migración
```bash
npx prisma migrate rollback
```

## Queries de Verificación

### Ver tablas
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

### Ver columnas de una tabla
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Candidate';
```

### Ver índices
```sql
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'Candidate';
```

### Ver enums
```sql
SELECT typname, enumlabel 
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE typname = 'candidatestatus';
```

## Mejores Prácticas

1. **Nombrado**: Usar snake_case para migraciones (`add_candidate_model`)
2. **Idempotencia**: Las migraciones deben poder ejecutarse múltiples veces
3. **Testing**: Probar migraciones en desarrollo antes de producción
4. **Backup**: Hacer backup antes de migraciones destructivas
5. **Rollback**: Siempre tener plan de reversión

## Errores comunes

### "Can't reach database server"
- Verificar que PostgreSQL está corriendo: `docker-compose ps`
- Verificar DATABASE_URL en .env

### "P3009"
- La DB tiene tablas que no están en schema. Usar `npx prisma db pull`

### "P3010"
- El nombre de migración ya existe. Usar otro nombre o `--create-only`

### Errores de tipos
- Regenerar cliente: `npx prisma generate`
- Verificar que el schema está bien formado: `npx prisma validate`