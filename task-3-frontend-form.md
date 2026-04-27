# Task 3: Frontend Form - Añadir Candidato from UI

## Objetivo

Crear la interfaz de usuario para que el reclutador pueda añadir candidatos desde el dashboard. Incluye formulario con React Hook Form, validación client-side, y feedback visual.

---

## Detalles Técnicos

### Routing

| Ruta | Archivo | Descripción |
|------|--------|-------------|
| `/` | `Dashboard.tsx` | Página principal con botón "Añadir Candidato" |
| `/candidates/new` | `CandidateFormPage.tsx` | Página con formulario |

### Componentes a Crear

| Componente | Ruta | Descripción |
|-----------|------|-------------|
| AddCandidateButton | `components/AddCandidateButton.tsx` | Botón flotante/Toolbar |
| CandidateForm | `components/CandidateForm.tsx` | Formulario completo |
| CandidateFormPage | `pages/CandidateFormPage.tsx` | Contenedor con estado |
| CandidateItem | `components/CandidateItem.tsx` | (para lista futura) |

Apóyate en la librería @chakra-ui/react como catálogo de componentes que utilizar.

### API Client

```typescript
// api/candidates.ts
import { Candidate } from '../types/candidate';

export async function createCandidate(formData: FormData): Promise<Candidate> {
  const response = await fetch('/api/candidates', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message);
  }
  return response.json();
}
```

### Tipos TypeScript

```typescript
// types/candidate.ts
export interface Candidate {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  education?: Education[];
  experience?: Experience[];
  cvFileName?: string;
  status: CandidateStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  institution: string;
  degree: string;
  startYear: number;
  endYear: number;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export type CandidateStatus = 'NEW' | 'SCREENING' | 'INTERVIEW' | 'HIRED' | 'REJECTED';
```

### Estructura CandidateForm

```
CandidateForm
├── Datos Personales (sección)
│   ├── firstName (text)
│   ├── lastName (text)
│   ├── email (email)
│   ├── phone (tel)
│   └── address (textarea)
├── Educación (sección, array dinámico)
│   ├── [+ Añadir] button
│   ├── education[]
│   │   ├── institution
│   │   ├── degree
│   │   ├── startYear
│   │   └── endYear
│   └── [× Eliminar]
├── Experiencia (sección, array dinámico)
│   ├── [+ Añadir] button
│   ├── experience[]
│   │   ├── company
│   │   ├── position
│   │   ├── startDate
│   │   ├── endDate
│   │   └── description
│   └── [× Eliminar]
├── CV (sección)
│   ├── file input (accept=".pdf,.docx")
│   └── progress bar (optional)
└── [Guardar] button submit
```

### React Hook Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { candidateSchema } from '../validators/candidateSchema';

const { register, handleSubmit, formState: { errors }, control } = useForm({
  resolver: zodResolver(candidateSchema),
});
```

### Validación Client-side

| Campo | Regla |
|-------|-------|
| firstName | required, max 100 |
| lastName | required, max 100 |
| email | required, email válido |
| phone | max 20 |
| address | max 500 |
| cv | max 5MB, PDF/DOCX only |

### Feedback Visual

- **Éxito**: Toast/Snackbar "Candidato creado exitosamente" + redirect a lista
- **Error**: Mostrar errores de validación inline + toast si error de servidor
- **Loading**: Deshabilitar botón submit + spinner

---

## Archivos a Crear

| Archivo | Acción |
|---------|--------|
| `frontend/src/types/candidate.ts` | Crear |
| `frontend/src/api/candidates.ts` | Crear |
| `frontend/src/validators/candidateSchema.ts` | Crear |
| `frontend/src/components/AddCandidateButton.tsx` | Crear |
| `frontend/src/components/CandidateForm.tsx` | Crear |
| `frontend/src/pages/CandidateFormPage.tsx` | Crear |
| `frontend/src/App.tsx` | Modificar - agregar routing |

### Dependencias a Instalar

```bash
npm install react-hook-form @hookform/resolvers zod
```

---

## Criterios de Aceptación

1. ✅ Botón "Añadir Candidato" visible en dashboard
2. ✅ Click navega a `/candidates/new`
3. ✅ Formulario muestra todos los campos definidos
4. ✅ Campos requeridos muestran error si vacíos
5. ✅ Email muestra error si formato inválido
6. ✅ Se pueden agregar/eliminar entradas de educación
7. ✅ Se pueden agregar/eliminar entradas de experiencia
8. ✅ File input acepta solo PDF/DOCX
9. ✅ File input muestra error si > 5MB
10. ✅ Submit crea candidate y muestra mensaje éxito
11. ✅ Errores del servidor se muestran correctamente
12. ✅ Diseño responsive (móvil/tablet)
13. ✅ Tests unitarios pasan

---

## Tests (Jest + React Testing Library)

### Casos de prueba

| Test | Descripción |
|------|-------------|
| render | Formulario renderiza correctamente |
| required fields | Muestra error si campos requeridos vacíos |
| invalid email | Muestra error si email inválido |
| valid submit | Llama API con datos correctos |
| success message | Muestra toast tras crear |
| error message | Muestra error si servidor falla |

### Ejemplo test

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { CandidateForm } from './CandidateForm';

test('shows error for empty firstName', () => {
  render(<CandidateForm />);
  fireEvent.click(screen.getByText('Guardar'));
  expect(await screen.findByText('First name is required')).toBeInTheDocument();
});
```

---

## Documentación

Incluir en `frontend/README.md`:
- Nuevas rutas agregadas
- Guía de uso del formulario
- Dependencias necesarias