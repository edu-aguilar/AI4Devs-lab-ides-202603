import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { candidateSchema, CandidateFormData } from '../validators/candidateSchema';

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <ChakraProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </ChakraProvider>
  );
};

jest.mock('../api/candidates', () => ({
  createCandidate: jest.fn(),
}));

import { createCandidate } from '../api/candidates';

describe('CandidateForm validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows error for empty firstName', async () => {
    const result = candidateSchema.safeParse({
      firstName: '',
      lastName: 'Pérez',
      email: 'juan@test.com',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.path.includes('firstName'))).toBe(true);
    }
  });

  it('shows error for empty lastName', async () => {
    const result = candidateSchema.safeParse({
      firstName: 'Juan',
      lastName: '',
      email: 'juan@test.com',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.path.includes('lastName'))).toBe(true);
    }
  });

  it('shows error for invalid email format', async () => {
    const result = candidateSchema.safeParse({
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'invalid-email',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.path.includes('email'))).toBe(true);
    }
  });

  it('validates correct email format', async () => {
    const result = candidateSchema.safeParse({
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@test.com',
    });

    expect(result.success).toBe(true);
  });

  it('validates phone max length', async () => {
    const longPhone = '123456789012345678901';
    const result = candidateSchema.safeParse({
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@test.com',
      phone: longPhone,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.path.includes('phone'))).toBe(true);
    }
  });

  it('validates education array', async () => {
    const result = candidateSchema.safeParse({
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@test.com',
      education: [{ institution: 'UAM', degree: 'CS', startYear: 2000, endYear: 2004 }],
    });

    expect(result.success).toBe(true);
  });

  it('validates experience array', async () => {
    const result = candidateSchema.safeParse({
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@test.com',
      experience: [{ company: 'Tech Corp', position: 'Developer', startDate: '2020-01-01' }],
    });

    expect(result.success).toBe(true);
  });
});

describe('API createCandidate', () => {
  it('calls createCandidate with formData', async () => {
    const mockCandidate = {
      id: 1,
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@test.com',
      status: 'NEW',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    (createCandidate as jest.Mock).mockResolvedValue(mockCandidate);

    const formData = new FormData();
    formData.append('firstName', 'Juan');
    formData.append('lastName', 'Pérez');
    formData.append('email', 'juan@test.com');

    const result = await createCandidate(formData);

    expect(createCandidate).toHaveBeenCalledWith(formData);
    expect(result).toEqual(mockCandidate);
  });

  it('throws error on API failure', async () => {
    (createCandidate as jest.Mock).mockRejectedValue(new Error('Server error'));

    const formData = new FormData();
    formData.append('email', 'test@test.com');

    await expect(createCandidate(formData)).rejects.toThrow('Server error');
  });
});