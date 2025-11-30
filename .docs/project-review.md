# Project Review - Problemi, Best Practice e Qualità

**Data**: Gennaio 2025  
**Scopo**: Documento unificato per verificare problemi attuali, best practice e pattern di qualità durante implementazione

**⚠️ NOTA**: Questo documento si riferisce allo stato DOPO reset completo (Gennaio 2025). Codice precedente è stato cancellato.

---

## 1. PROBLEMI ATTUALI E DISCREPANZE

### 🔴 PROBLEMI CRITICI (Blocca funzionalità core)

#### 1. Pagina Portafogli - NON IMPLEMENTATA
**Requisito** (project-goals.md):
- Vista portafogli (saldi cash, debiti)
- Storico movimenti finanziari
- Saldare debiti

**Stato Attuale**: Solo placeholder

**Problema**: Pagina core completamente mancante.

---

#### 2. Calcolo Saldi Portafogli - ✅ IMPLEMENTATO (Gennaio 2025)
**Requisito** (project-data-structure.md):
- `balance` - Saldo (calcolato dai movimenti)
- `cash_balance` - Saldo cash (solo movimenti cash)
- `debt_balance` - Saldo debiti non saldati (solo debiti pending)

**Come DOVREBBE funzionare**:
- Calcolare `balance` totale: somma entrate - uscite (tutti i metodi pagamento)
- Calcolare `cash_balance`: solo movimenti con `payment_method === 'cash'`
- Calcolare `debt_balance`: solo movimenti con `is_debt === true && debt_status === 'pending'`
- **Bancomat**: tracciato ma NON visibile nel saldo (solo storico)

**Stato Attuale**: ✅ Implementato
- Hook `usePortfolioBalance` creato e funzionante
- Calcolo corretto: bancomat escluso dal saldo, debiti gestiti separatamente
- Visualizzazioni in Impostazioni (tabella e card mobile)
- Anteprima impatto nei form Movimenti

---

#### 3. Dashboard - SOLO PLACEHOLDER
**Requisito** (project-goals.md):
- Panoramica magazzini (quantità prodotti per magazzino)
- Panoramica portafogli (saldi cash, debiti)
- Movimenti recenti

**Stato Attuale**: Solo placeholder

**Problema**: Dashboard core non funzionante.

---

#### 4. Export/Backup Dati - NON IMPLEMENTATO
**Requisito** (project-decisions.md):
- Export in JSON/CSV
- Backup manuale
- Import dati

**Problema**: Critico per PWA locale - utente deve poter salvare dati.

---

### 🟡 FUNZIONALITÀ RICHIESTE MANCANTI

#### 5. Gestione Tagli e Stato Raw/Cured - NON IMPLEMENTATA
**Requisito** (project-goals.md):
- Gestione tagli (dividere pacchi, ottimizzare tagli per ordini)
- Cura merce (Raw → Cured)

**Problema**: Funzionalità core del caso d'uso mancanti.

**Note**:
- Stato (Raw/Cured) viene gestito dai movimenti, non dal prodotto
- Deve essere possibile tracciare cambio stato nei movimenti

---

#### 6. Stock Movements (Audit Trail) - NON IMPLEMENTATO
**Requisito** (project-data-structure.md):
- Tabella `StockMovements` per storico completo
- Tracciamento variazioni quantità
- Audit trail

**Problema**: Audit trail mancante.

**Come implementare**: Popolare `StockMovements` quando si creano/modificano movimenti che coinvolgono magazzino.

---

#### 7. Collegamento Clienti-Movimenti - NON IMPLEMENTATO
**Requisito** (project-goals.md):
- Collegamento a movimenti/ordini (opzionale)

**Problema**: Campo `customer_id` mancante in `Transaction`.

---

#### 8. Personalizzazione Campi Prodotti - NON IMPLEMENTATA
**Requisito** (project-rules.md):
- L'utente DEVE poter personalizzare via interfaccia:
  - Campi/colonne: aggiungere, rimuovere, rinominare, riordinare
  - Layout e ordine dei campi

**Problema**: Funzionalità richiesta non presente.

---

### 🟡 PROBLEMI ARCHITETTURALI

#### 9. Tabella Stock nel Database - NON NECESSARIA
**Requisito** (project-data-structure.md):
> "La quantità è CALCOLATA dai movimenti, non memorizzata."

**Problema**: Tabella `stock` esiste nel database ma non viene usata. Crea confusione.

**Soluzione**: Rimuovere tabella Stock, mantenere solo calcolo in tempo reale.

---

#### 10. Logica Bancomat - ✅ VERIFICATO E IMPLEMENTATO
**Requisito** (project-data-structure.md):
> "Bancomat: tracciato ma non visibile nel saldo (solo storico)"

**Stato Attuale**: ✅ Implementato correttamente
- Hook `usePortfolioBalance` esclude bancomat dal calcolo saldi
- Bancomat tracciato nei movimenti ma non incluso in `balance` o `cash_balance`
- Logica verificata e funzionante

---

---

## 2. BEST PRACTICE E STANDARD DA SEGUIRE

### 2.1 Dashboard Moderna

**Standard del settore:**
- Metriche reali calcolate in tempo reale
- Visualizzazioni dati (grafici, chart)
- Trend temporali
- Quick actions

**Cosa implementare:**
- Totale prodotti attivi
- Stock totale per magazzino (calcolato dai movimenti)
- Valore stock totale
- Movimenti ultimi 30 giorni
- Saldi portafogli (calcolati dai movimenti)
- Debiti pendenti

**Tecnologie da valutare:**
- Recharts o Chart.js per grafici
- Grafici responsive e interattivi

---

### 2.2 Export/Backup Dati

**Standard del settore:**
- Export in JSON/CSV
- Backup manuale on-demand
- Import dati con validazione

**Cosa implementare:**
- Export tutti i dati o selettivo
- Formati: JSON, CSV
- Download file
- Validazione dati per import

**Tecnologie:**
- PapaParse per CSV
- FileSaver.js per download
- JSON nativo per export

---

### 2.3 Performance e Ottimizzazione

**Standard:**
- Virtualizzazione liste lunghe
- Lazy loading componenti
- Code splitting
- Filtri su IndexedDB (non in memoria)

**Cosa implementare:**
- Paginazione a livello database per liste grandi
- Filtrare direttamente su IndexedDB quando possibile
- Usare indici IndexedDB per ricerche frequenti
- Virtualizzazione (react-window) per liste > 100 elementi
- Lazy loading route non critiche

**Regola**: MAI caricare TUTTI i record in memoria per liste grandi.

---

### 2.4 Accessibilità (WCAG 2.1 AA minimo)

**Standard:**
- Keyboard navigation completa
- Screen reader support
- Focus management
- ARIA labels completi

**Cosa implementare:**
- `aria-label` su tutti i bottoni icona
- Focus trap nei dialog
- Gestire Escape per chiudere modali
- Focus restoration
- Tab navigation completa

---

### 2.5 Responsive Design

**Standard:**
- Mobile-first approach
- Touch-friendly (target >= 44px)
- Adaptive layout

**Cosa implementare:**
- ✅ Sidebar collassabile per mobile - COMPLETATO
- ✅ Menu hamburger - COMPLETATO
- ✅ Card view per mobile invece di tabelle - COMPLETATO
- ✅ Dialog responsive - COMPLETATO

**Stato Attuale (Gennaio 2025):**
- ✅ Tutte le tabelle hanno card view mobile
- ✅ Dialog responsive con `w-[95vw] sm:w-full`
- ✅ TabsList responsive (grid-cols-2 sm:grid-cols-3 lg:grid-cols-5)

---

### 2.5.1 Tabelle Ottimizzate

**Standard:**
- Paginazione per liste grandi
- Responsive design (tabella desktop + card mobile)
- Proporzioni colonne bilanciate
- Contenuto centrato verticalmente e orizzontalmente
- Performance: renderizzare solo elementi visibili

**Stato Attuale (Gennaio 2025):**
- ✅ Paginazione lato client implementata:
  - Movimenti: 20 elementi per pagina
  - Tipi Movimento: 15 elementi per pagina
  - Tipi Prodotto: 15 elementi per pagina
- ✅ Responsive design completo:
  - Desktop: tabelle con colonne proporzionate (percentuali)
  - Mobile: card view con tutte le informazioni
- ✅ Centratura contenuto:
  - Tutte le celle centrate verticalmente (`verticalAlign: 'middle'`)
  - Tutte le celle centrate orizzontalmente di default (`textAlign: 'center'`)
  - Allineamento personalizzato solo quando esplicito (`text-right`, `text-left`)
- ✅ Accessibilità:
  - ARIA labels completi su tutti i bottoni
  - `sr-only` text per screen reader
  - `aria-current="page"` per paginazione
- ✅ UX ottimizzata:
  - Paginazione visibile solo quando necessaria (length > pageSize)
  - Controlli paginazione con frecce e numeri pagina
  - Indicatore "Mostrando X-Y di Z elementi"
- ✅ Proporzioni colonne standardizzate (Gennaio 2025):
  - Larghezze proporzionate con percentuali invece di pixel fissi
  - Coerenza tra tabelle correlate (Magazzini/Portafogli con stesse proporzioni)
  - Colonne standardizzate (Azioni sempre 120px, numeri/date ottimizzate)
  - Colonne Stock e Saldo aggiunte in Impostazioni con larghezze corrette

**File modificati:**
- `src/components/ui/table.tsx` - Componente Table con centratura automatica
- `src/pages/Impostazioni.tsx` - Tutte le tabelle ottimizzate con proporzioni e colonne Stock/Saldo
- `src/pages/Movimenti.tsx` - Tabella movimenti ottimizzata con proporzioni
- `src/pages/Prodotti.tsx` - Tabella prodotti ottimizzata con proporzioni e centratura
- `src/pages/Clienti.tsx` - Tabella clienti ottimizzata con proporzioni e centratura

---

### 2.6 Gestione Errori

**Standard:**
- Error boundary globale
- Logging strutturato
- Retry per errori transitori
- Error handling appropriato

**Cosa implementare:**
- Error Boundary che wrappa l'app
- Logging strutturato (non solo console.error)
- Gestione errori nelle mutation React Query
- UI di fallback user-friendly

---

### 2.7 Navigazione

**Standard del settore:**
- Sidebar navigation per app complesse
- Ricerca globale
- Breadcrumb per navigazione gerarchica

**Cosa implementare:**
- ✅ Sidebar verticale collassabile (IMPLEMENTATA - Gennaio 2025)
  - Desktop: sidebar collassabile con icone
  - Mobile: menu hamburger con slide-in
  - Accessibilità completa (WCAG 2.1 AA): focus trap, Escape, ARIA attributes
  - Persistenza stato in localStorage
  - Ordine logico: Dashboard → Anagrafiche (Prodotti, Clienti) → Riepiloghi (Magazzini, Portafogli) → Operazioni (Movimenti) → Configurazione (Impostazioni)
- Ricerca globale (prodotti, clienti, movimenti)
- Breadcrumb per pagine con sottosezioni

---

---

## 3. PATTERN E QUALITÀ CODICE

### 3.1 Pattern da Seguire

#### React Query (TanStack)
- Configurazione globale: `staleTime: 60000`, `refetchOnWindowFocus: false`, `gcTime: 5 minuti`
- Query: usano valori default globali, NON `staleTime: 0`
- Dopo mutate: `queryClient.invalidateQueries` con chiavi mirate
- Cache locale: React Query gestisce cache IndexedDB

#### Hooks Pattern
- Separazione logica: un hook per entità
- Type safety: TypeScript completo, evitare `any`
- Error handling: try/catch con logging strutturato
- Loading states: gestiti da React Query

#### Componenti Pattern
- Separazione logica (filtri, ordinamento, paginazione)
- Componenti separati per dettagli
- Loading/empty states informativi
- Conferme per azioni distruttive
- Validazione form in tempo reale

---

### 3.2 Pattern da Evitare

#### ❌ NON fare:
- Caricare TUTTI i record in memoria per liste grandi
- Filtrare dataset enormi in memoria invece che su IndexedDB
- Query ridondanti su IndexedDB senza cache
- Renderizzare migliaia di elementi DOM senza paginazione/virtualizzazione
- Assumere invece di verificare nella documentazione
- Implementare senza leggere requisiti completi

#### ✅ Fare:
- Paginare anche a livello database per liste grandi
- Filtrare direttamente su IndexedDB quando possibile
- Usare indici IndexedDB per ricerche frequenti
- Paginazione lato client per performance UI
- Virtualizzazione per liste > 100 elementi
- Verificare sempre documentazione prima di implementare

---

### 3.3 Calcoli e Logica

#### Stock (Giacenze)
- **Calcolare dai movimenti**, NON memorizzare
- Logica: per ogni prodotto+magazzino, somma entrate - uscite
- Hook: `useStockByWarehouse`, `useStockByProduct`

#### Saldi Portafogli
- **Calcolare dai movimenti**, NON memorizzare
- `balance`: somma entrate - uscite (tutti i metodi)
- `cash_balance`: solo movimenti `payment_method === 'cash'`
- `debt_balance`: solo movimenti `is_debt === true && debt_status === 'pending'`
- **Bancomat**: tracciato ma NON incluso nel saldo

#### Stato Prodotto (Raw/Cured)
- Gestito dai movimenti, NON dal prodotto
- Tracciare cambio stato nei movimenti
- Campo `state` nei movimenti (non in Stock, che non esiste)

---

### 3.4 Database Schema

#### Tabelle Necessarie
- `productTypes` - Tipi prodotto
- `products` - Prodotti (solo anagrafica)
- `entities` - Entità (Driplug/Meetdrip)
- `warehouses` - Magazzini (collegati a entities)
- `portfolios` - Portafogli (collegati a entities)
- `transactionTypes` - Tipi movimento (personalizzabili)
- `transactions` - Movimenti
- `customers` - Clienti (solo Meetdrip)
- `stockMovements` - Audit trail movimenti stock

#### Tabelle NON Necessarie
- `stock` - NON serve, quantità calcolata dai movimenti

---

---

## 4. PRIORITÀ DI IMPLEMENTAZIONE

### 🔴 Alta Priorità (Fondamentali)

1. **Pagina Portafogli**
   - Vista portafogli con saldi calcolati
   - Storico movimenti finanziari
   - Saldare debiti

2. **Calcolo Saldi Portafogli** - ✅ COMPLETATO (Gennaio 2025)
   - ✅ Implementato calcolo `balance`, `cash_balance`, `debt_balance`
   - ✅ Logica bancomat (tracciato ma non nel saldo)
   - ✅ Visualizzazioni in Impostazioni
   - ✅ Anteprima impatto nei form Movimenti

3. **Dashboard con dati reali**
   - Calcolare metriche reali
   - Mostrare dati effettivi

4. **Export/Backup dati**
   - Critico per PWA locale

### 🟡 Media Priorità (Importanti)

5. Gestione tagli prodotti
6. Gestione stato Raw/Cured nei movimenti
7. Stock Movements (audit trail)
8. Collegamento clienti-movimenti
9. Personalizzazione campi prodotti
10. Error Boundary globale
11. ✅ Navigazione migliorata (sidebar) - COMPLETATO
12. ✅ Tabelle ottimizzate (paginazione, responsive, centratura) - COMPLETATO

### ✅ COMPLETATO RECENTEMENTE (Gennaio 2025)

#### 1. Tabelle Ottimizzate - COMPLETATO
**Implementato:**
- ✅ Paginazione lato client per liste grandi (Movimenti: 20/page, Tipi Movimento/Prodotto: 15/page)
- ✅ Responsive design: tabella desktop + card view mobile
- ✅ Proporzioni colonne ottimizzate (percentuali invece di pixel fissi)
- ✅ Centratura contenuto: tutte le celle centrate verticalmente e orizzontalmente
- ✅ Accessibilità: ARIA labels completi, sr-only text, aria-current per paginazione
- ✅ Performance: renderizza solo elementi visibili (paginazione)
- ✅ UX: paginazione visibile solo quando necessaria (length > pageSize)
- ✅ Standardizzazione proporzioni: larghezze coerenti tra tabelle correlate

**File modificati:**
- `src/components/ui/table.tsx` - Componente Table con centratura automatica
- `src/pages/Impostazioni.tsx` - Tutte le tabelle con paginazione, responsive e proporzioni standardizzate
- `src/pages/Movimenti.tsx` - Tabella movimenti con paginazione, responsive e proporzioni standardizzate
- `src/pages/Prodotti.tsx` - Tabella prodotti con paginazione, responsive e proporzioni standardizzate
- `src/pages/Clienti.tsx` - Tabella clienti con paginazione, responsive e proporzioni standardizzate

**Best Practice applicate:**
- Paginazione lato client (project-rules.md)
- Responsive design mobile-first
- Accessibilità WCAG 2.1 AA
- Performance: evitare renderizzare troppi elementi DOM

---

#### 2. Calcolo Stock e Saldi - COMPLETATO
**Implementato:**
- ✅ Hook `useStock.ts`: calcola stock per magazzino (totale o per prodotto)
- ✅ Hook `usePortfolioBalance.ts`: calcola saldi portafogli (balance, cash_balance, debt_balance)
- ✅ Logica corretta: bancomat tracciato ma non nel saldo, debiti gestiti separatamente
- ✅ Visualizzazioni in Impostazioni:
  - Tabella Magazzini: colonna "Stock" con quantità totale
  - Tabella Portafogli: colonna "Saldo" con saldo totale e debiti pendenti
  - Card view mobile: stock e saldi visibili anche su mobile
- ✅ Anteprima impatto nei form Movimenti:
  - Magazzini: mostra stock attuale → stock futuro con variazione
  - Portafogli: mostra saldo attuale → saldo futuro con variazione
  - Aggiornamento in tempo reale mentre si compila il form

**File creati:**
- `src/hooks/useStock.ts` - Hook per calcolo stock magazzini
- `src/hooks/usePortfolioBalance.ts` - Hook per calcolo saldi portafogli

**File modificati:**
- `src/pages/Impostazioni.tsx` - Aggiunte colonne Stock e Saldo con visualizzazioni
- `src/pages/Movimenti.tsx` - Aggiunta anteprima impatto con calcoli in tempo reale

**Best Practice applicate:**
- Stock e saldi calcolati dai movimenti (non memorizzati) - project-data-structure.md
- Logica bancomat corretta (tracciato ma non nel saldo)
- Debiti gestiti separatamente (solo pending nel debt_balance)
- Performance: calcoli ottimizzati con React Query cache

---

#### 3. Form Tipo Movimento Migliorato - COMPLETATO (Gennaio 2025)
**Implementato:**
- ✅ Riepilogo visivo in tempo reale: card che mostra configurazione mentre si compila il form
- ✅ Layout a due colonne: Magazzino e Portafoglio affiancati quando entrambi attivi (responsive)
- ✅ Rimozione campo "Direzione": calcolo automatico in base a "Da" e "A"
  - Solo "Da" → Uscita (out)
  - Solo "A" → Entrata (in)
  - Entrambi → Trasferimento (transfer)
- ✅ Sezioni con card distinti: ogni sezione (Magazzino/Portafoglio) in card separata con icone colorate
- ✅ Indicatori visivi: icone per direzioni (↓ Entrata verde, ↑ Uscita rossa, ↔ Trasferimento blu)
- ✅ Spiegazioni chiare: box informativa che spiega come funziona con esempi
- ✅ Risolto problema ambiguità: per movimenti tra entità (es. Ship) non serve più scegliere direzione manualmente

**Problema risolto:**
- Prima: ambiguità su "Entrata" vs "Uscita" per movimenti tra entità (es. Ship: per Driplug è uscita, per Meetdrip è entrata)
- Dopo: sistema calcola automaticamente in base a "Da Portafoglio" e "A Portafoglio"

**File modificati:**
- `src/pages/Impostazioni.tsx` - Form tipo movimento completamente riorganizzato con riepilogo, layout a due colonne, calcolo automatico direzione

**Best Practice applicate:**
- UX orientata all'utente: riepilogo sempre visibile, feedback immediato
- Riduzione carico cognitivo: spiegazioni chiare, calcolo automatico
- Responsive design: layout adattivo mobile/desktop
- Accessibilità: icone con ARIA labels, struttura semantica

---

### 🟢 Bassa Priorità (Nice to Have)

12. Visualizzazioni dati (grafici)
13. Ricerca globale
14. Virtualizzazione liste
15. Lazy loading route
16. Accessibilità avanzata

---

---

## 5. CHECKLIST PRE-IMPLEMENTAZIONE

Quando implemento una funzionalità, verificare:

### Funzionalità Core
- [ ] Ho letto `project-data-structure.md` per capire come DOVREBBE funzionare?
- [ ] Ho letto `project-goals.md` per capire contesto e priorità?
- [ ] La logica coinvolge calcoli? Come devono essere fatti? (verificare esempi qui sopra)

### Problemi Noti
- [ ] Questa funzionalità è nella lista problemi qui sopra?
- [ ] Ci sono discrepanze architetturali da considerare?
- [ ] C'è un problema simile già identificato?

### Best Practice
- [ ] Segue le best practice qui sopra?
- [ ] Performance ottimizzate? (paginazione, filtri su DB)
- [ ] Accessibilità base implementata?
- [ ] Gestione errori implementata?

### Pattern
- [ ] Segue pattern esistenti?
- [ ] React Query configurato correttamente?
- [ ] Type safety completo?
- [ ] Logging strutturato?

---

*Documento unificato - Gennaio 2025*

**Ultimo aggiornamento**: 15 Gennaio 2025 - Form Tipo Movimento migliorato

