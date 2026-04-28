# Testing Skill - Frontend

## Overview
Esta skill cubre todo lo relacionado con testing en el proyecto de frontend React.

## Tech Stack
- **Framework**: React 18 (Create React App)
- **Test Runner**: Jest (vía react-scripts)
- **Testing Library**: React Testing Library + Jest DOM
- **Language**: TypeScript 4.9.5

## Niveles de Testing

### 1. Unit Tests
- Funciones puras, hooks personalizados, utilidades
- Sin dependencias de React componentes
- Mock de todas las dependencias externas

### 2. Component Tests
- Componentes React aislados
- Props como entrada, render UI como salida
- No se mockean child components (renderizar todo)

### 3. Integration Tests
- Múltiples componentes trabajando juntos
- APIs externas mockeadas
- Flujos completos de usuario
- **Este es el nivel recomendado para formularios y lógica de negocio**

### 4. E2E Tests
- Cypress/Playwright (fuera del scope de Jest)
- Testing completo sin mocks
- Solo para flujos críticos

## Configuración

### Dependencies (package.json)
```json
"dependencies": {
  "@testing-library/jest-dom": "^5.17.0",
  "@testing-library/react": "^13.4.0",
  "@testing-library/user-event": "^13.5.0"
}
"devDependencies": {
  "jest-environment-jsdom": "^29.7.0"
}
```

### Scripts
```json
"test": "react-scripts test"
```

### Archivos de configuración
- `src/setupTests.ts` - Configura Jest DOM matchers
- `tsconfig.json` - Configuración TypeScript (jsx: react-jsx)

## Ejecutar Tests

### Comandos básicos
```bash
cd frontend
npm test                    # Ejecutar tests en modo watch
npm test -- --coverage     # Con coverage
npm test -- --watchAll=false  #Ejecutar una sola vez
```

### Opciones de CI
```bash
CI=true npm test           # Modo CI (sin watch)
```

## Estructura de tests

### Ubicación recomendada
- `src/App.test.tsx` - Tests del componente principal
- `src/__tests__/` - Tests adicionales organizados por funcionalidad
- `src/tests/` - Alternativa válida (configuración actual)

### Ejemplo de test básico
```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
```

## Patrones comunes

### Testing de componentes
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('interactive component', async () => {
  render(<MyComponent />);
  
  // Con fireEvent
  fireEvent.click(screen.getByRole('button'));
  
  // Con userEvent (recomendado)
  await userEvent.click(screen.getByRole('button'));
});
```

### Testing con props y estado
```tsx
test('renders with props', () => {
  render(<Component title="Test" count={5} />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});

test('handles state changes', () => {
  render(<Counter />);
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByText('1')).toBeInTheDocument();
});
```

### Mocking
```tsx
// Mock de módulos
jest.mock('./api', () => ({
  fetchData: jest.fn()
}));

// Mock de componentes
jest.mock('./MyComponent', () => ({
  __esModule: true,
  default: () => <div>Mocked</div>
}));
```

### Testing de hooks
```tsx
import { renderHook, act } from '@testing-library/react';

test('useState hook', () => {
  const { result } = renderHook(() => useState(0));
  
  act(() => {
    result.current[1](1);
  });
  
  expect(result.current[0]).toBe(1);
});
```

## Integration Tests con Componentes

### Render con Providers
Muchos componentes requieren providers (Router, Chakra, Context, etc.):
```tsx
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <ChakraProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </ChakraProvider>
  );
};

// Uso
test('renders form', () => {
  renderWithProviders(<MyForm />);
  expect(screen.getByText('Submit')).toBeInTheDocument();
});
```

### Flujo completo de formulario
Para integration tests de formularios:
```tsx
describe('CandidateForm - Validación', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra error cuando email es inválido', async () => {
    renderWithProviders(<CandidateForm />);

    // 1. Fill campos obligatorios
    fireEvent.input(screen.getByPlaceholderText('Juan'), {
      target: { name: 'firstName', value: 'Juan' },
    });
    fireEvent.input(screen.getByPlaceholderText('Pérez'), {
      target: { name: 'lastName', value: 'Pérez' },
    });
    fireEvent.input(screen.getByPlaceholderText('email@test.com'), {
      target: { name: 'email', value: 'invalid-email' },
    });

    // 2. Submit
    fireEvent.submit(screen.getByText('Guardar'));

    // 3. Verificar error
    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    });
  });
});
```

## Mocking para Integration Tests

### Mock de APIs externas
```tsx
jest.mock('../api/candidates', () => ({
  createCandidate: jest.fn(),
}));

import { createCandidate } from '../api/candidates';

// En el test
(createCandidate as jest.Mock).mockResolvedValue({ id: 1 });
```

### Mock de react-router-dom
```tsx
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Verificar
expect(mockNavigate).toHaveBeenCalledWith('/');
```

### Mock de Chakra hooks
```tsx
const mockToast = jest.fn();

jest.mock('@chakra-ui/react', () => {
  const actual = jest.requireActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: () => mockToast,
  };
});

// Verificar
expect(mockToast).toHaveBeenCalledWith(
  expect.objectContaining({ title: 'Éxito', status: 'success' })
);
```

## Best Practices

1. **Naming**: `NombreComponente.test.tsx` o `NombreComponente.spec.tsx`
2. **AAA Pattern**: Arrange, Act, Assert
3. **Queries Priority**: getByRole > getByLabelText > getByText > getByTestId
4. **data-testid**: Usar cuando no hay alternativa accessible (ej. botones dinámicos)
5. **User Event**: Prefiere `@testing-library/user-event` sobre `fireEvent`
6. **Async**: Usa `findBy` o `waitFor` para elementos asíncronos
7. **Cleanup**: CRA limpia automáticamente (no necesitas afterEach)
8. **Integration > Unit**: Prefiere tests de integración sobre unitarios cuando el costo es similar
9. **Mock sparingly**: Solo mockea lo necesario (APIs externas, hooks de libs)

## Errores comunes y soluciones

### "Cannot find module"
- Verificar que las extensiones en `moduleFileExtensions` incluyan ts/tsx/js/jsx
- Verificar que tsconfig.json tenga `jsx: react-jsx`

### "toBeInTheDocument is not a function"
- Asegurar que `src/setupTests.ts` importa `@testing-library/jest-dom`

### "Not wrapped in act()"
- Usar `findBy` o envolver en `act()` para actualizaciones asíncronas

### JSDOM errors
- Agregar `jest-environment-jsdom` a devDependencies

## Recursos
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [User Event Docs](https://testing-library.com/docs/user-event/intro/)