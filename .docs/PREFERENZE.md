# Le Tue Preferenze e Come Vuoi Che Operi

> Questo file contiene le TUE preferenze specifiche, il modo in cui VUOI che io lavori. 
> Lo leggo all'inizio di ogni sessione per ricordare come preferisci lavorare.
> 
> **Regola d'oro**: Se non c'è scritto qui, il codice esistente è la mia guida. Se trovo qualcosa che non va, chiedo.
> 
> **Regola fondamentale sui file**: Devo sempre scrivere e comporre i file come è meglio per me, ottimizzandoli per la mia lettura e utilizzo.

---

## ⚡ QUICK REFERENCE - Regole Fondamentali

### #KEYWORD: chiedi_sempre
**Regola**: Chiedo sempre prima - spiego il piano → aspetto OK → procedo

### #KEYWORD: modifiche_precise  
**Regola**: Modifico SOLO quello che chiedi, nient'altro

### #KEYWORD: coerenza_standard
**Regola**: Allineare con coerenza del progetto + Standard attuali del settore (2025)

### #KEYWORD: auto_amministrabile
**Regola**: App gestibile dall'interfaccia web, niente hardcoding quando possibile

### #KEYWORD: file_ottimizzati
**Regola**: Scrivo sempre i file come è meglio per me, ottimizzati per la mia lettura

### #KEYWORD: insegnare
**Regola**: Spiego sempre il "perché", non solo il "cosa"

### #KEYWORD: no_workaround
**Regola**: Quando ci sono problemi o ostacoli, mai workaround - solo fix veri e corretti

### #KEYWORD: variabili_complete
**Regola**: Quando discuto, propongo o decido, considero SEMPRE tutte le variabili del progetto

### #KEYWORD: sviluppo_gratuito
**Regola**: Solo tecnologie, servizi, hosting GRATUITI/open source - zero costi di sviluppo

### #KEYWORD: network_transfer
**Regola**: Minimizzare sempre il Network Transfer del database - paginazione, cache intelligente, no query ridondanti

### #KEYWORD: semplicita_professionale
**Regola**: Semplicità e intuitività NON devono limitare professionalità e modernità - design moderno + UX semplice

---

## Come Preferisci Che Io Operi

### Stile di Lavoro
- **Approccio**: Chiedo sempre prima - ti mostro cosa farò e aspetto conferma
- Prima di implementare → spiego il piano → aspetto OK → procedo

### Approccio allo Sviluppo

**Regola fondamentale**: Quando eseguo azioni sul codice, devo sempre allineare la richiesta con:
- ✅ **Coerenza al tema del progetto** - Mantenere coerenza con lo stile, architettura e scelte esistenti
- ✅ **Best practice 2025** - Applicare standard attuali del settore, pattern moderni, tecnologie e approcci aggiornati

**Cosa significa in pratica**:
- Verificare che le implementazioni siano coerenti con il resto del codice
- Applicare gli **standard attuali del settore** (non preferenze specifiche, ma best practice moderne)
- Proporre soluzioni allineate al contesto del progetto
- Non usare approcci obsoleti o non allineati
- Seguire le convenzioni moderne più comuni e accettate nel settore (2025)

### Comunicazione
- Ti spiego sempre il piano prima di procedere
- Chiaro su cosa modificherò e come
- Aspetto conferma prima di implementare
- **Spiego sempre il "perché"** - non solo il "cosa", ma anche il ragionamento dietro
- **Insegno durante il lavoro** - renderti autonomo nella gestione del progetto

## Preferenze Tecniche Specifiche

### Naming e Convezioni
_Quando scopriamo che preferisci camelCase, snake_case, etc. - lo mettiamo qui_

### Struttura Codice
_Se preferisci funzioni piccole, componenti grandi, etc._

### Error Handling
_Come preferisci gestire gli errori? Try-catch ovunque? Logging? etc._

## Cose Che NON Devi Fare

### ✅ Regola Fondamentale: Modifiche Precise e Mirate

**Regola fondamentale**: Quando chiedi una modifica precisa, devo modificare **SOLO** quello che hai chiesto, senza toccare altri dettagli non correlati.

**Cosa significa in pratica**:
- ✅ **Modifica solo ciò che è richiesto** - Se chiedi di cambiare il colore di un pulsante, cambio solo quello
- ✅ **Non "migliorare" cose non richieste** - Non refactorare codice non correlato
- ✅ **Non aggiungere feature extra** - Se chiedi di aggiungere X, non aggiungo anche Y perché "sarebbe utile"
- ✅ **Non correggere cose non menzionate** - Anche se vedo qualcosa da migliorare, non lo tocco se non è richiesto

**Esempio**:
- Tu: "Cambia il testo del pulsante da 'Salva' a 'Salva modifiche'"
- ✅ **Giusto**: Cambio solo il testo del pulsante
- ❌ **Sbagliato**: Cambio il testo + rinomino la funzione + aggiungo validazione + modifico lo stile

**Quando posso suggerire miglioramenti**:
- Se vedo qualcosa che potrebbe essere migliorato ma non è correlato, lo **menziono** ma **non lo modifico** senza la tua approvazione
- Posso dire "Ho notato che X potrebbe essere migliorato, vuoi che lo faccia?" ma non lo faccio automaticamente

**Eccezioni**:
- Solo se la modifica richiesta **richiede** necessariamente modificare altro codice per funzionare (es: aggiungere un campo richiede modificare il form, la validazione, e il database - tutto è correlato)

### ✅ Regola Fondamentale: NO Workaround - Solo Fix Veri

**Regola fondamentale**: Quando ci sono problemi o ostacoli, **MAI** fare workaround. Solo fix veri e corretti.

**Cosa significa in pratica**:
- ❌ **Workaround = SBAGLIATO**: Soluzioni temporanee, hack, soluzioni che aggirano il problema
- ✅ **Fix = GIUSTO**: Risolvere il problema alla radice, soluzione corretta e permanente

**Esempi**:
- ❌ **Workaround**: Se un componente non funziona, creare un wrapper che lo nasconde
- ✅ **Fix**: Capire perché il componente non funziona e risolvere il bug

- ❌ **Workaround**: Se un'API è lenta, aggiungere un timeout corto e gestire l'errore
- ✅ **Fix**: Ottimizzare l'API o trovare la causa della lentezza e risolverla

- ❌ **Workaround**: Se un bug si presenta, aggiungere un `if` speciale per gestirlo
- ✅ **Fix**: Trovare la causa root del bug e correggerla

**Principio**:
- Se c'è un problema, lo risolvo alla radice
- Se non so come risolverlo, lo studio e lo capisco prima di implementare
- Non accetto "funziona così" - deve funzionare correttamente

### ❌ Errori Ricorrenti da Evitare
_Quando facciamo errori, li documentiamo qui con esempi_

### ❌ Pattern Da Evitare
_Se provo qualcosa che non ti piace, lo metto qui_

## Come Preferisci Essere Coinvolto

### ✅ Preferenza: Chiedo Sempre Prima

**Regola principale**: Prima di fare qualsiasi modifica o implementazione, ti mostro cosa farò e aspetto la tua conferma.

**Processo**:
1. Tu chiedi qualcosa
2. Io ti spiego cosa farò (cosa modificherò, come lo farò, approccio)
   - **Specifico esattamente** cosa modificherò (solo quello richiesto)
   - **Non aggiungo** modifiche extra non richieste
3. Aspetto la tua conferma/feedback
4. Procedo dopo approvazione (modificando solo quanto specificato)

**Eccezioni** (se vuoi):
- Solo se esplicitamente mi dici "fai direttamente" o "procedi"
- Solo per correzioni minori di typo/sintassi ovvi (ma anche lì posso chiedere se preferisci)

## Note Importanti

### ✅ Obiettivo Fondamentale: Autonomia nella Gestione Contenuti

**Regola fondamentale**: L'applicazione deve essere **auto-amministrabile** direttamente dall'interfaccia web. Devi poter gestire tutti i contenuti/configurazioni dall'app, senza dover modificare il codice ogni volta.

**Cosa significa in pratica**:
- **Admin Panel integrato** - Interfaccia per gestire contenuti direttamente dall'app
- **Database-driven** - Tutti i contenuti configurabili (categorie, prodotti, etc.) devono essere nel database, non hardcoded
- **CRUD completo** - Per ogni entità gestibile, crea interfaccia per Create, Read, Update, Delete
- **Niente hardcoding** - Evitare valori/configurazioni hardcoded quando possono essere gestiti dall'app
- **Gestione autonoma** - Es: se ci sono categorie di prodotti, devi poter aggiungere/modificare/eliminare categorie dall'app, non chiedendo modifiche al codice

**Esempio concreto**:
- ❌ **Sbagliato**: Categorie hardcoded come array nel codice
- ✅ **Giusto**: Tabella database "categorie" + interfaccia admin per gestirle dall'app

**Per ogni entità/feature**, mi chiedo sempre:
- "Può essere gestita dall'utente dall'app?" → Se sì, creo interfaccia admin
- "Serve modificare il codice per aggiungere/modificare questo?" → Se sì, probabilmente va gestito dall'app

**L'obiettivo è**: Gestire tutto il possibile direttamente dalla web app, non dal codice.

### Autonomia nella Comprensione

**Inoltre**, durante lo sviluppo:
- **Spiegare sempre** cosa faccio e perché
- **Insegnare durante il lavoro** - far capire l'architettura e le decisioni
- **Documentare chiaramente** - codice che si spiega da solo
- **Rispondere a domande** - spiegare sempre quando chiedi

### Standard di Qualità

Quando implemento codice, devo sempre:
- ✅ Allineare con il tema/coerenza del progetto
- ✅ Applicare **standard attuali del settore** (best practice 2025)
- ✅ Verificare coerenza con codice esistente
- ✅ Usare approcci moderni e aggiornati seguendo le convenzioni comuni del settore
- ✅ **Spiegare e insegnare** - renderti autonomo, non dipendente

### ✅ Principio Fondamentale: Semplicità + Professionalità

**Principio**: Semplicità e intuitività NON devono limitare professionalità e modernità visiva.

**Cosa significa**:
- **Design/Vista**: Moderno, professionale, esteticamente curato, al passo con tendenze 2025
- **Componenti**: Moderni, professionali, di alta qualità, UI/UX best practices
- **Usabilità**: Semplice, intuitiva, accessibile, senza complessità inutile
- **Equilibrio**: Design moderno e professionale che rimane facile da usare

**Esempi**:
- ❌ **Sbagliato**: Interfaccia "spartana" o poco curata in nome della semplicità
- ✅ **Giusto**: Interfaccia moderna e professionale (come app enterprise) ma semplice da usare (come app consumer)
- ❌ **Sbagliato**: Componenti base o poco raffinati
- ✅ **Giusto**: Componenti moderni e professionali con UX semplice e chiara

**Quando propongo soluzioni UI/UX**:
- Design moderno e professionale (stile 2025, best practices)
- Componenti di qualità, ben rifiniti
- Ma funzionalità semplici e intuitive
- Non complicare l'uso per rendere "più professionale"
- Professionalità visiva + semplicità d'uso = obiettivo

### ✅ Regola Fondamentale: Considerazione Completa delle Variabili

**Regola fondamentale**: Quando discuto, propongo soluzioni o prendiamo decisioni, devo **SEMPRE** considerare tutte le variabili del progetto.

**Variabili da Analizzare Sempre**:
- ✅ **Impatto funzionale** - Come influisce su altre funzionalità esistenti?
- ✅ **Impatto tecnico** - Implicazioni architetturali, performance, sicurezza?
- ✅ **Scalabilità** - Funzionerà con crescita utenti/dati?
- ✅ **Manutenibilità** - Quanto sarà facile mantenere nel tempo?
- ✅ **Usabilità** - Come impatta l'esperienza utente?
- ✅ **Compatibilità** - Funziona con dispositivi/ambienti target?
- ✅ **Costi/Tempi** - Quanto costa in termini di sviluppo/tempo?
- ✅ **Rischio** - Quali sono i rischi potenziali?
- ✅ **Dipendenze** - Cosa dipende da questa decisione? Cosa ne dipende?
- ✅ **Requisiti** - Soddisfa tutti i requisiti del progetto?
- ✅ **Coerenza** - È coerente con le decisioni già prese?
- ✅ **Futuro** - Come impatta sviluppi futuri?

**Approccio Metodico**:
- Prima di proporre: analizzo tutte le variabili sopra
- Quando discuto: considero implicazioni multiple
- Quando decidiamo: valuto pro/contro da tutte le angolazioni
- Documento le variabili considerate nelle decisioni importanti

**Esempio**:
- ❌ **Sbagliato**: Proporre una soluzione senza considerare scalabilità o manutenibilità
- ✅ **Giusto**: Analizzare la soluzione considerando tutte le variabili: performance, sicurezza, scalabilità, manutenibilità, usabilità, costi, etc.

### ✅ Regola Fondamentale: Ottimizzazione Network Transfer Database

**Regola fondamentale**: Ogni funzionalità che accede al database deve minimizzare il Network Transfer. La funzionalità richiesta deve sempre essere realizzata, ma le modalità devono impattare nella misura minima possibile sul Network Transfer del database.

**Principi base**:
- **Nessun workaround sporco** - Solo fix strutturali intelligenti
- **Minimizzare dati trasferiti** - Query ottimizzate, solo dati necessari
- **Evitare query ridondanti** - Cache intelligente, no duplicazioni
- **Evitare polling aggressivo** - Invalidation mirata invece di refetch continui

**Regole tecniche specifiche**:

1. **Paginazione obbligatoria per liste grandi**
   - Backend: endpoint con `page` e `pageSize`, query SQL con `LIMIT/OFFSET`
   - Frontend: React Query con chiavi che includono `page/pageSize`
   - Mai caricare "tutto in una volta" per liste potenzialmente lunghe

2. **React Query configurato correttamente**
   - `staleTime: 60000` (60s) di default
   - `refetchOnWindowFocus: false` per liste grandi
   - `gcTime: 5 * 60 * 1000` (5 minuti)
   - Mai `staleTime: 0` per liste grandi

3. **Startup data ottimizzati**
   - Solo dati globali e poco variabili
   - `staleTime` minimo 2 minuti (120000ms)
   - Non aggiungere dati specifici di sezione allo startup

4. **Paginazione vs Infinite Scroll**
   - Preferire sempre `page/pageSize` per gestionale
   - Evitare `useInfiniteQuery` che accumula in memoria
   - Se necessario infinite scroll: page size piccola + hard limit

5. **Filtri lato server**
   - Mai filtrare su client dataset enormi
   - Filtri come query param al backend
   - Backend applica filtri e restituisce solo pagina filtrata

6. **Evitare refetch inutili**
   - Dopo mutation: `invalidateQueries` mirato invece di refetch globale
   - Pulsante manuale "Aggiorna" per refetch esplicito
   - No polling se non strettamente necessario

**Checklist per nuove funzionalità**:
- È una lista potenzialmente lunga? → Paginazione server-side obbligatoria
- Quanto spesso cambiano i dati? → `staleTime` appropriato
- Chi deve vedere cambiamenti? → Invalidation mirata o update locale
- Volume atteso? → Pensare a paginazione/filtri fin dall'inizio

**Cosa NON fare mai**:
- ❌ `staleTime: 0` su liste grandi
- ❌ `refetchOnWindowFocus: true` su query pesanti
- ❌ Query che scaricano tutti i record senza necessità
- ❌ Polling ogni pochi secondi per dati non critici
- ❌ Filtrare in memoria dataset enormi già scaricati

### ✅ Regola Fondamentale: Sviluppo Gratuito

**Regola fondamentale**: Lo sviluppo dell'app deve utilizzare SOLO tecnologie, servizi e strumenti gratuiti/open source. Zero costi di sviluppo.

**Cosa significa**:
- **Stack tecnologico**: Solo tecnologie open source/gratuite
- **Hosting**: Servizi gratuiti o con tier gratuito generoso
- **Database**: Solo soluzioni gratuite/open source (es. Neon con tier gratuito)
- **Servizi esterni**: Solo se gratuiti o con tier gratuito
- **Strumenti sviluppo**: Solo tool gratuiti/open source
- **Integrazioni**: Solo se gratuite o low-cost

**Quando propongo soluzioni**:
- Verifico sempre che siano gratuite
- Se un servizio è a pagamento, cerco alternative gratuite
- Priorità a soluzioni open source
- Considero limiti di servizi gratuiti ma trovo soluzioni creative
- **Importante**: Con database gratuito (Neon), il Network Transfer è limitato → ottimizzare sempre

### ✅ Regola Fondamentale: Ottimizzazione File

**Regola fondamentale**: Devo sempre scrivere e comporre i file come è meglio per me, ottimizzandoli per la mia lettura e utilizzo.

**Cosa significa**:
- Strutturare i file per essere facilmente scannabili e leggibili
- Usare keyword e sezioni chiare per ricerca rapida
- Organizzare le informazioni in modo logico e accessibile
- Rimuovere template/esempi non necessari
- Ottimizzare per facilità di parsing e comprensione

_Qualsiasi altra cosa specifica che vuoi che io ricordi sempre_

---

> **Come funziona**: 
> - Ogni volta che scopriamo una preferenza, la aggiungiamo qui
> - All'inizio di ogni sessione, controllo questo file
> - Se qualcosa non è chiaro, chiedo invece di indovinare

