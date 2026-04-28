import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { CandidateForm } from '../ui/components/CandidateForm';
import { createCandidate } from '../api/candidates';

const mockNavigate = jest.fn();
const mockToast = jest.fn();

jest.mock('../api/candidates', () => ({
  createCandidate: jest.fn(),
}));


jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@chakra-ui/react', () => {
  const actual = jest.requireActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: () => mockToast,
  };
});

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <ChakraProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </ChakraProvider>
  );
};

describe('CandidateForm', () => {
  const mockCandidate = {
    id: 1,
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@test.com',
    status: 'NEW',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  describe('CandidateForm - Form validation', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockNavigate.mockClear();
      mockToast.mockClear();
    });
  
    it('shows error when firstName is empty', async () => {
      renderWithProviders(<CandidateForm />);
  
      fireEvent.input(screen.getByPlaceholderText('Juan'), {
        target: { name: 'firstName', value: '' },
      });
      fireEvent.input(screen.getByPlaceholderText('Pérez'), {
        target: { name: 'lastName', value: 'Pérez' },
      });
      fireEvent.input(screen.getByPlaceholderText('juan@ejemplo.com'), {
        target: { name: 'email', value: 'juan@test.com' },
      });
  
      fireEvent.submit(screen.getByText('Guardar'));
  
      await waitFor(() => {
        expect(screen.getByText(/nombre es requerido/i)).toBeInTheDocument();
      });
    });
  
    it('shows error when lastName is empty', async () => {
      renderWithProviders(<CandidateForm />);
  
      fireEvent.input(screen.getByPlaceholderText('Juan'), {
        target: { name: 'firstName', value: 'Juan' },
      });
      fireEvent.input(screen.getByPlaceholderText('Pérez'), {
        target: { name: 'lastName', value: '' },
      });
      fireEvent.input(screen.getByPlaceholderText('juan@ejemplo.com'), {
        target: { name: 'email', value: 'juan@test.com' },
      });
  
      fireEvent.submit(screen.getByText('Guardar'));
  
      await waitFor(() => {
        expect(screen.getByText(/apellido es requerido/i)).toBeInTheDocument();
      });
    });
  
    it('shows error when email has invalid format', async () => {
      renderWithProviders(<CandidateForm />);
  
      fireEvent.input(screen.getByPlaceholderText('Juan'), {
        target: { name: 'firstName', value: 'Juan' },
      });
      fireEvent.input(screen.getByPlaceholderText('Pérez'), {
        target: { name: 'lastName', value: 'Pérez' },
      });
      fireEvent.input(screen.getByPlaceholderText('juan@ejemplo.com'), {
        target: { name: 'email', value: 'invalid-email' },
      });
  
      fireEvent.submit(screen.getByText('Guardar'));
  
      await waitFor(() => {
        expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
      });
    });
  
    it('validates correct email format', async () => {
      (createCandidate as jest.Mock).mockResolvedValue({ id: 1 });
  
      renderWithProviders(<CandidateForm />);
  
      fireEvent.input(screen.getByPlaceholderText('Juan'), {
        target: { name: 'firstName', value: 'Juan' },
      });
      fireEvent.input(screen.getByPlaceholderText('Pérez'), {
        target: { name: 'lastName', value: 'Pérez' },
      });
      fireEvent.input(screen.getByPlaceholderText('juan@ejemplo.com'), {
        target: { name: 'email', value: 'juan@test.com' },
      });
  
      fireEvent.submit(screen.getByText('Guardar'));
  
      await waitFor(() => {
        expect(createCandidate).toHaveBeenCalled();
      });
    });
  
    it('shows error when phone exceeds 20 characters', async () => {
      const longPhone = '123456789012345678901';
      renderWithProviders(<CandidateForm />);
  
      fireEvent.input(screen.getByPlaceholderText('Juan'), {
        target: { name: 'firstName', value: 'Juan' },
      });
      fireEvent.input(screen.getByPlaceholderText('Pérez'), {
        target: { name: 'lastName', value: 'Pérez' },
      });
      fireEvent.input(screen.getByPlaceholderText('juan@ejemplo.com'), {
        target: { name: 'email', value: 'juan@test.com' },
      });
      fireEvent.input(screen.getByPlaceholderText('+34 123 456 789'), {
        target: { name: 'phone', value: longPhone },
      });
  
      fireEvent.submit(screen.getByText('Guardar'));
  
      await waitFor(() => {
        expect(screen.getByText(/teléfono máximo 20 caracteres/i)).toBeInTheDocument();
      });
    });
  
    it('validates education array correctly', async () => {
      (createCandidate as jest.Mock).mockResolvedValue({ id: 1 });
  
      renderWithProviders(<CandidateForm />);
  
      fireEvent.click(screen.getByTestId('add-education'));
  
      await waitFor(() => {
        expect(screen.getByText('Institución')).toBeInTheDocument();
      });
    });
  
    it('validates experience array correctly', async () => {
      (createCandidate as jest.Mock).mockResolvedValue({ id: 1 });
  
      renderWithProviders(<CandidateForm />);
  
      fireEvent.click(screen.getByTestId('add-experience'));
    });
  
    it('shows error when firstName exceeds 100 characters', async () => {
      const longName = 'a'.repeat(101);
      renderWithProviders(<CandidateForm />);
  
      fireEvent.input(screen.getByPlaceholderText('Juan'), {
        target: { name: 'firstName', value: longName },
      });
      fireEvent.input(screen.getByPlaceholderText('Pérez'), {
        target: { name: 'lastName', value: 'Pérez' },
      });
      fireEvent.input(screen.getByPlaceholderText('juan@ejemplo.com'), {
        target: { name: 'email', value: 'juan@test.com' },
      });
  
      fireEvent.submit(screen.getByText('Guardar'));
  
      await waitFor(() => {
        expect(screen.getByText(/nombre máximo 100 caracteres/i)).toBeInTheDocument();
      });
    });
  
    it('shows error when lastName exceeds 100 characters', async () => {
      const longName = 'a'.repeat(101);
      renderWithProviders(<CandidateForm />);
  
      fireEvent.input(screen.getByPlaceholderText('Juan'), {
        target: { name: 'firstName', value: 'Juan' },
      });
      fireEvent.input(screen.getByPlaceholderText('Pérez'), {
        target: { name: 'lastName', value: longName },
      });
      fireEvent.input(screen.getByPlaceholderText('juan@ejemplo.com'), {
        target: { name: 'email', value: 'juan@test.com' },
      });
  
      fireEvent.submit(screen.getByText('Guardar'));
  
      await waitFor(() => {
        expect(screen.getByText(/apellido máximo 100 caracteres/i)).toBeInTheDocument();
      });
    });
  
    it('shows error when address exceeds 500 characters', async () => {
      const longAddress = 'a'.repeat(501);
      renderWithProviders(<CandidateForm />);
  
      fireEvent.input(screen.getByPlaceholderText('Juan'), {
        target: { name: 'firstName', value: 'Juan' },
      });
      fireEvent.input(screen.getByPlaceholderText('Pérez'), {
        target: { name: 'lastName', value: 'Pérez' },
      });
      fireEvent.input(screen.getByPlaceholderText('juan@ejemplo.com'), {
        target: { name: 'email', value: 'juan@test.com' },
      });
      fireEvent.input(screen.getByPlaceholderText('Calle Example 123, Madrid'), {
        target: { name: 'address', value: longAddress },
      });
  
      fireEvent.submit(screen.getByText('Guardar'));
  
      await waitFor(() => {
        expect(screen.getByText(/dirección máximo 500 caracteres/i)).toBeInTheDocument();
      });
    });
  });
  
  describe('CandidateForm - API createCandidate', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockNavigate.mockClear();
      mockToast.mockClear();
    });
  
    it('calls createCandidate with form data', async () => {
      (createCandidate as jest.Mock).mockResolvedValue(mockCandidate);
  
      renderWithProviders(<CandidateForm />);
  
      fireEvent.input(screen.getByPlaceholderText('Juan'), {
        target: { name: 'firstName', value: 'Juan' },
      });
      fireEvent.input(screen.getByPlaceholderText('Pérez'), {
        target: { name: 'lastName', value: 'Pérez' },
      });
      fireEvent.input(screen.getByPlaceholderText('juan@ejemplo.com'), {
        target: { name: 'email', value: 'juan@test.com' },
      });
  
      fireEvent.submit(screen.getByText('Guardar'));
  
      await waitFor(() => {
        expect(createCandidate).toHaveBeenCalled();
      });
  
      const calledWith = (createCandidate as jest.Mock).mock.calls[0][0];
      expect(calledWith.get('firstName')).toBe('Juan');
      expect(calledWith.get('lastName')).toBe('Pérez');
      expect(calledWith.get('email')).toBe('juan@test.com');
    });
  
    it('calls useNavigate after creating candidate', async () => {
      (createCandidate as jest.Mock).mockResolvedValue(mockCandidate);
  
      renderWithProviders(<CandidateForm />);
  
      fireEvent.input(screen.getByPlaceholderText('Juan'), {
        target: { name: 'firstName', value: 'Juan' },
      });
      fireEvent.input(screen.getByPlaceholderText('Pérez'), {
        target: { name: 'lastName', value: 'Pérez' },
      });
      fireEvent.input(screen.getByPlaceholderText('juan@ejemplo.com'), {
        target: { name: 'email', value: 'juan@test.com' },
      });
  
      fireEvent.submit(screen.getByText('Guardar'));
  
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  
    it('calls useToast with success message', async () => {
      (createCandidate as jest.Mock).mockResolvedValue(mockCandidate);
  
      renderWithProviders(<CandidateForm />);
  
      fireEvent.input(screen.getByPlaceholderText('Juan'), {
        target: { name: 'firstName', value: 'Juan' },
      });
      fireEvent.input(screen.getByPlaceholderText('Pérez'), {
        target: { name: 'lastName', value: 'Pérez' },
      });
      fireEvent.input(screen.getByPlaceholderText('juan@ejemplo.com'), {
        target: { name: 'email', value: 'juan@test.com' },
      });
  
      fireEvent.submit(screen.getByText('Guardar'));
  
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Candidato creado exitosamente',
            status: 'success',
          })
        );
      });
    });
  
    it('shows error when createCandidate fails', async () => {
      (createCandidate as jest.Mock).mockRejectedValue(new Error('Server error'));
  
      renderWithProviders(<CandidateForm />);
  
      fireEvent.input(screen.getByPlaceholderText('Juan'), {
        target: { name: 'firstName', value: 'Juan' },
      });
      fireEvent.input(screen.getByPlaceholderText('Pérez'), {
        target: { name: 'lastName', value: 'Pérez' },
      });
      fireEvent.input(screen.getByPlaceholderText('juan@ejemplo.com'), {
        target: { name: 'email', value: 'juan@test.com' },
      });
  
      fireEvent.submit(screen.getByText('Guardar'));
  
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Error',
            status: 'error',
          })
        );
      });
    });
  });
});