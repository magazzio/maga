# Errori e Lezioni Apprese

Questo file documenta errori significativi e lezioni apprese durante lo sviluppo del progetto Magazz.io, per evitare di ripetere gli stessi errori in futuro.

---

## PROBLEMA PRINCIPALE (Gennaio 2025)

**Cosa è successo**: Abbiamo implementato funzionalità SENZA verificare prima i requisiti nella documentazione.

**Risultato**: Codice implementato che non corrispondeva ai requisiti, creando discrepanze e problemi.

**Costo**: Tempo perso, codice da rifare, frustrazione.

---

## Struttura delle voci

Per ogni errore/lezione:
- **Data**: quando è successo
- **Errore**: cosa è andato storto
- **Causa**: perché è successo
- **Soluzione**: come è stato risolto
- **Lezione**: cosa imparare per il futuro

---

## ERRORI SPECIFICI COMMESSI

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

### ERRORI CRITICI - Implementazione senza Verificare Requisiti (Gennaio 2025)

#### 10. ❌ Implementazione senza verificare requisiti
**Data**: Gennaio 2025
**Errore**: Iniziato a implementare funzionalità senza leggere `project-data-structure.md` che diceva esplicitamente:
- "La quantità è CALCOLATA dai movimenti, non memorizzata"
- "balance - Saldo (calcolato dai movimenti)"
- "cash_balance - Saldo cash (solo movimenti cash)"

**Causa**: Non abbiamo seguito il processo di verifica documentazione prima di implementare.

**Risultato**: Creato codice che non calcolava i saldi, solo leggeva dati raw.

**Soluzione**: Cancellato tutto il codice implementato e ricominciato da zero.

**Lezione**: 
- **SEMPRE** leggere `project-data-structure.md` COMPLETO prima di implementare
- Verificare come DOVREBBE funzionare secondo requisiti
- Se logica coinvolge calcoli, verificare come devono essere fatti
- Seguire FASE 1 del Processo 3 (Pre-Implementazione) OBBLIGATORIAMENTE

#### 11. ❌ Non verificare documentazione problemi noti
**Data**: Gennaio 2025
**Errore**: Non abbiamo letto i file di review che già identificavano problemi.

**Causa**: Non abbiamo verificato documentazione problemi noti prima di implementare.

**Risultato**: Ricreato problemi già documentati.

**Soluzione**: Ora verificare sempre documentazione problemi noti prima di implementare.

**Lezione**:
- **SEMPRE** leggere `.docs/project-review.md` prima di implementare
- Verificare se ci sono problemi già identificati per la funzionalità
- Evitare di ripetere errori già documentati

#### 12. ❌ Assumere invece di verificare
**Data**: Gennaio 2025
**Errore**: Abbiamo assunto come doveva funzionare invece di verificare nella documentazione.

**Esempio**: Abbiamo assunto che i saldi fossero memorizzati, invece la documentazione diceva "calcolati".

**Causa**: Non abbiamo verificato nella documentazione prima di assumere.

**Soluzione**: Verificare sempre nella documentazione prima di assumere.

**Lezione**:
- **MAI** assumere - SEMPRE verificare
- Se non sono sicuro: CHIEDERE prima di implementare
- Verificare sempre nella documentazione prima di assumere

#### 13. ❌ Non fare verifica finale contro requisiti
**Data**: Gennaio 2025
**Errore**: Dopo aver implementato, non abbiamo verificato se corrispondeva ai requisiti.

**Causa**: Non abbiamo fatto verifica finale confrontando con documentazione.

**Risultato**: Codice implementato che non funzionava come doveva.

**Soluzione**: Ora FASE 3 (Verifica Finale) è obbligatoria.

**Lezione**:
- **SEMPRE** fare verifica finale che confronta implementazione con requisiti
- Verificare che logica corrisponda a `project-data-structure.md`
- Verificare che funzionalità corrisponda a `project-goals.md`

#### 14. ❌ Non verificare file esistenti prima di riferirsi ad essi
**Data**: Gennaio 2025
**Errore**: Ho referenziato file di documentazione in `.cursorrules` senza verificare che esistessero o se c'erano duplicati.

**Causa**: Non ho verificato i file `.docs` prima di creare riferimenti a loro.

**Soluzione**: Verificare sempre file esistenti prima di referenziarli.

**Lezione**: Verificare sempre file e cartelle prima di referenziarli o modificare documentazione.

#### 15. ❌ Proporzioni tabelle sbagliate - ERRORE RIPETUTO
**Data**: Gennaio 2025
**Errore**: Ho creato proporzioni per la tabella Clienti che non sommano a 100% (79% + 120px invece di 100% totale).

**Causa**: 
- Non ho verificato come erano fatte le altre tabelle (Prodotti, Impostazioni) prima di creare quella di Clienti
- Non ho sommato correttamente le percentuali considerando i 120px fissi
- Ho fatto lo STESSO errore già fatto in passato per altre tabelle

**Risultato**: Tabella con proporzioni sbagliate, spazio non utilizzato, impaginazione non corretta.

**Soluzione**: 
- Verificare SEMPRE come sono fatte le altre tabelle esistenti prima di crearne una nuova
- Usare `calc()` per distribuire correttamente lo spazio residuo
- Sommare sempre le percentuali: devono essere 100% totali considerando i 120px fissi

**Lezione**: 
- **SEMPRE** verificare pattern esistenti prima di creare nuove tabelle
- **SEMPRE** sommare le percentuali per verificare che siano 100% totali
- **SEMPRE** usare `calc()` per colonne flessibili quando ci sono larghezze fisse (es. 120px per Azioni)
- **MAI** assumere le proporzioni - verificare sempre nelle tabelle esistenti

#### 16. ❌ Celle tabelle non centrate - ERRORE RIPETUTO
**Data**: Gennaio 2025
**Errore**: Ho creato celle nella tabella Clienti senza `text-center` e senza `justify-center` nei div flex, causando allineamento a sinistra invece che centrato.

**Causa**: 
- Non ho verificato come erano allineate le celle nelle altre tabelle
- Ho dimenticato di aggiungere `text-center` alle TableHead e TableCell
- Ho dimenticato `justify-center` nei div flex dentro le celle

**Risultato**: Celle non centrate, impaginazione inconsistente con le altre tabelle.

**Soluzione**: 
- Aggiungere `text-center` a tutte le TableHead e TableCell (tranne quelle che devono essere a destra)
- Aggiungere `justify-center` ai div flex dentro le celle per centrare il contenuto

**Lezione**: 
- **SEMPRE** verificare allineamento nelle tabelle esistenti prima di crearne una nuova
- **SEMPRE** aggiungere `text-center` alle celle che devono essere centrate
- **SEMPRE** aggiungere `justify-center` ai div flex dentro le celle per centrare il contenuto
- Verificare che tutte le tabelle abbiano lo stesso allineamento coerente

#### 17. ❌ Non leggere file errori prima di implementare
**Data**: Gennaio 2025
**Errore**: Ho commesso errori già documentati in `errors-and-lessons.md` perché non ho letto il file prima di implementare.

**Causa**: Non ho letto il file degli errori prima di iniziare a lavorare.

**Risultato**: Errori ripetuti, tempo perso, frustrazione.

**Soluzione**: 
- **SEMPRE** leggere `errors-and-lessons.md` PRIMA di iniziare qualsiasi implementazione
- **SEMPRE** verificare se ci sono errori simili già documentati
- **SEMPRE** aggiornare il file quando si commette un nuovo errore

**Lezione**: 
- **LEGGERE SEMPRE** `errors-and-lessons.md` prima di implementare
- Usare il file attivamente, non solo come riferimento passivo
- Verificare pattern problematici prima di ripeterli

#### 18. ❌ SelectItem con value vuoto in Radix UI Select
**Data**: Gennaio 2025
**Errore**: Ho aggiunto `<SelectItem value="">Nessuno</SelectItem>` causando errore perché Radix UI Select non permette `value=""` (stringa vuota).

**Causa**: 
- Non ho verificato i requisiti di Radix UI per i SelectItem
- Ho assunto che stringa vuota fosse valida come value

**Risultato**: Errore runtime: "A <Select.Item /> must have a value prop that is not an empty string"

**Soluzione**: 
- Cambiato `value=""` in `value="none"`
- Gestito valore speciale "none" nella logica `onValueChange` per convertirlo in `undefined`
- Usato `value={formData.field?.toString() || undefined}` per mostrare placeholder quando non c'è selezione

**Lezione**: 
- **SEMPRE** verificare requisiti delle librerie UI utilizzate
- Radix UI Select non permette stringa vuota come value
- Usare valore speciale (es. "none") e gestirlo nella logica per rappresentare "nessuna selezione"
- Verificare sempre documentazione libreria prima di assumere comportamento

---

## PROCESSO CORRETTO (da seguire SEMPRE)

1. **PRIMA** di implementare:
   - **LEGGERE `errors-and-lessons.md` COMPLETO** - verificare errori già commessi
   - Leggere `project-data-structure.md` COMPLETO per la funzionalità
   - Leggere `project-goals.md` per capire contesto
   - Verificare documentazione problemi noti
   - Verificare schema database attuale
   - **Verificare pattern esistenti** (es. come sono fatte le altre tabelle)
   - Capire come DOVREBBE funzionare secondo requisiti
   - Verificare checklist pre-implementazione

2. **DURANTE** implementazione:
   - Seguire pattern esistenti
   - Verificare errori dopo ogni file
   - Verificare che segua regole tecniche

3. **DOPO** implementazione:
   - Verifica finale contro requisiti
   - Verifica tecnica (errori, performance, best practice)
   - Se qualcosa non corrisponde: FERMARSI e avvisare

---

## REGOLA D'ORO

**Se non sono sicuro o ho dubbi: CHIEDERE prima di implementare**

Meglio chiedere e capire bene, che implementare sbagliato e dover rifare.

---

## Pattern da Evitare

### ❌ Creare tabelle senza verificare pattern esistenti
**Problema**: Creare nuove tabelle senza verificare come sono fatte le altre (proporzioni, allineamento).

**Come evitare**: 
- Sempre verificare almeno 2-3 tabelle esistenti prima di crearne una nuova
- Copiare le proporzioni e l'allineamento dalle tabelle esistenti
- Sommare sempre le percentuali per verificare che siano 100% totali

### ❌ Non centrare celle tabelle
**Problema**: Dimenticare `text-center` e `justify-center` nelle celle.

**Come evitare**:
- Sempre aggiungere `text-center` a TableHead e TableCell (tranne quelle a destra)
- Sempre aggiungere `justify-center` ai div flex dentro le celle
- Verificare allineamento nelle tabelle esistenti

---

## Pattern da Seguire

### ✅ Verificare pattern esistenti prima di creare nuove tabelle
**Pattern**: Prima di creare una nuova tabella, verificare come sono fatte le altre (proporzioni, allineamento, struttura).

**Come fare**:
1. Leggere almeno 2-3 tabelle esistenti (es. Prodotti, Impostazioni)
2. Notare le proporzioni usate (es. 9%, 13%, 22%, calc(20%-120px), 8%, 120px)
3. Notare l'allineamento (text-center, text-right)
4. Applicare lo stesso pattern alla nuova tabella
5. Verificare che le percentuali sommino a 100% considerando i 120px fissi

### ✅ Usare calc() per colonne flessibili
**Pattern**: Quando ci sono larghezze fisse (es. 120px per Azioni), usare `calc()` per distribuire lo spazio residuo.

**Esempio**: `w-[calc(20%-120px)]` per una colonna che deve occupare lo spazio residuo meno i 120px fissi.

### ✅ Centrare sempre le celle tabelle
**Pattern**: Aggiungere sempre `text-center` alle celle e `justify-center` ai div flex dentro le celle.

**Come fare**:
- TableHead: `text-center align-middle w-[X%]`
- TableCell: `text-center align-middle w-[X%]`
- Div flex dentro celle: `flex items-center justify-center gap-2`

---

---

## ⚠️ REGOLA CRITICA: LEGGERE QUESTO FILE SEMPRE

**PRIMA di iniziare QUALSIASI implementazione o modifica:**
1. **LEGGERE `errors-and-lessons.md` COMPLETO**
2. Verificare se ci sono errori simili già documentati
3. Verificare pattern da evitare e pattern da seguire
4. Usare questo file ATTIVAMENTE, non solo come riferimento passivo

**Questo file DEVE essere letto e usato SEMPRE, non solo quando si commette un errore.**

*Documento aggiornato - Gennaio 2025*

**Ultimo aggiornamento**: 15 Gennaio 2025 - Errore SelectItem value vuoto
