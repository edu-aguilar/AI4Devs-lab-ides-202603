export interface Education {
  institution: string;
  degree: string;
  field?: string;
  startDate?: string;
  endDate?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Candidate {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  education?: Education[];
  experience?: Experience[];
  cvData?: Buffer;
  cvFileName?: string;
  cvContentType?: string;
  status: CandidateStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type CandidateStatus = 'NEW' | 'SCREENING' | 'INTERVIEW' | 'HIRED' | 'REJECTED';

export interface CreateCandidateDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education?: Education[];
  experience?: Experience[];
  cvData?: Buffer;
  cvFileName?: string;
  cvContentType?: string;
}