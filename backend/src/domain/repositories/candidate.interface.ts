import { Candidate, CreateCandidateDTO } from '../entities/candidate';

export interface ICandidateRepository {
  create(data: CreateCandidateDTO): Promise<Candidate>;
  findByEmail(email: string): Promise<Candidate | null>;
}