# Magazz.io App

> Repository principale per l'applicazione Magazz.io

## 📋 Panoramica

**Stato**: 🟢 Setup Iniziale Completato - Pronto per Sviluppo

Progetto completamente definito e allineato:
- ✅ 7 Priorità Assolute definite
- ✅ Funzionalità Essenziali complete (incluse 16 funzionalità differenzianti)
- ✅ Stack tecnologico approvato
- ✅ Allineamento best practice 2025 e miglioramenti AI

## 📚 Documentazione

Documentazione essenziale nella cartella `.docs/`:

### Documentazione Progetto
- **[PROGETTO.md](.docs/PROGETTO.md)** - Definizione completa del progetto Magazz.io
- **[FUNZIONALITA_ESSENZIALI.md](.docs/FUNZIONALITA_ESSENZIALI.md)** - ✅ Funzionalità essenziali MVP definite
- **[STACK_TECNOLOGICO_FINALE.md](.docs/STACK_TECNOLOGICO_FINALE.md)** - ✅ Stack tecnologico completo approvato
- **[DESIGN_SISTEMA_STILE.md](.docs/DESIGN_SISTEMA_STILE.md)** - ✅ Design system e stile visivo completo
- **[FUNZIONALITA_PRIVATO_VS_AZIENDA.md](.docs/FUNZIONALITA_PRIVATO_VS_AZIENDA.md)** - ✅ Guida definitiva: funzionalità privato vs azienda
- **[ANALISI_PRIVATO_VS_AZIENDA.md](.docs/ANALISI_PRIVATO_VS_AZIENDA.md)** - Analisi dettagliata differenze privato/azienda
- **[ANALISI_MAGAZZINO_BASE_VS_MULTI.md](.docs/ANALISI_MAGAZZINO_BASE_VS_MULTI.md)** - ✅ Analisi decisione: multi-magazzino unificato
- **[PROBLEMI_GESTIONALI_ANALISI.md](.docs/PROBLEMI_GESTIONALI_ANALISI.md)** - Analisi problemi gestionali esistenti

**Note**: File storici e snapshot archiviati in [.docs/archive/](.docs/archive/) per riferimento.

### Documentazione Lavoro
- **[PREFERENZE.md](.docs/PREFERENZE.md)** - Preferenze di lavoro e convenzioni specifiche
- **[ERRORI_E_LEZIONI.md](.docs/ERRORI_E_LEZIONI.md)** - Errori passati e lezioni apprese
- **[DECISIONI.md](.docs/DECISIONI.md)** - Decisioni architetturali importanti (ADR)

> **Approccio**: Il codice è la documentazione principale. Documentiamo solo ciò che non è ovvio dal codice stesso.

## 🚀 Quick Start

Vedi [SETUP.md](SETUP.md) per la guida completa di setup.

### Setup Rapido

```bash
# Installare dipendenze root
npm install

# Installare dipendenze frontend e backend
cd frontend && npm install && cd ..
cd backend && npm install && cd ..

# Configurare variabili d'ambiente
# Frontend: copiare frontend/.env.example a frontend/.env.local
# Backend: copiare backend/.env.example a backend/.env e configurare DATABASE_URL

# Avviare sviluppo (dalla root)
npm run dev
```

Frontend: http://localhost:3000  
Backend: http://localhost:5000

## 🛠️ Stack Tecnologico

**Stack completo approvato**: Vedi `.docs/STACK_TECNOLOGICO_FINALE.md`

**Riepilogo**:
- Frontend: React 18+ TS, shadcn/ui, Tailwind CSS, TanStack Query
- Backend: Node.js + Express.js  
- Database: PostgreSQL + Drizzle ORM
- Hosting: Render (app), Neon (database)

## 📝 Note

Documentazione minima e mirata. Il codice parla da solo per la maggior parte delle cose.

