import { z } from 'zod';

const educationSchema = z.object({
  institution: z.string().max(200, 'Institución máximo 200 caracteres'),
  degree: z.string().max(200, 'Título máximo 200 caracteres'),
  startYear: z.number().min(1900).max(2100, 'Año inválido'),
  endYear: z.number().min(1900).max(2100, 'Año inválido'),
});

const experienceSchema = z.object({
  company: z.string().max(200, 'Empresa máximo 200 caracteres'),
  position: z.string().max(200, 'Posición máximo 200 caracteres'),
  startDate: z.string().min(1, 'Fecha de inicio requerida'),
  endDate: z.string().optional(),
  description: z.string().max(1000, 'Descripción máximo 1000 caracteres').optional(),
});

export const candidateSchema = z.object({
  firstName: z.string().min(1, 'Nombre es requerido').max(100, 'Nombre máximo 100 caracteres'),
  lastName: z.string().min(1, 'Apellido es requerido').max(100, 'Apellido máximo 100 caracteres'),
  email: z.string().min(1, 'Email es requerido').email('Email inválido'),
  phone: z.string().max(20, 'Teléfono máximo 20 caracteres').optional(),
  address: z.string().max(500, 'Dirección máximo 500 caracteres').optional(),
  education: z.array(educationSchema).optional(),
  experience: z.array(experienceSchema).optional(),
  cv: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      'El archivo debe ser menor a 5MB'
    )
    .refine(
      (file) => !file || ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type),
      'Solo se aceptan archivos PDF o DOCX'
    ),
});

export type CandidateFormData = z.infer<typeof candidateSchema>;