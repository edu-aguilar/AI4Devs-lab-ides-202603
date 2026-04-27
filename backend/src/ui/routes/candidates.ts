import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { upload } from '../middleware/upload';
import { createCandidateSchema, CreateCandidateInput } from '../validators/candidate';
import { CreateCandidateUseCase } from '../../domain/useCases/createCandidate';
import { CandidateRepository } from '../../infrastructure/repositories/candidate.repository';
import { PrismaClient } from '@prisma/client';
import xss from 'xss';

const router = Router();
const prisma = new PrismaClient();
const candidateRepository = new CandidateRepository(prisma);
const createCandidateUseCase = new CreateCandidateUseCase(candidateRepository);

const sanitize = (input: string): string => {
  return xss(input);
};

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
 *                 maxLength: 255
 *               phone:
 *                 type: string
 *                 maxLength: 20
 *               address:
 *                 type: string
 *                 maxLength: 500
 *               education:
 *                 type: string
 *                 description: JSON stringified array of education objects
 *               experience:
 *                 type: string
 *                 description: JSON stringified array of experience objects
 *               cv:
 *                 type: file
 *                 description: PDF or DOCX file, max 5MB
 *     responses:
 *       201:
 *         description: Candidate created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Candidate'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: array
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post(
  '/',
  (req: Request, res: Response, next: NextFunction) => {
    upload.single('cv')(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            error: 'Validation failed',
            details: [{ field: 'cv', message: 'File size exceeds 5MB limit' }],
          });
        }
        return res.status(400).json({
          error: 'Validation failed',
          details: [{ field: 'cv', message: err.message }],
        });
      }
      if (err) {
        return res.status(400).json({
          error: 'Validation failed',
          details: [{ field: 'cv', message: err.message }],
        });
      }
      next();
    });
  },
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fields = req.body;

      const parsedEducation = fields.education ? JSON.parse(fields.education) : undefined;
      const parsedExperience = fields.experience ? JSON.parse(fields.experience) : undefined;

      const data = {
        firstName: fields.firstName,
        lastName: fields.lastName,
        email: fields.email,
        phone: fields.phone || undefined,
        address: fields.address || undefined,
        education: parsedEducation,
        experience: parsedExperience,
      };

      const validationResult = createCandidateSchema.safeParse(data);

      if (!validationResult.success) {
        const details = validationResult.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return res.status(400).json({
          error: 'Validation failed',
          details,
        });
      }

      const validatedData: CreateCandidateInput = validationResult.data;

      const sanitizedData = {
        ...validatedData,
        firstName: sanitize(validatedData.firstName),
        lastName: sanitize(validatedData.lastName),
        email: validatedData.email.toLowerCase().trim(),
        phone: validatedData.phone ? sanitize(validatedData.phone) : undefined,
        address: validatedData.address ? sanitize(validatedData.address) : undefined,
        education: validatedData.education ? sanitizeObject(validatedData.education) : undefined,
        experience: validatedData.experience ? sanitizeObject(validatedData.experience) : undefined,
        cvData: req.file ? req.file.buffer : undefined,
        cvFileName: req.file ? req.file.originalname : undefined,
        cvContentType: req.file ? req.file.mimetype : undefined,
      };

      const candidate = await createCandidateUseCase.execute(sanitizedData);

      const { cvData, ...candidateWithoutCv } = candidate;

      return res.status(201).json(candidateWithoutCv);
    } catch (error: any) {
      if (error.message === 'DUPLICATE_EMAIL') {
        const email = req.body.email || '';
        return res.status(409).json({
          error: `Candidate with email ${email} already exists`,
        });
      }
      if (error instanceof SyntaxError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: [{ field: 'education/experience', message: 'Invalid JSON format' }],
        });
      }
      console.error('Error creating candidate:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;