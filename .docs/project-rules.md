# Regole Tecniche del Progetto Magazz.io

Questo file contiene le regole tecniche e specifiche del progetto Magazz.io.

---

## Sviluppo
- La web app DEVE seguire le best practice 2025 in TUTTI gli aspetti:
  - Stile e design moderno
  - Funzionalità complete e robuste
  - Performance ottimizzate
  - Sicurezza
  - Accessibilità (WCAG)
  - UX/UI professionale
  - Architettura pulita e scalabile
  - Responsive design
  - SEO (se applicabile)
  - Qualsiasi altro standard di una web app professionale moderna

## Personalizzazione
- L'utente DEVE poter personalizzare autonomamente via interfaccia (senza toccare codice):
  - Campi/colonne: aggiungere, rimuovere, rinominare, riordinare
  - Etichette e termini
  - Valori predefiniti
  - Colori/temi
  - Layout e ordine dei campi
  - Validazioni semplici (es. campo obbligatorio)
- Interfaccia di personalizzazione: sezione "Impostazioni" o "Personalizza" nell'app
- Nuove funzionalità/logica complessa: richiedono modifiche al codice (da chiedere all'AI)

## Testing
- Scrivere test automatici per funzionalità critiche
- Test devono essere mantenuti e aggiornati quando il codice cambia
- Usare best practice 2025 per testing (unit test, integration test, e2e quando necessario)
- Test devono essere affidabili e veloci

## Gestione Errori e Logging
- Gestione errori è FONDAMENTALE per capire come non farli in futuro
- Logging strutturato e informativo per tutti gli errori
- Errori devono essere tracciati con contesto sufficiente per debug
- Usare best practice 2025 per error handling (try/catch appropriati, error boundaries, logging centralizzato)
- Gli errori devono aiutare a prevenire problemi futuri
- Errori significativi commessi durante lo sviluppo: documentarli in `errors-and-lessons.md` per evitare di ripeterli

## Privacy
- La privacy dei dati è fondamentale

## Performance e Ottimizzazione (PWA Locale)
- OBIETTIVO: ottimizzare SEMPRE le performance dell'app lato client
- La funzionalità richiesta DEVE essere sempre realizzata, ma con performance OTTIMIZZATE
- NON usare mai workaround sporchi, SOLO fix strutturali intelligenti
- Ogni nuova funzionalità che accede al database (IndexedDB) DEVE:
  - Evitare query ridondanti
  - Minimizzare operazioni sul database
  - Usare cache quando possibile

### Paginazione
- Liste grandi: SEMPRE paginazione lato client per performance UI
- Frontend: paginazione con `page` e `pageSize` per evitare di renderizzare troppi elementi
- MAI caricare e renderizzare TUTTI i record in una volta per liste grandi
- Usare virtualizzazione quando possibile per liste molto lunghe

### React Query (TanStack) - Cache Locale
- Configurazione globale: `staleTime: 60000`, `refetchOnWindowFocus: false`, `gcTime: 5 minuti`
- Query: usano valori default globali, NON `staleTime: 0`
- Dopo mutate: usare `queryClient.invalidateQueries` con chiavi mirate
- Cache locale: React Query gestisce cache dei dati IndexedDB per evitare query ridondanti

### Filtri e Ricerca
- Filtri lato client: applicare filtri direttamente su IndexedDB
- Per liste molto grandi: usare indici IndexedDB per performance
- Evitare di caricare tutto in memoria e poi filtrare: filtrare direttamente sul database

### Checklist Nuove Funzionalità
1. Lista lunga? → paginazione lato client + virtualizzazione se necessario
2. Query frequenti? → usare cache React Query appropriata
3. Filtri complessi? → usare indici IndexedDB per performance
4. Volume atteso? → pensare subito a paginazione e indici database

### Cosa NON fare MAI
- Caricare TUTTI i record in memoria per liste grandi
- Query ridondanti su IndexedDB senza cache
- Renderizzare migliaia di elementi DOM senza paginazione/virtualizzazione
- Filtrare dataset enormi in memoria invece che su IndexedDB

