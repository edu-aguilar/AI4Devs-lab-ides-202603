# Task 2: Backend API - Endpoint POST /api/candidates

## Objetivo

Crear el endpoint REST `POST /api/candidates` en Express para recibir datos multipart/form-data y persistir un nuevo candidato en PostgreSQL via Prisma.

---

## Detalles Técnicos

### Endpoint

| Aspecto | Valor |
|---------|-------|
| Método | POST |
| URL | `/api/candidates` |
| Content-Type | `multipart/form-data` |
| Autenticación | No (MVP) |

### Request Body (form-data)

| Campo | Tipo | Requerido | Descripción |
|-------|------|----------|------------|
| firstName | string | Sí | Nombre (max 100 chars) |
| lastName | string | Sí | Apellido (max 100 chars) |
| email | string | Sí | Email único |
| phone | string | No | Teléfono (max 20 chars) |
| address | string | No | Dirección (max 500 chars) |
| education | string | No | JSON stringified array |
| experience | string | No | JSON stringified array |
| cv | file | No | PDF/DOCX, max 5MB |

### Responses HTTP

| Código | Condición | Body |
|--------|-----------|------|
| 201 | Creado exitosamente | Candidate object sin cvData |
| 400 | Validación fallida | `{ "error": "Validation failed", "details": [...] }` |
| 409 | Email duplicado | `{ "error": "Candidate with email X already exists" }` |
| 500 | Error servidor | `{ "error": "Internal server error" }` |

### Configuración Multer

```typescript
import multer from 'multer';
import { memoryStorage } from 'multer';

const upload = memoryStorage({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    cb(null, allowed.includes(file.mimetype));
  },
});
```

### Validación (Zod)

```typescript
const candidateSchema = z.object({
  firstName: z.string().min(1).max(100).trim(),
  lastName: z.string().min(1).max(100).trim(),
  email: z.string().email().max(255),
  phone: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
  education: z.array(educationSchema).optional(),
  experience: z.array(experienceSchema).optional(),
});
```

### Modularización

- Debe existir una separación por capas: ui, domain e infrastructure. En la carpeta de ui debe existir todo lo relacionado con la definición de endpoints, validación de inputs y todo lo relacionado con express. En la capa domain, deben existir los casos de uso, las interfaces de los repositorios, y las entidades sobre las que se basa nuestro proyecto. Por último, en la capa de infraestructura tendremos la implementación de los repositorios, con su correspondiente acceso a base de datos a través de la librería de prisma. Esta capa dependerá de los modelos de dominio. Aunque no hagamos una arquitectura hexagonal perfecta, mantendremos las capas bien separadas para en el futuro poder iterar la arquitectura con agilidad.


### XSS Sanitización

- Usar `xss` o similar en campos texto antes de guardar

---

## Lógica del Endpoint

```
1. Validar Content-Type es multipart/form-data
2. Usar multer para parsear request
3. Validar campos con Zod/schema
4. Sanitizar inputs contra XSS
5. Verificar email no existe (409 si existe)
6. Parsear education/experience de JSON string a objeto
7. Guardar candidate en Prisma
8. Retornar 201 con candidate (sin cvData)
```

---

## Archivos a Modificar

| Archivo | Acción |
|---------|--------|
| `backend/src/index.ts` | Agregar rutas o crear nuevo archivo de rutas |
| `backend/src/routes/candidates.ts` | Crear - endpoint POST |
| `backend/src/validators/candidate.ts` | Crear - schema de validación |
| `backend/src/middleware/upload.ts` | Crear - configuración multer |

---

## Criterios de Aceptación

1. ✅ Endpoint `POST /api/candidates` responde con 201 y candidate creado
2. ✅ Endpoint responde 400 cuando email inválido
3. ✅ Endpoint responde 400 cuando campos requeridos vacíos
4. ✅ Endpoint responde 409 cuando email ya existe
5. ✅ Endpoint responde 400 cuando archivo > 5MB
6. ✅ Endpoint responde 400 cuando tipo archivo no permitido (no PDF/DOCX)
7. ✅ CV almacenado como Bytes en campo cvData
8. ✅ Campos JSON education/experience parseados correctamente
9. ✅ Inputs sanitizados contra XSS
10. ✅ Documentación Swagger actualizada

---

## Tests unitarios (Jest + Supertest)

### Casos de prueba

| Test | Input | Esperado |
|------|-------|---------|
| crear candidate válido | todos campos requeridos | 201 |
| email inválido | email sin @ | 400 |
| campos requeridos vacíos | firstName vacío | 400 |
| email duplicado | email existente | 409 |
| archivo > 5MB | archivo grande | 400 |
| tipo no permitido | archivo .exe | 400 |

### Ejemplo test

```typescript
describe('POST /api/candidates', () => {
  it('should return 201 for valid candidate', async () => {
    const res = await request(app)
      .post('/api/candidates')
      .field('firstName', 'Juan')
      .field('lastName', 'Pérez')
      .field('email', 'juan@test.com')
      .attach('cv', Buffer.from('test'), 'cv.pdf');
    expect(res.status).toBe(201);
  });
});
```

---

## Documentación

Incluir en `backend/README.md`:
- Endpoint: `POST /api/candidates`
- Request/Response examples
- Códigos de error