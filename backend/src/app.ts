import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import candidatesRouter from './ui/routes/candidates';

export const prisma = new PrismaClient();

export function createApp() {
  const app = express();

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

  app.use(express.json());

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  app.get('/', (req, res) => {
    res.send('Hola LTI!');
  });

  app.use('/api/candidates', candidatesRouter);

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500).send('Something broke!');
  });

  return app;
}