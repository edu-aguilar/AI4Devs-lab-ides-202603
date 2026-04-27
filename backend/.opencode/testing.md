# Testing Skill - Backend

## Overview
Esta skill cubre el testing de APIs usando Jest y Supertest, incluyendo tests de integración para endpoints REST.

## Tech Stack
- **Test Framework**: Jest 29.x
- **HTTP Client**: Supertest 7.x
- **TypeScript**: TypeScript 4.9.5

## Estructura de Tests

```
backend/src/tests/
├── app.test.ts         # Tests básicos
└── candidates.test.ts  # Tests del endpoint /api/candidates
```

## Configuración

### jest.config.js
```javascript
module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
```

### setup.ts (para clean server)
```typescript
import { createApp } from '../app';

export const app = createApp();
```

## Patrón de Tests

### Importar app factory (NO listen)
```typescript
import request from 'supertest';
import { createApp } from '../app';

const app = createApp();
```

**Importante**: No importar de `index.ts` porque ese hace `.listen()`. Siempre usar `createApp()` desde `app.ts`.

### Test Básico
```typescript
describe('GET /', () => {
  it('responds with Hola LTI!', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Hola LTI!');
  });
});
```

### Test de Endpoint POST
```typescript
describe('POST /api/candidates', () => {
  it('should return 201 for valid candidate', async () => {
    const res = await request(app)
      .post('/api/candidates')
      .field('firstName', 'Juan')
      .field('lastName', 'Pérez')
      .field('email', 'juan@test.com');

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('juan@test.com');
  });
});
```

### Test de Validación (400)
```typescript
it('should return 400 for invalid email', async () => {
  const res = await request(app)
    .post('/api/candidates')
    .field('firstName', 'Juan')
    .field('lastName', 'Pérez')
    .field('email', 'invalid-email');

  expect(res.status).toBe(400);
  expect(res.body.error).toBe('Validation failed');
});
```

### Test de Archivo (multipart)
```typescript
// Test archivo grande (> 5MB)
it('should return 400 for file > 5MB', async () => {
  const largeBuffer = Buffer.alloc(6 * 1024 * 1024);

  const res = await request(app)
    .post('/api/candidates')
    .field('firstName', 'Juan')
    .field('lastName', 'Pérez')
    .field('email', 'large@test.com')
    .attach('cv', largeBuffer, 'cv.pdf');

  expect(res.status).toBe(400);
});

// Test tipo de archivo inválido
it('should return 400 for invalid file type', async () => {
  const buffer = Buffer.from('test');

  const res = await request(app)
    .post('/api/candidates')
    .field('firstName', 'Juan')
    .field('lastName', 'Pérez')
    .field('email', 'invalidfile@test.com')
    .attach('cv', buffer, 'cv.exe');

  expect(res.status).toBe(400);
});
```

### Test de Duplicado (409)
```typescript
it('should return 409 for duplicate email', async () => {
  // Crear primer candidato
  await request(app)
    .post('/api/candidates')
    .field('firstName', 'Juan')
    .field('lastName', 'Pérez')
    .field('email', 'duplicate@test.com');

  // Intentar crear segundo con mismo email
  const res = await request(app)
    .post('/api/candidates')
    .field('firstName', 'Juan')
    .field('lastName', 'Pérez')
    .field('email', 'duplicate@test.com');

  expect(res.status).toBe(409);
  expect(res.body.error).toContain('already exists');
});
```

## Limpieza de Datos

### beforeAll / afterAll
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Limpiar datos de tests anteriores
  await prisma.candidate.deleteMany({
    where: { email: 'test@test.com' },
  });
});

afterAll(async () => {
  // Cerrar conexión
  await prisma.$disconnect();
});
```

## Métodos de Supertest

| Método | Descripción |
|--------|-------------|
| `.get(url)` | GET request |
| `.post(url)` | POST request |
| `.put(url)` | PUT request |
| `.delete(url)` | DELETE request |
| `.field(key, value)` | Form field |
| `.attach(field, buffer, filename)` | File upload |
| `.set('Header', 'value')` | Custom header |

## Errores Comunes

### "address already in use"
- **Causa**: El servidor ya está escuchando en el puerto
- **Solución**: Usar `createApp()` desde `app.ts`, no `index.ts`

### "Cannot read property of undefined"
- **Causa**: El campo no está en el formData correcto
- **Solución**: Verificar que `.field()` se llama antes de `.attach()`

### Tests que fallan en CI
- **Causa**: Base de datos no disponible
- **Solución**: Asegurar que `docker-compose up -d` corre antes de tests

## Best Practices

1. **Factory pattern**: Siempre usar `createApp()`, nunca `index.ts`
2. **Limpieza**: Usar `beforeAll` para limpiar datos de tests anteriores
3. **AfterAll**: Siempre desconectar Prisma después de tests
4. **Idempotencia**: Tests deben poder ejecutarse en cualquier orden
5. **Cleanup**: Eliminar datos creados durante los tests

## Scripts NPM

```bash
# Ejecutar tests
npm test

# Ejecutar tests con coverage
npm test -- --coverage

# Ejecutar tests en watch mode
npm test -- --watch
```

## Dependencias

| Paquete | Propósito |
|---------|------------|
| jest | Test framework |
| @types/jest | Tipos de Jest |
| ts-jest | Transformador TypeScript |
| supertest | HTTP client para tests |
| @types/supertest | Tipos de Supertest |
| @prisma/client | Base de datos |

## Referencias

- [API Development Skill](./api.md)
- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)