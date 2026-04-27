# Añadir Candidato al Sistema ATS (Enriquecido)

## Descripción Funcional

El reclutador debe poder crear un nuevo candidato en el sistema ATS desde el dashboard. El formulario capturará datos personales, educación, experiencia laboral y permitirá cargar un CV. Los datos se persistirán en PostgreSQL via Prisma.

---

## Modelo de Datos (Prisma Schema)

### Candidate

| Campo | Tipo | Requerido | Restricciones |
|-------|------|----------|---------------|
| id | Int | Sí | PK, auto-incremento |
| email | String | Sí | unique, max 255 |
| firstName | String | Sí | max 100 |
| lastName | String | Sí | max 100 |
| phone | String | No | max 20 |
| address | String | No | max 500 |
| education | Json | No | Array of { institution, degree, startYear, endYear } |
| experience | Json | No | Array of { company, position, startDate, endDate, description } |
| cvData | Bytes | No | BLOB, max 5MB |
| cvFileName | String | No | max 255 |
| cvContentType | String | No | MIME type (application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document) |
| status | Enum | Sí | NEW (default), SCREENING, INTERVIEW, HIRED, REJECTED |
| createdAt | DateTime | Sí | @default(now()) |
| updatedAt | DateTime | Sí | @updatedAt |

---

## API Endpoint

### POST /api/candidates

**Content-Type**: `multipart/form-data`

**Request Body (form-data)**:

```
firstName: string (required)
lastName: string (required)
email: string (required)
phone: string (optional)
address: string (optional)
education: string (optional, JSON stringified array)
experience: string (optional, JSON stringified array)
cv: file (optional, max 5MB)
```

**Responses**:

| Código | Condición |
|--------|-----------|
| 201 Created | Candidate creado exitosamente |
| 400 Bad Request | Validación fallida (email inválido, campos requeridos vacíos, archivo muy grande, tipo no permitido) |
| 409 Conflict | Email ya existe en el sistema |
| 500 Internal Server Error | Error de servidor |

**201 Response Body**:
```json
{
  "id": 1,
  "email": "juan@example.com",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "+34612345678",
  "address": "Calle Mayor 123, Madrid",
  "education": [...],
  "experience": [...],
  "cvFileName": "cv.pdf",
  "status": "NEW",
  "createdAt": "2026-04-26T10:00:00Z",
  "updatedAt": "2026-04-26T10:00:00Z"
}
```

**400 Response Body**:
```json
{
  "error": "Validation failed",
  "details": [
    { "field": "email", "message": "Invalid email format" },
    { "field": "firstName", "message": "Required" }
  ]
}
```

**409 Response Body**:
```json
{
  "error": "Candidate with email juan@example.com already exists"
}
```

---

## Validación de Datos (Backend)

| Campo | Reglas |
|-------|--------|
| email | Required, regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`, unique |
| firstName | Required, max 100 chars, trim whitespace |
| lastName | Required, max 100 chars, trim whitespace |
| phone | Optional, max 20 chars |
| address | Optional, max 500 chars |
| cv | Optional, max 5MB (5242880 bytes), types: `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |

---

## Componentes Frontend

### Archivos a modificar/crear

1. **`frontend/src/components/AddCandidateButton.tsx`**
   - Botón flotante o en toolbar del dashboard
   - Navega a `/candidates/new`

2. **`frontend/src/pages/CandidateFormPage.tsx`**
   - Página con el formulario
   - Usa React Hook Form
   - Manejo de estado de carga/éxito/error

3. **`frontend/src/components/CandidateForm.tsx`**
   - Componente de formulario
   - Campos: firstName, lastName, email, phone, address
   - Educación: lista repetible (añadir/remover)
   - Experiencia: lista repetible (añadir/remover)
   - CV: input file con drag-and-drop

4. **`frontend/src/api/candidates.ts`**
   - Función `createCandidate(formData: FormData): Promise<Candidate>`

5. **`frontend/src/types/candidate.ts`**
   - Typescript interfaces

---

## Pasos para Completar la Tarea

1. **Backend**:
   - Agregar modelo `Candidate` en `schema.prisma`
   - Ejecutar `npx prisma migrate dev --name add_candidate_model`
   - Crear endpoint POST en `src/routes/candidates.ts`
   - Añadir validación con express-validator o Zod
   - Configurar multer para multipart
   - Implementar lógica de guardado
   - Añadir tests unitarios

2. **Frontend**:
   - Instalar react-hook-form si no está
   - Crear componentes del formulario
   - Implementar validación client-side
   - Añadir feedback visual (toast/snackbar)
   - Crear tests del formulario

3. **Documentación**:
   - Actualizar README con nueva endpoint
   - Generar documentación OpenAPI/Swagger

---

## Requisitos No Funcionales

### Seguridad
- Sanitización de inputs contra XSS (usar xss)
- Validación de tipo de archivo (MIME check, no solo extensión)
- Tamaño máximo de archivo enforced en backend

### Rendimiento
- Upload de archivo: máximo 5 segundos
- Creación de candidato: máximo 200ms (sin archivo)
- Índice único en email para búsquedas rápidas

### Compatibilidad
- Navegadores: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Dispositivos: Desktop, Tablet (responsive)
- Pantallas: mínimo 320px width

---

## Tests

### Backend (Jest + Supertest)

- `POST /api/candidates` - 201 cuando datos válidos
- `POST /api/candidates` - 400 cuando email inválido
- `POST /api/candidates` - 400 cuando campos requeridos vacíos
- `POST /api/candidates` - 409 cuando email duplicado
- `POST /api/candidates` - 400 cuando archivo > 5MB
- `POST /api/candidates` - 400 cuando tipo de archivo no permitido

### Frontend (Jest + React Testing Library)

- Renderizado del formulario
- Validación de campos requeridos
- Submit con datos válidos
- Mensaje de error en validación fallida
- Mensaje de éxito después de crear

---

## Notas Adicionales

- Sin autenticación para este MVP (endpoint abierto)
- CV almacenado como BLOB en la base de datos
- Estado inicial: NEW
- Educación/experiencia como JSON editable en texto o array dinámica