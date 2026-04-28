import request from 'supertest';
import { createApp } from '../app';
import { PrismaClient } from '@prisma/client';

const app = createApp();
const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.candidate.deleteMany({
    where: { email: 'juan@test.com' },
  });
});

afterAll(async () => {
  await prisma.candidate.deleteMany({
    where: { email: 'juan@test.com' },
  });
  await prisma.$disconnect();
});

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

  it('should return 400 for invalid email', async () => {
    const res = await request(app)
      .post('/api/candidates')
      .field('firstName', 'Juan')
      .field('lastName', 'Pérez')
      .field('email', 'invalid-email');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('should return 400 for empty required fields', async () => {
    const res = await request(app)
      .post('/api/candidates')
      .field('firstName', '')
      .field('lastName', 'Pérez')
      .field('email', 'test@test.com');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('should return 409 for duplicate email', async () => {
    await request(app)
      .post('/api/candidates')
      .field('firstName', 'Juan')
      .field('lastName', 'Pérez')
      .field('email', 'juan@test.com');

    const res = await request(app)
      .post('/api/candidates')
      .field('firstName', 'Juan')
      .field('lastName', 'Pérez')
      .field('email', 'juan@test.com');

    expect(res.status).toBe(409);
    expect(res.body.error).toContain('already exists');
  });

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
});