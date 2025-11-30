# Errori e Lezioni Apprese

Questo file documenta errori significativi e lezioni apprese durante lo sviluppo del progetto Magazz.io, per evitare di ripetere gli stessi errori in futuro.

---

## Struttura delle voci

Per ogni errore/lezione:
- **Data**: quando è successo
- **Errore**: cosa è andato storto
- **Causa**: perché è successo
- **Soluzione**: come è stato risolto
- **Lezione**: cosa imparare per il futuro

---

## Errori e Lezioni

### Analisi Progetto - Novembre 2025

#### 1. ProtectedRoute Ridondante ✅ RISOLTO
**Data**: Novembre 2025
**Errore**: `ProtectedRoute` era ridondante perché `App.tsx` controlla già `isAuthenticated` prima di renderizzare le route.

**Causa**: Doppio controllo autenticazione non necessario.

**Soluzione**: Rimosso `ProtectedRoute` dalle route in `App.tsx` e eliminato il componente.

**Lezione**: Verificare sempre se la logica esiste già prima di creare componenti.

#### 2. Icons PWA Mancanti ✅ RISOLTO
**Data**: Novembre 2025
**Errore**: Il manifest PWA faceva riferimento a icone (`pwa-192x192.png`, `pwa-512x512.png`) che non esistevano.

**Causa**: Non ho verificato che i file referenziati esistessero.

**Soluzione**: Rimosso i riferimenti alle icone mancanti dal manifest PWA.

**Lezione**: Verificare sempre che tutti i file referenziati esistano.

#### 3. Errori Commessi Durante Analisi
**Data**: Novembre 2025
**Errore**: Ho rimosso `ProtectedRoute` da `App.tsx` senza verificare se funzionava correttamente, causando problemi alla visualizzazione della pagina web.

**Causa**: Non ho testato le modifiche prima di applicarle.

**Soluzione**: Ripristinato il codice funzionante.

**Lezione**: Testare sempre prima di modificare.

#### 4. Creazione File Invece di Modifica
**Data**: Novembre 2025
**Errore**: Ho creato/sovrascritto `.errors-and-lessons.md` invece di verificare se esisteva già in `.docs/` e aggiungere al contenuto esistente.

**Causa**: Non ho verificato i file esistenti prima di scrivere.

**Soluzione**: Unificare i file e verificare sempre prima.

**Lezione**: Sempre verificare file esistenti prima di creare/modificare, controllare tutte le cartelle.

#### 5. Non Aver Seguito le Regole
**Data**: Novembre 2025
**Errore**: Ho modificato codice senza chiedere conferma e senza verificare bene i file nella cartella, violando le regole stabilite.

**Causa**: Non ho seguito le regole del progetto.

**Soluzione**: Rispettare sempre le regole: verificare prima, chiedere conferma, modificare solo quello richiesto.

**Lezione**: Rispettare sempre le regole stabilite.

#### 6. Struttura File Non Ottimale
**Data**: Novembre 2025
**Errore**: `.cursorrules` era in `.docs/.cursorrules` invece che nella root, e i file di progetto avevano punto iniziale (nascosti), rendendoli difficili da trovare.

**Causa**: Non ho verificato se la struttura era ottimale per il mio lavoro.

**Soluzione**: Spostato `.cursorrules` nella root e rinominato i file in `.docs` rimuovendo il punto iniziale.

**Lezione**: Verificare sempre se la struttura dei file è ottimale per il lavoro, non chiedere all'utente ma analizzare autonomamente.

#### 7. Import db Mancante in ClientDetailsContent
**Data**: Gennaio 2025
**Errore**: Il componente `ClientDetailsContent` in `Clienti.tsx` usava `db` senza importarlo, causando errore `db is not defined`.

**Causa**: Quando ho aggiunto l'import di `db` all'inizio del file, non ho verificato che fosse disponibile anche nel componente interno `ClientDetailsContent`.

**Soluzione**: Verificato che l'import di `db` fosse presente all'inizio del file (già presente alla riga 60).

**Lezione**: Verificare sempre che tutti gli import necessari siano presenti e accessibili ai componenti che li usano.

#### 8. SelectItem con Value Vuoto
**Data**: Gennaio 2025
**Errore**: In `Clienti.tsx` c'era un `<SelectItem value="">` che causava errore perché Radix UI non permette valori vuoti.

**Causa**: Non ho verificato i requisiti di Radix UI per i SelectItem.

**Soluzione**: Cambiato il value da `""` a `"none"` e aggiornato la logica per gestire questo valore speciale.

**Lezione**: Verificare sempre i requisiti delle librerie UI utilizzate, specialmente per componenti con validazioni specifiche.

#### 9. Non Aver Verificato Esistenza Cartelle
**Data**: Gennaio 2025
**Errore**: Ho affermato che la cartella `.docs` non esisteva, quando in realtà esiste e contiene tutti i file di documentazione.

**Causa**: Ho usato `glob_file_search` con un pattern errato che non ha trovato i file, ma non ho verificato direttamente con `list_dir`.

**Soluzione**: Verificato con `list_dir` che la cartella esiste.

**Lezione**: Non fare assunzioni basate su ricerche parziali. Verificare sempre direttamente l'esistenza di file e cartelle prima di affermare che non esistono.

---

## Pattern da Evitare

_(Pattern problematici identificati verranno aggiunti qui)_

---

## Pattern da Seguire

_(Pattern positivi identificati verranno aggiunti qui)_

