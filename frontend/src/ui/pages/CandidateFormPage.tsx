import { Box, Container, Heading, Button, HStack } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { CandidateForm } from '../components/CandidateForm';

export function CandidateFormPage() {
  const navigate = useNavigate();

  return (
    <Box minH="100vh" bg="gray.50">
      <Box as="nav" bg="white" py={4} px={8} boxShadow="sm">
        <HStack justify="space-between" align="center">
          <Heading size="md" color="blue.600">
            LTI - Sistema de Seguimiento de Talento
          </Heading>
        </HStack>
      </Box>

      <Container maxW="container.md" py={8}>
        <Button
          leftIcon={<ArrowBackIcon />}
          variant="ghost"
          mb={4}
          onClick={() => navigate('/')}
        >
          Volver al Dashboard
        </Button>
        
        <Box bg="white" p={8} borderRadius="lg" boxShadow="md">
          <Heading size="lg" mb={6}>
            Nuevo Candidato
          </Heading>
          <CandidateForm />
        </Box>
      </Container>
    </Box>
  );
}