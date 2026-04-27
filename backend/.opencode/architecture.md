# Architecture Skill - Backend

## Overview
Esta skill documenta la arquitectura de capas implementada en el backend: UI, Domain e Infrastructure. Aunque no es una arquitectura hexagonal perfecta, mantiene las responsabilidades bien separadas para permitir iteración futura.

## Estructura de Capas

```
backend/src/
├── app.ts                        # Configuración Express (entry point)
├── index.ts                      # Inicia el servidor
├── ui/                           # Capa de presentación
│   ├── routes/                   # Route handlers
│   │   └── candidates.ts
│   ├── middleware/               # Middleware personalizado
│   │   └── upload.ts
│   ├── validators/               # Validación de inputs
│   │   └── candidate.ts
│   └── docs/                     # Documentación (Swagger)
├── domain/                       # Capa de negocio
│   ├── entities/                 # Tipos/entidades del dominio
│   │   └── candidate.ts
│   ├── repositories/             # Interfaces de repositorio
│   │   └── candidate.interface.ts
│   └── useCases/                 # Casos de uso/lógica de negocio
│       └── createCandidate.ts
└── infrastructure/               # Capa de datos
    └── repositories/             # Implementaciones de repositorio
        └── candidate.repository.ts
```

## Flujo de Datos

```
HTTP Request
    ↓
┌─────────────────────────────────────────────────────────────────────┐
│ UI Layer                                                             │
│   Route Handler → Validators → Middleware                           │
└─────────────────────────────────────────────────────────────────────┘
    ↓ (DTO)
┌─────────────────────────────────────────────────────────────────────┐
│ Domain Layer                                                         │
│   Use Case → Repository Interface → Entity                         │
└─────────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────────┐
│ Infrastructure Layer                                                 │
│   Repository Implementation → Prisma Client → PostgreSQL            │
└─────────────────────────────────────────────────────────────────────┘
    ↓
HTTP Response
```

## Capa: UI (User Interface)

### Responsabilidades
- Recibir y parsear HTTP requests
- Validar inputs con Zod
- Manejar archivos (Multer)
- Sanitizar XSS
- Responder al cliente
- Documentar con Swagger

### Contiene
- **routes/**: Definición de endpoints
- **validators/**: Schemas de validación
- **middleware/**: Funciones中间件 (upload, auth, etc.)
- **docs/**: Documentación API

### Ejemplo: candidates.ts
```typescript
// Route handler
router.post('/', upload.single('cv'), async (req, res) => {
  // 1. Parsear request
  // 2. Validar inputs
  // 3. Sanitizar
  // 4. Llamar use case
  // 5. Responder
});
```

## Capa: Domain

### Responsabilidades
- Definir entidades del negocio
- Definir interfaces de repositorio
- Implementar lógica de negocio (use cases)
- **NO** depende de frameworks externos

### Contiene
- **entities/**: Tipos TypeScript puros
- **repositories/**: Interfaces (contratos)
- **useCases/**: Lógica de negocio

### Ejemplo: entities/candidate.ts
```typescript
export interface Candidate {
  id: number;
  email: string;
  firstName: string;
  // ... otros campos
}

export interface CreateCandidateDTO {
  firstName: string;
  lastName: string;
  email: string;
  // ... campos opcionales
}
```

### Ejemplo: repositories/candidate.interface.ts
```typescript
import { Candidate, CreateCandidateDTO } from '../entities/candidate';

export interface ICandidateRepository {
  create(data: CreateCandidateDTO): Promise<Candidate>;
  findByEmail(email: string): Promise<Candidate | null>;
}
```

### Ejemplo: useCases/createCandidate.ts
```typescript
export class CreateCandidateUseCase {
  constructor(private readonly candidateRepository: ICandidateRepository) {}

  async execute(data: CreateCandidateDTO): Promise<Candidate> {
    // Verificar duplicado
    const existing = await this.candidateRepository.findByEmail(data.email);
    if (existing) {
      throw new Error('DUPLICATE_EMAIL');
    }
    // Crear candidato
    return this.candidateRepository.create(data);
  }
}
```

## Capa: Infrastructure

### Responsabilidades
- Implementar interfaces de repository
- Acceder a la base de datos (Prisma)
- **Depende** de la capa domain (implementa sus interfaces)

### Contiene
- **repositories/**: Implementaciones concretas

### Ejemplo: repositories/candidate.repository.ts
```typescript
import { PrismaClient } from '@prisma/client';
import { ICandidateRepository } from '../../domain/repositories/candidate.interface';
import { Candidate, CreateCandidateDTO } from '../../domain/entities/candidate';

export class CandidateRepository implements ICandidateRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateCandidateDTO): Promise<Candidate> {
    return this.prisma.candidate.create({ data });
  }

  async findByEmail(email: string): Promise<Candidate | null> {
    return this.prisma.candidate.findUnique({ where: { email } });
  }
}
```

## Dependencias entre Capas

```
┌─────────────┐
│    UI       │  ← Depende de Domain
└─────────────┘
      ↓
┌─────────────┐
│   Domain    │  ← NO depende de UI ni Infrastructure
└─────────────┘
      ↓
┌─────────────┐
│Infrastructure│ ← Depende de Domain
└─────────────┘
```

**Regla**: Domain es el centro, UI e Infrastructure dependen de él, pero nunca al revés.

## Factory Pattern (createApp)

### Problema Original
El `index.ts` tenía dos responsabilidades:
1. Configurar Express
2. Iniciar servidor

### Solución: createApp()
```typescript
// app.ts - Exporta factory
export function createApp() {
  const app = express();
  // ... configuración
  return app;
}

// index.ts - Solo inicia
const app = createApp();
app.listen(port);
```

### Beneficio para Tests
```typescript
// Tests pueden crear instancias independientes
const app = createApp();  // Sin listen
request(app).post('/api/candidates');
```

## Repository Pattern

### Propósito
- Abstraer acceso a datos
- Definir contrato (interfaz)
- Permitir implementación intercambiable

### Diagrama
```
UseCase → Interface (Domain) ← Implementation (Infrastructure)
```

## Use Case Pattern

### Propósito
- Encapsular lógica de negocio
- Un caso de uso = una operación
- Testeable independientemente

### Naming
- `CreateCandidateUseCase` - Crear candidato
- `GetCandidateUseCase` - Obtener candidato
- `UpdateCandidateUseCase` - Actualizar candidato
- `DeleteCandidateUseCase` - Eliminar candidato

## Best Practices

1. **Domain independiente**: No importar Express/Prisma en domain layer
2. **Interfaces primero**: Definir interface antes de implementación
3. **Una responsabilidad**: Cada archivo tiene un propósito claro
4. **Testeable**: Cada capa puede probarse independientemente
5. **Nombres claros**: Usar sufijos .interface.ts, .useCase.ts

## Cuándo Usar Cada Capa

| Necesidad | Capa |
|-----------|------|
| Definir endpoint | UI (routes/) |
| Validar input | UI (validators/) |
| Manejar archivos | UI (middleware/) |
| Tipo de dato | Domain (entities/) |
| Lógica de negocio | Domain (useCases/) |
| Acceso a DB | Infrastructure (repositories/) |
| Configuración Express | app.ts |

## Errores Comunes

### Domain que depende de Infrastructure
- **Problema**: Importar PrismaClient en domain/entities
- **Solución**: Domain solo define tipos puros

### Use case hace too much
- **Problema**: Use case que hace validación + DB + email
- **Solución**: Un use case = una responsabilidad

### Repository expone Prisma
- **Problema**: Return `Prisma.Candidate` directamente
- **Solución**: Mapear a entidad del domain antes de retornar

## Referencias

- [API Development Skill](./api.md)
- [Testing Skill](./testing.md)
- [Database Skill](./database.md)
- [Validation Skill](./validation.md)