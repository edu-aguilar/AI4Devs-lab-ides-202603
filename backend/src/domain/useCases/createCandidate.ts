import { Candidate, CreateCandidateDTO } from '../entities/candidate';
import { ICandidateRepository } from '../repositories/candidate.interface';

export class CreateCandidateUseCase {
  constructor(private readonly candidateRepository: ICandidateRepository) {}

  async execute(data: CreateCandidateDTO): Promise<Candidate> {
    const existingCandidate = await this.candidateRepository.findByEmail(data.email);
    if (existingCandidate) {
      throw new Error('DUPLICATE_EMAIL');
    }

    const candidate = await this.candidateRepository.create(data);
    return candidate;
  }
}