import { Box, Container, Heading, Text, VStack, HStack, Button, useColorModeValue } from '@chakra-ui/react';
import { AddCandidateButton } from '../components/AddCandidateButton';

export function Dashboard() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box minH="100vh" bg={bgColor}>
      <Box as="nav" bg={cardBg} py={4} px={8} boxShadow="sm">
        <HStack justify="space-between" align="center">
          <Heading size="md" color="blue.600">
            LTI - Sistema de Seguimiento de Talento
          </Heading>
          <AddCandidateButton />
        </HStack>
      </Box>

      <Container maxW="container.lg" py={12}>
        <VStack spacing={8} align="center">
          <VStack spacing={4}>
            <Heading size="2xl" textAlign="center" color="gray.700">
              Bienvenido al Panel de Gestión de Talento
            </Heading>
            <Text fontSize="xl" color="gray.500" textAlign="center" maxW="600px">
              Administra tus candidatos de manera eficiente ystreamline tu proceso de selección
            </Text>
          </VStack>

          <Box
            bg={cardBg}
            p={8}
            borderRadius="xl"
            boxShadow="md"
            w="full"
            maxW="600px"
          >
            <VStack spacing={4} align="start">
              <Heading size="md" color="gray.700">
                Acciones Rápidas
              </Heading>
              <Text color="gray.600">
                Comienza añadiendo nuevos candidatos a tu base de datos.
              </Text>
              <Button
                colorScheme="blue"
                size="lg"
                onClick={() => window.location.href = '/candidates/new'}
                w="full"
              >
                Añadir Nuevo Candidato
              </Button>
            </VStack>
          </Box>

          <HStack spacing={8} pt={4} wrap="wrap" justify="center">
            <Box textAlign="center">
              <Text fontSize="3xl" fontWeight="bold" color="blue.500">
                0
              </Text>
              <Text color="gray.500">Candidatos</Text>
            </Box>
            <Box textAlign="center">
              <Text fontSize="3xl" fontWeight="bold" color="green.500">
                0
              </Text>
              <Text color="gray.500">En Proceso</Text>
            </Box>
            <Box textAlign="center">
              <Text fontSize="3xl" fontWeight="bold" color="purple.500">
                0
              </Text>
              <Text color="gray.500">Contratados</Text>
            </Box>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}