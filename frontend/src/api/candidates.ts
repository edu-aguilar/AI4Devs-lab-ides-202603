import { Candidate } from '../domain/types/candidate';

export async function createCandidate(formData: FormData): Promise<Candidate> {
  const response = await fetch('/api/candidates', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message);
  }
  return response.json();
}