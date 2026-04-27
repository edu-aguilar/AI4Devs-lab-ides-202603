# API Development Skill - Backend

## Overview
Esta skill cubre el desarrollo de endpoints REST usando Express.js, incluyendo routing, middleware y manejo demultipart/form-data.

## Tech Stack
- **Framework**: Express 4.x
- **Lenguaje**: TypeScript 4.9.5
- **Puerto**: 3010
- **Base URL**: `/api`

## Estructura de Rutas

```
backend/src/
├── app.ts              # createApp() - configuración Express
├── ui/
│   ├── routes/         # Definición de endpoints
│   │   └── candidates.ts
│   ├── middleware/     # Middleware personalizado
│   │   └── upload.ts
│   └── validators/     # Validación de inputs
│       └── candidate.ts
└── index.ts            # Entry point (listen)
```

## Patrón de Arquitectura

```
Request → Route Handler → Use Case → Repository → Prisma → DB
         (ui layer)       (domain)    (infrastructure)
```

### Capas
- **UI Layer**: Routes, validators, middleware
- **Domain Layer**: Entities, use cases, repository interfaces
- **Infrastructure Layer**: Repository implementations (Prisma)

## Ejemplo: POST /api/candidates

### Route Handler (ui/routes/candidates.ts)
```typescript
router.post('/', upload.single('cv'), async (req, res, next) => {
  // 1. Parsear multipart data
  // 2. Validar con Zod
  // 3. Sanitizar XSS
  // 4. Ejecutar use case
  // 5. Responder
});
```

### Use Case (domain/useCases/createCandidate.ts)
```typescript
class CreateCandidateUseCase {
  async execute(data: CreateCandidateDTO): Promise<Candidate> {
    // Verificar duplicado
    // Crear en repositorio
    // Retornar candidato
  }
}
```

### Repository Interface (domain/repositories/candidate.interface.ts)
```typescript
interface ICandidateRepository {
  create(data: CreateCandidateDTO): Promise<Candidate>;
  findByEmail(email: string): Promise<Candidate | null>;
}
```

### Repository Implementation (infrastructure/repositories/candidate.repository.ts)
```typescript
class CandidateRepository implements ICandidateRepository {
  async create(data: CreateCandidateDTO): Promise<Candidate> {
    return prisma.candidate.create({ data });
  }
}
```

## Middleware

### Upload (Multer)
- Configuración en `ui/middleware/upload.ts`
- Storage: memory (buffer en memoria)
- Límite: 5MB
- Tipos permitidos: PDF, DOCX

```typescript
const upload = multer({
  storage: memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    // Validar mimetype
  }
});
```

## Manejo de Errores

### Error Handler Global (app.ts)
```typescript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

### Errores en Route Handler
- Validación fallida → 400
- Email duplicado → 409
- Errores Multer → 400
- Error servidor → 500

## Best Practices

1. **Separación de responsabilidades**: Cada capa tiene una función específica
2. **Validación temprana**: Validar inputs antes de logic de negocio
3. **Sanitización**: XSS protection en todos los campos de texto
4. **Tipos definidos**: Usar interfaces/DTOs entre capas
5. **Errores descriptivos**: Mensajes claros para cada tipo de error

## Dependencias

| Paquete | Propósito |
|---------|------------|
| express | Framework web |
| multer | Upload de archivos |
| xss | Sanitización de inputs |
| zod | Validación de schemas |

## Referencias

- [Architecture Skill](./architecture.md)
- [Validation Skill](./validation.md)
- [Testing Skill](./testing.md)