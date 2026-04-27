# Testing Skill - Frontend

## Overview
Esta skill cubre todo lo relacionado con testing en el proyecto de frontend React.

## Tech Stack
- **Framework**: React 18 (Create React App)
- **Test Runner**: Jest (vía react-scripts)
- **Testing Library**: React Testing Library + Jest DOM
- **Language**: TypeScript 4.9.5

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

## Best Practices

1. **Naming**: `NombreComponente.test.tsx` o `NombreComponente.spec.tsx`
2. **AAA Pattern**: Arrange, Act, Assert
3. **Queries優先序**: getByRole > getByLabelText > getByText > getByTestId
4. **No test IDs**: Usa roles y texto accessible cuando sea posible
5. **User Event**: Prefiere `@testing-library/user-event` sobre `fireEvent`
6. **Async**: Usa `findBy` para elementos que aparecen asíncronamente
7. **Cleanup**: CRA limpia automáticamente entre tests (no necesitas afterEach)

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