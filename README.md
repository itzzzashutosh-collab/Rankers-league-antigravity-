# Ranker's League — Core Foundation

A premium competitive examination platform for scheduled national and global challenges, offering high-fidelity replicas of prestigious examinations.

## Directory Architecture

- **`frontend/`**: Next.js 15 Web application (React 19, Tailwind CSS v4, Framer Motion)
- **`backend/`**: Express / Node.js core services layer (TypeScript)
- **`database/`**: PostgreSQL configuration and Supabase structure (RLS policies, schema migrations, and helper functions)
- **`shared/`**: Common data parameters and validation rules
- **`docs/`**: Structural designs and specifications
- **`scripts/`**: Development and verify checks

## Quick Start

### Prerequisites
- Node.js >= 20
- npm >= 10

### Commands
From the root workspace folder:
```bash
# Install all workspace dependencies
npm install

# Run frontend in development mode
npm run dev:frontend

# Run backend in development mode
npm run dev:backend
```
