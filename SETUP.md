# Setup Progetto Magazz.io

> Guida rapida per configurare l'ambiente di sviluppo

## Prerequisiti

- Node.js >= 20.0.0
- npm >= 10.0.0
- Git

## Setup Iniziale

### 1. Installare dipendenze root

```bash
npm install
```

### 2. Configurare Frontend

```bash
cd frontend
npm install
```

Copia `.env.example` a `.env.local` e configura le variabili se necessario.

### 3. Configurare Backend

```bash
cd ../backend
npm install
```

Copia `.env.example` a `.env` e configura:
- `DATABASE_URL`: URL del database Neon PostgreSQL
- `JWT_SECRET`: Chiave segreta per JWT (generare una chiave sicura)

### 4. Avviare Sviluppo

Dalla root del progetto:

```bash
npm run dev
```

Questo avvierà:
- Frontend su `http://localhost:3000`
- Backend su `http://localhost:5000`

## Script Disponibili

### Root

- `npm run dev` - Avvia frontend + backend in modalità sviluppo
- `npm run build` - Build frontend + backend
- `npm run lint` - Lint frontend + backend

### Frontend

- `npm run dev` - Avvia dev server Vite
- `npm run build` - Build produzione
- `npm run lint` - Lint codice

### Backend

- `npm run dev` - Avvia server con hot reload (tsx)
- `npm run build` - Build TypeScript
- `npm start` - Avvia server produzione
- `npm run lint` - Lint codice

## Prossimi Passi

1. Configurare database Neon PostgreSQL
2. Setup Drizzle ORM e prima migrazione
3. Implementare autenticazione
4. Creare schema database base

## Note

- Il progetto usa workspace npm per gestire frontend e backend insieme
- Frontend: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL + Drizzle ORM (hosting: Neon)

