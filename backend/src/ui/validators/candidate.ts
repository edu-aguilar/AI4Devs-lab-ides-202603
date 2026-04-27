import { z } from 'zod';

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

export const createCandidateSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100).trim(),
  lastName: z.string().min(1, 'Last name is required').max(100).trim(),
  email: z.string().email('Invalid email format').max(255).trim(),
  phone: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
  education: z.array(educationSchema).optional(),
  experience: z.array(experienceSchema).optional(),
});

export type CreateCandidateInput = z.infer<typeof createCandidateSchema>;