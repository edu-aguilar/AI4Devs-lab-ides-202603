export interface Education {
  institution: string;
  degree: string;
  startYear: number;
  endYear: number;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export type CandidateStatus = 'NEW' | 'SCREENING' | 'INTERVIEW' | 'HIRED' | 'REJECTED';

export interface Candidate {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  education?: Education[];
  experience?: Experience[];
  cvFileName?: string;
  status: CandidateStatus;
  createdAt: string;
  updatedAt: string;
}