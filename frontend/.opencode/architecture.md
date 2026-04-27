# Frontend Architecture Skill

## Overview
This document describes the layered architecture pattern used in the frontend application.

## Architecture Layers

```
┌─────────────────────────────────────┐
│           UI Layer                  │
│  (pages, components, routing)       │
├─────────────────────────────────────┤
│        Validators Layer              │
│      (Zod schemas, validation)      │
├─────────────────────────────────────┤
│          API Layer                   │
│    (HTTP services, fetch calls)     │
├─────────────────────────────────────┤
│         Domain Layer                 │
│     (Types, interfaces, models)     │
└─────────────────────────────────────┘
```

## Layer Responsibilities

### Domain Layer (`src/domain/`)
- Contains TypeScript interfaces and types
- No business logic, only data structures
- Example: `Candidate`, `Education`, `Experience` types

```typescript
// src/domain/types/candidate.ts
export interface Candidate {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  // ...
}
```

### API Layer (`src/api/`)
- Contains HTTP service functions
- Handles data fetching and server communication
- Returns domain types
- Example: `createCandidate`, `getCandidates`

```typescript
// src/api/candidates.ts
import { Candidate } from '../domain/types/candidate';

export async function createCandidate(formData: FormData): Promise<Candidate> {
  const response = await fetch('/api/candidates', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to create candidate');
  }
  return response.json();
}
```

### Validators Layer (`src/validators/`)
- Contains Zod validation schemas
- Client-side form validation
- Reusable across components

```typescript
// src/validators/candidateSchema.ts
import { z } from 'zod';

export const candidateSchema = z.object({
  firstName: z.string().min(1, 'Nombre requerido').max(100),
  email: z.string().email('Email inválido'),
  // ...
});
```

### UI Layer (`src/ui/`)
- Contains React components and pages
- Uses Chakra UI for styling
- Uses React Router for navigation
- Uses React Hook Form for form state

```
src/ui/
├── components/   # Reusable UI components
│   ├── AddCandidateButton.tsx
│   └── CandidateForm.tsx
└── pages/        # Route pages
    ├── Dashboard.tsx
    └── CandidateFormPage.tsx
```

## Separation of Concerns

1. **Domain** - What data we work with (types only)
2. **API** - How we communicate with backend
3. **Validators** - How we validate input
4. **UI** - How we display and interact

## Benefits

- **Testability**: Each layer can be tested independently
- **Maintainability**: Changes in one layer don't affect others
- **Reusability**: API and validators can be used by multiple components
- **Clarity**: Clear responsibility for each layer

## Example Flow

```
User submits form
    ↓
UI Component (CandidateForm)
    ↓
React Hook Form validates (using Zod schema from Validators layer)
    ↓
API Service (createCandidate from API layer)
    ↓
HTTP POST to backend
    ↓
Response mapped to Domain type (Candidate)
```

## Testing Strategy

- **Validators**: Unit test Zod schemas directly
- **API**: Mock fetch calls
- **UI Components**: Test rendering and user interactions

## File Naming Conventions

- Types: `*.ts` (e.g., `candidate.ts`)
- Schemas: `*Schema.ts` (e.g., `candidateSchema.ts`)
- API: `*.ts` (e.g., `candidates.ts`)
- Components: `*.tsx` (e.g., `CandidateForm.tsx`)
- Pages: `*.tsx` (e.g., `Dashboard.tsx`)
- Tests: `*.test.tsx` (e.g., `CandidateForm.test.tsx`)