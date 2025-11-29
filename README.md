# Magazz.io

Gestionale web app per la gestione di magazzini e portafogli/casse correlati.

## Tecnologie

- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animazioni
- **Dexie (IndexedDB)** - Database locale
- **React Query** - Gestione stato e cache
- **PWA** - Progressive Web App

## Setup

```bash
# Installa dipendenze
npm install

# Avvia server di sviluppo
npm run dev

# Build per produzione
npm run build
```

## Funzionalità

- Gestione prodotti
- Gestione magazzini (Driplug, Meetdrip)
- Gestione portafogli/casse
- Movimenti personalizzabili
- Gestione clienti (solo Meetdrip)
- Personalizzazione via interfaccia

## Autenticazione

PIN: `666`

## Documentazione

Documentazione tecnica del progetto in `.docs/`:
- `project-rules.md` - Regole tecniche
- `project-goals.md` - Obiettivi e funzionalità
- `project-decisions.md` - Decisioni architetturali
- `project-data-structure.md` - Struttura dati
- `errors-and-lessons.md` - Errori e lezioni apprese

## Note

- Dati salvati localmente (IndexedDB)
- Funziona offline dopo il primo setup
- Privacy: dati solo sul PC locale

