# Task 1: Prisma Schema - Añadir Modelo Candidate

## Objetivo

Crear el modelo de datos `Candidate` en el schema de Prisma para persistir candidatos en PostgreSQL. Este modelo soporte todos los campos definidos en la user story: datos personales, educación, experiencia laboral, CV como BLOB, y estado del proceso de selección.

---

## Detalles Técnicos

### Modelo Candidate

```prisma
model Candidate {
  id              Int       @id @default(autoincrement())
  email           String    @unique @db.VarChar(255)
  firstName       String    @db.VarChar(100)
  lastName        String    @db.VarChar(100)
  phone           String?   @db.VarChar(20)
  address         String?   @db.VarChar(500)
  education      Json?
  experience     Json?
  cvData          Bytes?
  cvFileName      String?   @db.VarChar(255)
  cvContentType  String?
  status         CandidateStatus @default(NEW)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

enum CandidateStatus {
  NEW
  SCREENING
  INTERVIEW
  HIRED
  REJECTED
}
```

### Campos JSON

**Education estructura:**
```json
[
  {
    "institution": "Universidad de Madrid",
    "degree": "Ingeniero Informática",
    "startYear": 2015,
    "endYear": 2019
  }
]
```

**Experience estructura:**
```json
[
  {
    "company": "Tech Corp",
    "position": "Developer",
    "startDate": "2019-01-01",
    "endDate": "2021-06-30",
    "description": "Desarrollo frontend"
  }
]
```

### Índice Único

- Email: único para evitar duplicados (Prisma `@unique` ya lo crea automáticamente)

---

## Archivos a Modificar

| Archivo | Acción |
|--------|--------|
| `backend/prisma/schema.prisma` | Agregar modelo Candidate y enum CandidateStatus |

---

## Comandos a Ejecutar

```bash
cd backend
npx prisma migrate dev --name add_candidate_model
```

---

## Criterios de Aceptación

1. ✅ Modelo `Candidate` definido con todos los campos de la tabla
2. ✅ `status` usa enum `CandidateStatus` con valores: NEW, SCREENING, INTERVIEW, HIRED, REJECTED
3. ✅ Campo `email` tiene restricción única
4. ✅ Campos `education` y `experience` son tipo Json
5. ✅ Campos `cvData` es tipo Bytes (para BLOB)
6. ✅ Migración ejecutada exitosamente en PostgreSQL
7. ✅ Tabla `Candidate` creada en base de datos
8. ✅ índice único en columna `email` creado

---

## Tests

### unitarios

- Verificar que el modelo Prisma se genera sin errores: `npx prisma generate`
- Verificar que la migración aplica correctamente

### Base de datos

- Consulta SQL para verificar tabla creada: `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Candidate';`
- Verificar índice único: `SELECT indexname FROM pg_indexes WHERE tablename = 'Candidate' AND indexname LIKE '%email%';`