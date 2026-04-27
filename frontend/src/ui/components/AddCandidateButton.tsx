import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export function AddCandidateButton() {
  const navigate = useNavigate();

  return (
    <Button
      colorScheme="blue"
      onClick={() => navigate('/candidates/new')}
      size="md"
    >
      Añadir Candidato
    </Button>
  );
}