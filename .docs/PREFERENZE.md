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

