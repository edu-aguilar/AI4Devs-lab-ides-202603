# LTI - Frontend de Sistema de Seguimiento de Talento

## Getting Started

```bash
cd frontend
npm install
npm start
```

La aplicación se ejecutará en [http://localhost:3000](http://localhost:3000).

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Dashboard principal - Panel de gestión de candidatos |
| `/candidates/new` | Formulario para añadir nuevo candidato |

## Dependencias

```bash
npm install react-router-dom @chakra-ui/react @emotion/react @emotion/styled framer-motion react-hook-form @hookform/resolvers zod
```

## Uso del Formulario de Candidato

### Campos del Formulario

**Datos Personales:**
- Nombre (requerido)
- Apellido (requerido)
- Email (requerido, formato válido)
- Teléfono (opcional)
- Dirección (opcional)

**Educación (array dinámico):**
- Institucion
- Título
- Año de inicio
- Año de fin

**Experiencia (array dinámico):**
- Empresa
- Posición
- Fecha de inicio
- Fecha fin (opcional)
- Descripción (opcional)

**Curriculum:**
- Archivo PDF o DOCX (máx 5MB)

### Validación
El formulario utiliza Zod para validación client-side con mensajes de error inline.

### Integración con API
El formulario envía los datos al endpoint `POST /api/candidates` usando FormData.

## Comandos Disponibles

```bash
npm start        # Iniciar servidor de desarrollo (puerto 3000)
npm run build    # Crear build de producción
npm test         # Ejecutar tests Jest
```

## Estructura del Proyecto

```
frontend/src/
├── domain/types/         # Tipos TypeScript
├── api/                  # Servicios HTTP
├── validators/           # Esquemas Zod
├── ui/
│   ├── components/       # Componentes React
│   └── pages/            # Páginas de rutas
├── tests/                # Tests unitarios
└── App.tsx               # Entry point con routing
```

## Testing

```bash
npm test                  # Modo interactivo
npm test -- --coverage    # Con coverage
CI=true npm test          # Modo CI (sin watch)
```

## Documentación de Skills

- [Frontend General](.opencode/frontend.md)
- [Arquitectura](.opencode/architecture.md)
- [Testing](.opencode/testing.md)