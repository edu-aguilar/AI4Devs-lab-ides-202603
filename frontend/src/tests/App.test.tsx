import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import App from '../App';

test('renders dashboard with title', () => {
  render(
    <ChakraProvider>
      <App />
    </ChakraProvider>
  );
  const titleElement = screen.getByText(/LTI - Sistema de Seguimiento de Talento/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders add candidate button', () => {
  render(
    <ChakraProvider>
      <App />
    </ChakraProvider>
  );
  const buttonElement = screen.getByText(/Añadir Candidato/i);
  expect(buttonElement).toBeInTheDocument();
});

test('renders welcome message', () => {
  render(
    <ChakraProvider>
      <App />
    </ChakraProvider>
  );
  const welcomeElement = screen.getByText(/Bienvenido al Panel de Gestión de Talento/i);
  expect(welcomeElement).toBeInTheDocument();
});