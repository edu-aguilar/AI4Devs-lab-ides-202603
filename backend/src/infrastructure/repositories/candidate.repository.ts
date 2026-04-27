import { PrismaClient, Candidate as PrismaCandidate } from '@prisma/client';
import { ICandidateRepository } from '../../domain/repositories/candidate.interface';
import { Candidate, CreateCandidateDTO } from '../../domain/entities/candidate';

export class CandidateRepository implements ICandidateRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateCandidateDTO): Promise<Candidate> {
    const candidate = await this.prisma.candidate.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
        education: data.education as any,
        experience: data.experience as any,
        cvData: data.cvData,
        cvFileName: data.cvFileName,
        cvContentType: data.cvContentType,
      },
    });

    return this.mapToDomain(candidate);
  }

  async findByEmail(email: string): Promise<Candidate | null> {
    const candidate = await this.prisma.candidate.findUnique({
      where: { email },
    });

    if (!candidate) return null;
    return this.mapToDomain(candidate);
  }

  private mapToDomain(prismaCandidate: PrismaCandidate): Candidate {
    return {
      id: prismaCandidate.id,
      email: prismaCandidate.email,
      firstName: prismaCandidate.firstName,
      lastName: prismaCandidate.lastName,
      phone: prismaCandidate.phone ?? undefined,
      address: prismaCandidate.address ?? undefined,
      education: prismaCandidate.education as any,
      experience: prismaCandidate.experience as any,
      cvData: prismaCandidate.cvData ?? undefined,
      cvFileName: prismaCandidate.cvFileName ?? undefined,
      cvContentType: prismaCandidate.cvContentType ?? undefined,
      status: prismaCandidate.status as Candidate['status'],
      createdAt: prismaCandidate.createdAt,
      updatedAt: prismaCandidate.updatedAt,
    };
  }
}