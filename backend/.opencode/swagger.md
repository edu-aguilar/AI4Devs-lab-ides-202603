# Swagger Skill - Backend

## Overview
Esta skill cubre la configuración de Swagger/OpenAPI para documentar endpoints REST, incluyendo anotaciones JSDoc y configuración en app.ts.

## Tech Stack
- **Swagger UI**: swagger-ui-express 5.x
- **Swagger Generator**: swagger-jsdoc 6.x
- **OpenAPI**: 3.0.0
- **Endpoint**: `/api-docs`

## Configuración en app.ts

### Imports
```typescript
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
```

### Opciones de Swagger
```typescript
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LTI - Applicant Tracking System API',
      version: '1.0.0',
      description: 'API for managing candidates in the LTI system',
    },
    components: {
      schemas: {
        Candidate: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            phone: { type: 'string' },
            address: { type: 'string' },
            education: { type: 'array' },
            experience: { type: 'array' },
            status: { type: 'string', enum: ['NEW', 'SCREENING', 'INTERVIEW', 'HIRED', 'REJECTED'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./src/ui/routes/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
```

### Registrar Middleware
```typescript
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
```

## Anotaciones JSDoc en Rutas

### Endpoint con documentación completa
```typescript
/**
 * @swagger
 * /api/candidates:
 *   post:
 *     summary: Create a new candidate
 *     description: Endpoint to submit candidate information including CV upload
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *                 maxLength: 100
 *               lastName:
 *                 type: string
 *                 maxLength: 100
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               education:
 *                 type: string
 *                 description: JSON stringified array
 *               experience:
 *                 type: string
 *                 description: JSON stringified array
 *               cv:
 *                 type: file
 *     responses:
 *       201:
 *         description: Candidate created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Candidate'
 *       400:
 *         description: Validation failed
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */
router.post('/', ...);
```

### Tags para agrupar endpoints
```typescript
/**
 * @swagger
 * tags:
 *   - name: Candidates
 *     description: Candidate management endpoints
 */
```

### Definir Schema en componente
```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     Candidate:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         email:
 *           type: string
 *         firstName:
 *           type: string
 */
```

## Anotaciones de Params

### Path Parameter
```typescript
/**
 * @swagger
 * /api/candidates/{id}:
 *   get:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
```

### Query Parameter
```typescript
/**
 * @swagger
 * /api/candidates:
 *   get:
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [NEW, SCREENING, INTERVIEW, HIRED, REJECTED]
 */
```

### Request Body (JSON)
```typescript
/**
 * @swagger
 * /api/candidates:
 *   put:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 */
```

## Respuestas

### Multiple Responses
```typescript
/**
 * @swagger
 * /api/candidates:
 *   post:
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 *       409:
 *         description: Conflict
 *       500:
 *         description: Server Error
 */
```

### Response con Ejemplo
```typescript
/**
 * @swagger
 * /api/candidates:
 *   get:
 *     responses:
 *       200:
 *         description: List of candidates
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 firstName: Juan
 *                 lastName: Pérez
 *                 email: juan@test.com
 */
```

## Dependencias

| Paquete | Propósito |
|---------|------------|
| swagger-jsdoc | Genera spec desde JSDoc |
| swagger-ui-express | Servir UI interactiva |
| @types/swagger-jsdoc | Tipos TypeScript |
| @types/swagger-ui-express | Tipos TypeScript |

## Acceso

- **URL**: http://localhost:3010/api-docs
- **JSON Spec**: http://localhost:3010/api-docs.json

## Best Practices

1. **Anotaciones en routes**: Mantener documentación junto al código
2. **Esquemas reutilizables**: Definir en components/schemas
3. **Descripción clara**: Documentar propósito y parámetros
4. **Códigos de respuesta**: Incluir todos los posibles (200, 400, 409, 500)
5. **Ejemplos**: Añadir example para mejor comprensión

## Errores Comunes

### "Unable to find defined operation"
- **Causa**: El archivo no está incluido en `apis` option
- **Solución**: Verificar que el path coincida con `apis: ['./src/ui/routes/*.ts']`

### Schema no encontrado
- **Causa**: Reference path incorrecto
- **Solución**: Usar `$ref: '#/components/schemas/Candidate'`

### RequestBody no reconocido
- **Causa**: Falta `consumes` para multipart
- **Solución**: Añadir `consumes: ['multipart/form-data']`

## Referencias

- [API Development Skill](./api.md)
- [OpenAPI Specification](https://swagger.io/specification/)
- [swagger-jsdoc Documentation](https://github.com/Surnet/swagger-jsdoc)