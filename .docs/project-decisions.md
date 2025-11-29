# Decisioni Architetturali del Progetto Magazz.io

Questo file documenta le decisioni architetturali e tecnologiche prese durante lo sviluppo.

---

## Stack Tecnologico

- **Frontend**: React + Vite
- **UI**: Componenti moderni (shadcn/ui o simile)
- **Styling**: Tailwind CSS
- **Database**: IndexedDB (locale nel browser)
- **Tipo App**: PWA (Progressive Web App)

## Architettura

- **Tipo**: Solo frontend (nessun backend)
- **Storage**: Database locale sul PC (IndexedDB gestito dal browser)
- **Installazione**: PWA installabile nel browser
- **Offline**: Funziona senza internet dopo il primo setup

## Database

- **Tipo**: IndexedDB (database locale nel browser)
- **Gestione**: Automatica dall'app (utente non deve gestire nulla)
- **Backup/Export**: Funzionalità da implementare nell'app
- **Privacy**: Dati solo sul PC locale, nessun cloud

## Decisioni Prese

### PWA (Progressive Web App) - Novembre 2025

**Decisione**: Usare PWA invece di app con backend separato

**Ragioni**:
- Più semplice per l'utente (non deve avviare server)
- Dati locali sul PC (privacy)
- Funziona offline dopo il primo setup
- Stesse funzionalità e design di un'app con backend
- Best practice 2025 rispettate

**Alternative valutate**:
- App con backend separato: scartata perché richiede avviare server ogni volta
- Solo browser senza PWA: scartata perché dati potrebbero perdersi

---

## Alternative Valutate

_(Alternative tecnologiche valutate e scartate verranno documentate qui con le ragioni)_

