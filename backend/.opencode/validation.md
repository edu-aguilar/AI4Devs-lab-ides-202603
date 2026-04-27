# Validation Skill - Backend

## Overview
Esta skill cubre la validación de inputs usando Zod y la sanitización contra XSS usando la librería xss.

## Tech Stack
- **Validation**: Zod 3.x
- **Sanitization**: xss library
- **TypeScript**: TypeScript 4.9.5

## Estructura de Validadores

```
backend/src/ui/validators/
└── candidate.ts    # Schemas de validación para Candidate
```

## Zod Schemas

### Schema Básico
```typescript
import { z } from 'zod';

const createCandidateSchema = z.object({
  firstName: z.string().min(1).max(100).trim(),
  lastName: z.string().min(1).max(100).trim(),
  email: z.string().email().max(255),
  phone: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
});
```

### Schema con Arrays (JSON)
```typescript
const educationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  field: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const experienceSchema = z.object({
  company: z.string(),
  position: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

// Schema principal con arrays
const createCandidateSchema = z.object({
  // ... campos básicos
  education: z.array(educationSchema).optional(),
  experience: z.array(experienceSchema).optional(),
});
```

### Validación en Route Handler

```typescript
// Parsear JSON strings del multipart
const parsedEducation = fields.education ? JSON.parse(fields.education) : undefined;
const parsedExperience = fields.experience ? JSON.parse(fields.experience) : undefined;

// Validar con Zod
const validationResult = createCandidateSchema.safeParse(data);

if (!validationResult.success) {
  const details = validationResult.error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
  return res.status(400).json({ error: 'Validation failed', details });
}

const validatedData = validationResult.data;
```

## XSS Sanitization

### Instalación
```bash
npm install xss
```

### Uso Básico
```typescript
import xss from 'xss';

const sanitize = (input: string): string => {
  return xss(input);
};

// Aplicar a campos individuales
const sanitizedFirstName = sanitize(validatedData.firstName);
```

### Sanitization de Objetos Anidados
```typescript
const sanitizeObject = (obj: any): any => {
  if (typeof obj === 'string') {
    return sanitize(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      sanitized[key] = sanitizeObject(obj[key]);
    }
    return sanitized;
  }
  return obj;
};

// Usar en arrays
const sanitizedData = {
  ...validatedData,
  education: validatedData.education ? sanitizeObject(validatedData.education) : undefined,
  experience: validatedData.experience ? sanitizeObject(validatedData.experience) : undefined,
};
```

## Tipos Generados

```typescript
// Inferir tipo del schema
export type CreateCandidateInput = z.infer<typeof createCandidateSchema>;

// Resultado:
// {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone?: string;
//   address?: string;
//   education?: Education[];
//   experience?: Experience[];
// }
```

## Errores de Validación

### Formato de Respuesta 400
```json
{
  "error": "Validation failed",
  "details": [
    { "field": "email", "message": "Invalid email format" },
    { "field": "firstName", "message": "First name is required" }
  ]
}
```

### Casos de Error
- Campo requerido vacío → mensaje personalizado
- Email inválido → "Invalid email format"
- String muy largo → mensaje de max()
- JSON parse error → "Invalid JSON format"

## Best Practices

1. **Validación early**: Validar antes de cualquier lógica de negocio
2. **Mensajes claros**: Usar mensajes descriptivos en Zod
3. **Sanitización siempre**: Aplicar xss a TODOS los campos de texto
4. **Arrays anidados**: Usar sanitizeObject para education/experience
5. **Type inference**: Usar z.infer para tipos automáticos

## Dependencias

| Paquete | Propósito |
|---------|------------|
| zod | Validación de schemas |
| xss | Sanitización XSS |

## Referencias

- [API Development Skill](./api.md)
- [Zod Documentation](https://github.com/colinhacks/zod)
- [xss Library](https://github.com/leizongmin/js-xss)