import { Button, ButtonProps } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

interface AddCandidateButtonProps extends Omit<ButtonProps, 'onClick'> {
  label?: string;
}

export function AddCandidateButton({ label = 'Añadir Candidato', ...props }: AddCandidateButtonProps) {
  const navigate = useNavigate();

  return (
    <Button
      colorScheme="blue"
      onClick={() => navigate('/candidates/new')}
      size="md"
      {...props}
    >
      {label}
    </Button>
  );
}