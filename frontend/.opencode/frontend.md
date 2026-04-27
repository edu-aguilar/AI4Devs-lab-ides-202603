# Frontend Skill - General Guide

## Overview
This skill covers the general frontend development practices for the LTI Applicant Tracking System.

## Tech Stack
- **Framework**: React 18 (Create React App)
- **Language**: TypeScript 4.9.5
- **Routing**: React Router DOM 6.x
- **UI Library**: Chakra UI 2.x
- **Form Handling**: React Hook Form + Zod
- **Testing**: Jest + React Testing Library
- **Port**: `http://localhost:3000`

## Project Structure
```
frontend/src/
├── domain/           # Domain layer - Types and interfaces
│   └── types/
├── api/              # API layer - HTTP services
├── validators/       # Validation schemas (Zod)
├── ui/               # UI layer
│   ├── components/  # Reusable components
│   └── pages/       # Route pages
├── tests/            # Unit tests
├── App.tsx           # Main entry with routing
└── index.tsx         # React DOM entry
```

## Dependencies
```bash
npm install react-router-dom @chakra-ui/react @emotion/react @emotion/styled framer-motion react-hook-form @hookform/resolvers zod
```

## Routing
Routes are defined in `App.tsx` using React Router:
- `/` - Dashboard (main page)
- `/candidates/new` - New candidate form

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './ui/pages/Dashboard';
import { CandidateFormPage } from './ui/pages/CandidateFormPage';

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/candidates/new" element={<CandidateFormPage />} />
  </Routes>
</BrowserRouter>
```

## Chakra UI Usage
Wrap the app with ChakraProvider at root level:
```typescript
import { ChakraProvider } from '@chakra-ui/react';

<ChakraProvider>
  <App />
</ChakraProvider>
```

Common components:
- `Box`, `Container`, `VStack`, `HStack` - Layout
- `Button`, `Input`, `Textarea`, `Select` - Form elements
- `FormControl`, `FormLabel`, `FormErrorMessage` - Form validation
- `Heading`, `Text` - Typography
- `useToast` - Notifications

## Form Handling
Using React Hook Form with Zod validation:
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { candidateSchema } from '../validators/candidateSchema';

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(candidateSchema),
});
```

## Available Commands
```bash
cd frontend
npm install          # Install dependencies
npm start            # Start dev server (port 3000)
npm run build        # Production build
npm test             # Run Jest tests
```

## Best Practices
1. Keep domain types isolated in `domain/types/`
2. Keep API calls in `api/` folder
3. Keep validation schemas in `validators/` folder
4. UI components go in `ui/components/`
5. Pages go in `ui/pages/`
6. Use functional components with hooks
7. Use TypeScript strict mode