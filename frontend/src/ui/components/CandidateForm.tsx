import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  VStack,
  HStack,
  Heading,
  Divider,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { candidateSchema, CandidateFormData } from '../../validators/candidateSchema';
import { createCandidate } from '../../api/candidates';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
      <path d="M12 1.41L10.59 0L6 4.59L1.41 0L0 1.41L4.59 6L0 10.59L1.41 12L6 7.41L10.59 12L12 10.59L7.41 6L12 1.41Z" />
    </svg>
  );
}

export function CandidateForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      education: [],
      experience: [],
    },
  });

  const educationFieldArray = useFieldArray({
    control,
    name: 'education',
  });

  const experienceFieldArray = useFieldArray({
    control,
    name: 'experience',
  });

  const onSubmit = async (data: CandidateFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      if (data.phone) formData.append('phone', data.phone);
      if (data.address) formData.append('address', data.address);
      
      if (data.education) {
        formData.append('education', JSON.stringify(data.education));
      }
      if (data.experience) {
        formData.append('experience', JSON.stringify(data.experience));
      }
      if (data.cv && data.cv instanceof File) {
        formData.append('cv', data.cv);
      }

      await createCandidate(formData);
      
      toast({
        title: 'Candidato creado exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al crear candidato',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={6} align="stretch">
        <Heading size="md">Datos Personales</Heading>
        
        <HStack spacing={4} wrap="wrap">
          <FormControl isInvalid={!!errors.firstName}>
            <FormLabel>Nombre</FormLabel>
            <Input {...register('firstName')} placeholder="Juan" />
            <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.lastName}>
            <FormLabel>Apellido</FormLabel>
            <Input {...register('lastName')} placeholder="Pérez" />
            <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
          </FormControl>
        </HStack>

        <HStack spacing={4} wrap="wrap">
          <FormControl isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input type="email" {...register('email')} placeholder="juan@ejemplo.com" />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.phone}>
            <FormLabel>Teléfono</FormLabel>
            <Input type="tel" {...register('phone')} placeholder="+34 123 456 789" />
            <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
          </FormControl>
        </HStack>

        <FormControl isInvalid={!!errors.address}>
          <FormLabel>Dirección</FormLabel>
          <Textarea {...register('address')} placeholder="Calle Example 123, Madrid" />
          <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
        </FormControl>

        <Divider />

        <HStack justify="space-between">
          <Heading size="md">Educación</Heading>
          <Button
            size="sm"
            data-testid="add-education"
            onClick={() => educationFieldArray.append({ institution: '', degree: '', startYear: 2000, endYear: 2000 })}
          >
            + Añadir
          </Button>
        </HStack>

        {educationFieldArray.fields.map((field, index) => (
          <Box key={field.id} p={4} borderWidth={1} borderRadius="md">
            <HStack justify="flex-end" mb={2}>
              <IconButton
                aria-label="Eliminar educación"
                icon={<CloseIcon />}
                size="sm"
                variant="ghost"
                onClick={() => educationFieldArray.remove(index)}
              />
            </HStack>
            <HStack spacing={4} wrap="wrap">
              <FormControl isInvalid={!!errors.education?.[index]?.institution}>
                <FormLabel>Institución</FormLabel>
                <Input {...register(`education.${index}.institution`)} />
              </FormControl>
              <FormControl isInvalid={!!errors.education?.[index]?.degree}>
                <FormLabel>Título</FormLabel>
                <Input {...register(`education.${index}.degree`)} />
              </FormControl>
            </HStack>
            <HStack spacing={4} mt={2} wrap="wrap">
              <FormControl isInvalid={!!errors.education?.[index]?.startYear}>
                <FormLabel>Año Inicio</FormLabel>
                <Controller
                  control={control}
                  name={`education.${index}.startYear`}
                  render={({ field }) => (
                    <Input
                      type="number"
                      min={1900}
                      max={2100}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
              </FormControl>
              <FormControl isInvalid={!!errors.education?.[index]?.endYear}>
                <FormLabel>Año Fin</FormLabel>
                <Controller
                  control={control}
                  name={`education.${index}.endYear`}
                  render={({ field }) => (
                    <Input
                      type="number"
                      min={1900}
                      max={2100}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
              </FormControl>
            </HStack>
          </Box>
        ))}

        <Divider />

        <HStack justify="space-between">
          <Heading size="md">Experiencia</Heading>
          <Button
            size="sm"
            data-testid="add-experience"
            onClick={() => experienceFieldArray.append({ company: '', position: '', startDate: '', endDate: '', description: '' })}
          >
            + Añadir
          </Button>
        </HStack>

        {experienceFieldArray.fields.map((field, index) => (
          <Box key={field.id} p={4} borderWidth={1} borderRadius="md">
            <HStack justify="flex-end" mb={2}>
              <IconButton
                aria-label="Eliminar experiencia"
                icon={<CloseIcon />}
                size="sm"
                variant="ghost"
                onClick={() => experienceFieldArray.remove(index)}
              />
            </HStack>
            <HStack spacing={4} wrap="wrap">
              <FormControl isInvalid={!!errors.experience?.[index]?.company}>
                <FormLabel>Empresa</FormLabel>
                <Input {...register(`experience.${index}.company`)} />
              </FormControl>
              <FormControl isInvalid={!!errors.experience?.[index]?.position}>
                <FormLabel>Posición</FormLabel>
                <Input {...register(`experience.${index}.position`)} />
              </FormControl>
            </HStack>
            <HStack spacing={4} mt={2} wrap="wrap">
              <FormControl isInvalid={!!errors.experience?.[index]?.startDate}>
                <FormLabel>Fecha Inicio</FormLabel>
                <Input type="date" {...register(`experience.${index}.startDate`)} />
              </FormControl>
              <FormControl isInvalid={!!errors.experience?.[index]?.endDate}>
                <FormLabel>Fecha Fin</FormLabel>
                <Input type="date" {...register(`experience.${index}.endDate`)} />
              </FormControl>
            </HStack>
            <FormControl isInvalid={!!errors.experience?.[index]?.description} mt={2}>
              <FormLabel>Descripción</FormLabel>
              <Textarea {...register(`experience.${index}.description`)} />
            </FormControl>
          </Box>
        ))}

        <Divider />

        <Heading size="md">Curriculum Vitae</Heading>
        <FormControl isInvalid={!!errors.cv}>
          <FormLabel>Adjuntar CV (PDF o DOCX, máximo 5MB)</FormLabel>
          <Input
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                register('cv').onChange(e);
              }
            }}
          />
          <FormErrorMessage>{errors.cv?.message as string}</FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          isLoading={isSubmitting}
          loadingText="Guardando"
        >
          Guardar
        </Button>
      </VStack>
    </Box>
  );
}