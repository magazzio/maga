# Funzionalità Essenziali Magazz.io

> Definizione delle funzionalità essenziali per Magazz.io, filtrate dalle 7 priorità assolute e dal principio di semplicità + professionalità.

**Data definizione**: 2024-12-19  
**Metodologia**: Analisi funzionalità standard → Filtro con priorità → Definizione essenziali

---

## 🎯 Metodologia di Selezione

Le funzionalità sono state selezionate considerando:

1. **7 Priorità Assolute**:
   - Semplice e Intuitivo (design moderno + UX semplice)
   - Integrazione Nativa Magazzino-Cassa
   - Supporto Italiano
   - Scalabile ma Semplice
   - Affidabilità e Precisione Tecnica
   - Adattabilità e Personalizzazione
   - Reportistica Semplice e Utile

2. **Principio Design**: Moderno e professionale MA semplice da usare

3. **Target**: Utenti privati e PMI italiane
   - **Distinzione**: Funzionalità condizionali per privato vs azienda
   - **Approccio**: Stessa app, interfaccia adattiva

4. **Vincoli**: Sviluppo gratuito, ottimizzazione Network Transfer

**Nota**: Vedi `.docs/ANALISI_PRIVATO_VS_AZIENDA.md` per distinzione completa funzionalità privato/azienda

---

## 📦 FUNZIONALITÀ ESSENZIALI - MAGAZZINO

### ✅ 1. Gestione Anagrafica Prodotti (ESSENZIALE)

**Priorità che supporta**: 1 (Semplice), 5 (Affidabilità), 6 (Adattabilità)

**Funzionalità essenziali**:
- Database prodotti con campi base:
  - Codice prodotto (SKU)
  - Nome/Descrizione
  - Categoria (gestibile dall'app - auto-amministrabile)
  - Prezzo di vendita
  - Prezzo di acquisto
  - Unità di misura
  - Fornitore principale
- **Gestione categorie dall'app** (non hardcoded) - Priorità 6
- Foto/immagini prodotti (opzionale ma moderno)
- Codice a barre (opzionale, utile per PMI)

**Semplificazioni**:
- ❌ Attributi complessi (varianti, dimensioni multiple) → MVP base
- ❌ Gestione multi-fornitore complessa → Fornitore principale
- ✅ Categorie configurabili dall'app → Auto-amministrabile

**Design**: Form semplice ma moderno, validazioni chiare, gestione categorie intuitiva

---

### ✅ 1.1. Multi-Listino Configurabile (ESSENZIALE - Funzionalità Differenziante)

**Priorità che supporta**: 6 (Adattabilità), 1 (Semplice)

**Problema risolto**: Listini fissi, no flessibilità per cliente/tipo vendita

**Funzionalità essenziali**:
- **Listini multipli configurabili** (es: "Privati", "B2B", "Amici", "Promozioni")
- **Prezzi per listino/cliente**: Stesso prodotto, prezzi diversi
- **Regole automatiche di assegnazione**: Listino predefinito per cliente/tipo
- **Gestione listini dall'app** (auto-amministrabile)

**Semplificazioni**:
- ✅ Listini configurabili dall'app
- ✅ Prezzi per listino semplici
- ⚠️ **Privato**: 1 listino base (semplicità)
- ✅ **Azienda**: Multi-listino completo

**Design**: Gestione listini intuitiva, selezione listino chiara nelle vendite, prezzi evidenti

**Nota**: Funzionalità condizionale - Privato vede 1 listino, Azienda può crearne multipli

---

### ✅ 2. Gestione Inventario/Scorte (ESSENZIALE)

**Priorità che supporta**: 2 (Integrazione), 5 (Affidabilità), 7 (Reportistica)

**Funzionalità essenziali**:
- **Giacenze in tempo reale** (sincronizzate con movimenti)
- **Scorte minime** con notifiche/alert semplici
- **Disponibilità calcolata** (giacenza - riservato)
- **Valutazione magazzino** (metodo semplice: media ponderata o FIFO base)

**Semplificazioni**:
- ❌ Scorte massime complesse → Solo minime per MVP
- ❌ Previsione esaurimento avanzata → Solo alert scorte minime
- ❌ Analisi rotazione complessa → Report semplice rotazione

**Integrazione**: Già collegato a movimentazioni e vendite/acquisti

**🎯 FUNZIONALITÀ DIFFERENZIANTE: Inventario Smart con Mobile**

**Problema risolto**: Inventario fisico complesso e lento, errori di conteggio

**Funzionalità essenziali**:
- **Conta fisica con tablet/mobile** (mobile-friendly, PWA)
- **Scanner barcode integrato** per conteggio rapido
- **Riconciliazione automatica differenze**: Confronto giacenza teorica vs fisica
- **Gestione differenze**: Correzione automatica o manuale guidata

**Semplificazioni**:
- ✅ Interfaccia touch ottimizzata per mobile
- ✅ Scanner camera (mobile) o USB/Bluetooth (desktop)
- ✅ Riconciliazione guidata semplice
- ❌ Ottimizzazione percorsi inventario → Opzionale avanzato

**Priorità che supporta**: 1 (Semplice), 5 (Affidabilità)

**Design**: Interfaccia mobile-first per inventario, scanner integrato, riconciliazione guidata

---

### ✅ 2.1. Marginalità in Tempo Reale (ESSENZIALE - Funzionalità Differenziante)

**Priorità che supporta**: 2 (Integrazione), 5 (Affidabilità), 7 (Reportistica)

**Problema risolto**: Non si sa il profitto reale di una vendita (costo acquisto vs prezzo vendita)

**Funzionalità essenziali**:
- **Calcolo automatico profitto netto**: Prezzo vendita - Costo acquisto (esclusa IVA)
- **Visualizzazione istantanea margini** per ogni vendita
- **Margine in tempo reale**: Aggiornamento automatico ad ogni movimento
- **Esclusione IVA nel calcolo profitto**: Solo margine netto reale
- **Vista unificata**: Magazzino + Portafogli insieme con marginalità

**Integrazione**:
- Calcolo automatico quando: Carico prodotto → Registra costo, Vendita → Calcola margine
- Visualizzazione in dashboard, ordini, report

**Design**: Indicatori margine visibili ovunque, calcolo automatico trasparente, report marginalità chiari

**Nota**: Game-changer - Utente vede sempre se sta guadagnando o perdendo su ogni vendita

---

### ✅ 3. Movimentazioni Magazzino (ESSENZIALE)

**Priorità che supporta**: 2 (Integrazione), 5 (Affidabilità), 1 (Semplice), 6 (Adattabilità)

**Funzionalità essenziali**:
- **Carico merce** (entrate):
  - Selezione magazzino di destinazione
  - Collegato ad acquisti (con selezione magazzino)
  - Carico manuale diretto
- **Scarico merce** (uscite):
  - Selezione magazzino di origine
  - Collegato a vendite (con selezione magazzino)
  - Scarico manuale diretto
- **Trasferimenti tra magazzini** (movimentazioni interne)
- **Rettifiche inventario** (correzioni manuali) - con selezione magazzino
- **Tracciabilità base** (chi, cosa, quando, quale magazzino) - Priorità 5

**🎯 FUNZIONALITÀ DIFFERENZIANTE: Gestione Reso Automatizzata**

**Problema risolto**: Processo reso complesso e manuale, errori frequenti

**Funzionalità essenziali**:
- **Flusso completo automatizzato**:
  1. Rientro merce in magazzino (carico automatico)
  2. Generazione nota credito automatica
  3. Storno pagamento o creazione buono credito
  4. Tracciabilità completa
- **Riconciliazione automatica**: Collegamento reso → nota credito → storno
- **Portafoglio gestito automaticamente**: Rimborso o buono credito

**Semplificazioni**:
- ✅ Flusso guidato semplice (wizard reso)
- ✅ Automazione completa dove possibile
- ✅ Tracciabilità garantita
- ❌ RMA complessi → Flusso base automatizzato

**Priorità che supporta**: 1 (Semplice), 2 (Integrazione), 5 (Affidabilità)

**Design**: Wizard reso guidato, conferme chiare, automazione trasparente

**Nota**: Integrazione nativa - Reso collegato a magazzino, documento e portafoglio automaticamente

**Semplificazioni**:
- ❌ Resi complessi (RMA) → MVP base: rettifica inventario → **Migliorato con reso automatizzato**
- ❌ Storni complessi → Rettifica con note → **Migliorato con flusso automatizzato**
- ✅ Tracciabilità essenziale → Audit log base

**Integrazione Nativa**:
- Vendita → Scarico automatico + Incasso cassa
- Acquisto → Carico automatico + Pagamento cassa

**Design**: Form semplice per movimentazioni, storico chiaro, integrazione trasparente

---

### ⚠️ 4. Gestione Lotti e Scadenze (OPZIONALE MVP)

**Priorità che supporta**: 5 (Affidabilità), 6 (Adattabilità)

**Decisione**: **OPZIONALE per MVP**, da valutare se necessario

**Se incluso (semplificato)**:
- Date di scadenza prodotti
- Allarmi scadenze prossime
- Metodo FEFO base (First Expired, First Out)

**Semplificazioni**:
- ❌ Gestione lotti complessa → Solo scadenze
- ❌ Numeri di serie → Opzionale avanzato

**Nota**: Utile per PMI alimentari/farmaceutiche, meno per altri settori

---

### ✅ 5. Gestione Multi-Magazzino (ESSENZIALE)

**Priorità che supporta**: 6 (Adattabilità), 4 (Scalabile), 1 (Auto-amministrabile)

**Decisione**: **ESSENZIALE** - Utenti possono creare e gestire più magazzini dall'app

**Funzionalità essenziali**:
- **Creazione magazzini dall'app** (auto-amministrabile, non hardcoded)
- **Gestione multi-magazzino**:
  - Nome magazzino
  - Indirizzo/ubicazione (opzionale)
  - Magazzino principale/default
- **Trasferimenti tra magazzini** (movimentazioni interne)
- **Giacenze per magazzino** (visione unificata o per magazzino)
- **Selezione magazzino** nelle operazioni (carico/scarico)

**Semplificazioni**:
- ❌ Mappatura dettagliata (corridoi, scaffali) → Solo magazzini base
- ❌ Ottimizzazione percorsi → Opzionale avanzato
- ✅ Gestione semplice → Creazione/configurazione dall'interfaccia

**Interfaccia Adattiva** (vedi ADR-006):
- Se 1 magazzino → Interfaccia semplificata (NO selezione, tutto va lì)
- Se 2-3 magazzini → Interfaccia media (selezione semplice)
- Se 5+ magazzini → Interfaccia completa (tutte le funzionalità)
- **Utilizzo tipico**: Privato 1-2 magazzini, Azienda 5-10+ magazzini

**Design**: Gestione magazzini semplice, selezione chiara nelle operazioni, visione unificata o separata

**Nota**: Utente può avere anche un solo magazzino, ma può crearne altri quando serve (scalabile ma semplice)

---

### ✅ 6. Gestione Ordini (ESSENZIALE)

**Priorità che supporta**: 2 (Integrazione), 1 (Semplice), 5 (Affidabilità)

**Funzionalità essenziali**:
- **Ordini di vendita** (a clienti)
  - Selezione magazzino di scarico
  - Selezione portafoglio di incasso
  - Collegati a scarico magazzino + incasso portafoglio
- **Ordini di acquisto** (da fornitori)
  - Selezione magazzino di carico
  - Selezione portafoglio di pagamento
  - Collegati a carico magazzino + pagamento portafoglio
- **Stati ordini semplici**: Bozza, Confermato, Evaso, Annullato
- **Tracking base**: Visualizzazione stato ordine

**Semplificazioni**:
- ❌ Integrazione e-commerce complessa → Opzionale avanzato
- ❌ Workflow complessi → Stati semplici e chiari
- ✅ Integrazione nativa con magazzino-portafoglio → Priorità 2
- ✅ Selezione magazzino e portafoglio nelle operazioni

**🎯 FUNZIONALITÀ DIFFERENZIANTE: Visualizzazione Kanban per Ordini**

**Problema risolto**: Liste infinite difficili da gestire, difficile vedere stato ordini

**Funzionalità essenziali**:
- **Vista Kanban per ordini**: Colonne per stato (Bozza, Confermato, In Preparazione, Spedito)
- **Trascinare ordini tra stati**: Drag & drop intuitivo
- **Vista alternativa alle liste**: Switch tra lista e Kanban
- **Filtri per magazzino/cliente**: Kanban filtrabile

**Semplificazioni**:
- ✅ Vista Kanban semplice ma efficace
- ✅ Drag & drop nativo (no librerie complesse)
- ✅ Switch vista lista/Kanban
- ❌ Workflow complessi → Stati semplici

**Priorità che supporta**: 1 (Semplice)

**Design**: Kanban moderno e professionale, trascinamento fluido, stati chiari

**Nota**: Vista alternativa - Utente può scegliere lista o Kanban in base a preferenza

**Design**: Lista ordini chiara, form semplice, stati visibili, integrazione automatica trasparente, vista Kanban disponibile

---

### ⚠️ 7. Picking e Spedizioni (OPZIONALE MVP)

**Priorità che supporta**: 1 (Semplice), 5 (Affidabilità)

**Decisione**: **OPZIONALE per MVP**, da valutare se necessario

**Se incluso (semplificato)**:
- Liste picking semplici (non ottimizzate)
- Gestione spedizioni base
- Generazione etichette base

**Semplificazioni**:
- ❌ Ottimizzazione percorsi → Opzionale avanzato
- ❌ Integrazione corrieri complessa → Opzionale avanzato

**Nota**: Utile per PMI con molte spedizioni, meno per vendita diretta locale

---

### ✅ 8. Anagrafiche Clienti e Fornitori (ESSENZIALE)

**Priorità che supporta**: 1 (Semplice), 2 (Integrazione), 6 (Adattabilità)

**Funzionalità essenziali**:
- **Database clienti**:
  - Dati anagrafici base (nome, contatti, indirizzo)
  - Storico vendite collegato
  - Condizioni commerciali base (sconti, pagamento)
- **Database fornitori**:
  - Dati anagrafici base
  - Storico acquisti collegato
  - Condizioni commerciali base

**Semplificazioni**:
- ❌ Classificazioni complesse → Base
- ❌ Segmentazioni avanzate → Opzionale avanzato
- ✅ Storico collegato → Integrazione nativa

**Design**: Form semplice, lista chiara, storico accessibile, collegamenti evidenti

---

### ✅ 9. Gestione Documenti (ESSENZIALE - Requisiti Italiani)

**Priorità che supporta**: 3 (Supporto Italiano), 1 (Semplice), 5 (Affidabilità)

**Funzionalità essenziali**:
- **DDT (Documenti di Trasporto)** - Formato italiano
- **Fatture** - Formato italiano
- **Note di credito/debito** - Formato italiano
- **Ricevute** - Formato italiano
- **Stampa documenti** - Template italiani

**Requisiti Italiani**:
- ⚠️ **Fatturazione elettronica**: Da valutare se necessaria per MVP
  - Obbligatoria per B2B in Italia
  - Opzionale per B2C
  - Integrazione complessa → Valutare se MVP o post-MVP

**Semplificazioni**:
- ✅ Formati italiani standard
- ✅ Template semplici ma professionali
- ❌ Gestione documenti complessa → Base ma conforme

**Design**: Template documenti professionali, form semplice, stampa chiara

---

### ✅ 10. Dashboard "Buongiorno" Azionabile (ESSENZIALE)

**Priorità che supporta**: 7 (Reportistica Semplice), 1 (Semplice), 2 (Integrazione)

**Funzionalità essenziali**:
- **Dashboard principale personalizzata**:
  - Soldi in cassa oggi (subito visibile)
  - Cosa devo spedire entro oggi/12:00
  - Quali prodotti stanno finendo (alert visibili)
  - Chi mi deve pagare (crediti scaduti)
  - Giacenze principali
  - Movimenti recenti
  - Entrate/uscite recenti
- **Dashboard azionabile** (non solo visualizzazione):
  - Alert clickabili che portano all'azione
  - Link diretti alle operazioni necessarie
  - Widget con azioni immediate (Ordina Ora, Vai a Picking, Sollecita)

**Design**: Dashboard moderna e professionale, informazioni critiche subito visibili, azioni dirette

---

### ✅ 11. Reportistica Essenziale (ESSENZIALE)

**Priorità che supporta**: 7 (Reportistica Semplice), 1 (Semplice), 2 (Integrazione)

**Funzionalità essenziali**:
- **Dashboard principale** (vista dettagliata):
  - Giacenze principali
  - Movimenti recenti
  - Entrate/uscite recenti
  - Alert scorte minime
- **Report vendite**:
  - Vendite per periodo
  - Vendite per cliente
  - Prodotti più venduti
- **Report acquisti**:
  - Acquisti per periodo
  - Acquisti per fornitore
- **Report magazzino**:
  - Valore magazzino
  - Rotazione prodotti base
  - Prodotti in esaurimento
- **Report finanziari**:
  - Entrate/uscite
  - Margini base
  - Flussi di cassa

**Semplificazioni**:
- ❌ Dashboard complesse personalizzabili → Dashboard semplice ma completa
- ❌ Report avanzati complessi → Report essenziali ma utili
- ❌ KPI complessi → Indicatori base chiari
- ✅ Export dati → CSV/Excel base → **Migliorato con Export Excel Universale**

**🎯 FUNZIONALITÀ DIFFERENZIANTE: Export Excel Universale**

**Problema risolto**: Commercialisti italiani vivono di Excel, export complicati o inutili

**Funzionalità essenziali**:
- **"Esporta tutto in Excel"** su ogni tabella/lista
- **Formato pulito e utilizzabile**: Pronto per analisi, non solo dump dati
- **Export configurabile**: Colonne selezionabili, formattazione corretta
- **Formati italiani**: Decimali, date, valute conformi
- **Export per commercialista**: Formati specifici per contabilità italiana

**Semplificazioni**:
- ✅ Export semplice (1 click)
- ✅ Formato pulito e professionale
- ✅ Configurabile ma con default intelligenti
- ❌ Export complessi personalizzati → Base ma utilissimo

**Priorità che supporta**: 3 (Supporto Italiano), 7 (Reportistica), 1 (Semplice)

**Design**: Pulsante export visibile, formato Excel pulito, configurazione semplice

**Nota**: Fondamentale per mercato italiano - ogni tabella esportabile in Excel

**Design**: Dashboard moderna e professionale, report chiari, visualizzazioni semplici ma efficaci, export Excel universale

---

## 💰 FUNZIONALITÀ ESSENZIALI - CASSA/FLUSSI FINANZIARI

### ✅ 1. Registrazione Pagamenti (ESSENZIALE)

**Priorità che supporta**: 2 (Integrazione), 1 (Semplice), 5 (Affidabilità)

**Funzionalità essenziali**:
- **Incassi** (entrate):
  - Selezione portafoglio di incasso
  - Collegati automaticamente a vendite (con selezione portafoglio)
  - Registrazione manuale incassi extra (con selezione portafoglio)
  - Metodi pagamento: Contanti, Bancomat, Carta, Bonifico
- **Pagamenti** (uscite):
  - Selezione portafoglio di pagamento
  - Collegati automaticamente ad acquisti (con selezione portafoglio)
  - Registrazione manuale pagamenti extra (con selezione portafoglio)
  - Metodi pagamento: Contanti, Bonifico, Assegno
- **Trasferimenti tra portafogli**: Spostamento fondi
- **Riconciliazione base**: Collegamento pagamenti/incassi a documenti

**Integrazione Nativa**:
- Vendita → Incasso automatico registrato nel portafoglio selezionato
- Acquisto → Pagamento automatico registrato dal portafoglio selezionato

**Design**: Form semplice, metodi pagamento chiari, integrazione automatica trasparente

---

### ✅ 2. Gestione Multi-Portafoglio/Cassa (ESSENZIALE)

**Priorità che supporta**: 6 (Adattabilità), 4 (Scalabile), 1 (Auto-amministrabile), 3 (Supporto Italiano)

**Clarificazione**: Per "cassa" si intende **portafogli/conti finanziari** (es: Conto Corrente, Contanti, Conto Deposito), NON la cassa fisica del supermercato.

**Decisione**: **ESSENZIALE** - Utenti possono creare e gestire più portafogli/conti dall'app

**Funzionalità essenziali**:
- **Creazione portafogli dall'app** (auto-amministrabile):
  - Nome portafoglio (es: "Conto Corrente", "Contanti", "Conto Deposito")
  - Tipo portafoglio (opzionale: Conto corrente, Contanti, Deposito, etc.)
  - Portafoglio principale/default
- **Gestione multi-portafoglio**:
  - Saldi per portafoglio
  - Movimenti per portafoglio
  - Visione unificata o per portafoglio
- **Selezione portafoglio** nelle operazioni (incassi/pagamenti)
- **Trasferimenti tra portafogli** (spostamento fondi)

**🎯 FUNZIONALITÀ DIFFERENZIANTE: Gestione IVA Automatica**

**Scorporo IVA automatico nei portafogli** (game-changer per PMI):
- **Portafoglio "Netto Spendibile"**: Importi senza IVA (disponibile per spese)
- **Portafoglio "IVA da Versare"**: IVA accantonata automaticamente
- **Calcolo automatico**: Se incasso 122€ → "Netto" 100€, "IVA" 22€
- **Prevenzione errori**: Piccole imprese non spendono IVA per sbaglio

**Priorità che supporta**: 
- Priorità 3 (Supporto Italiano): Conformità IVA italiana
- Priorità 2 (Integrazione): Integrazione automatica
- Priorità 5 (Affidabilità): Prevenzione errori

**Apertura/chiusura giornaliera** (se applicabile):
- Per portafogli "contanti" → Apertura/chiusura giornaliera
- Per conti correnti → Riconciliazione periodica

**Semplificazioni**:
- ✅ Gestione semplice → Creazione/configurazione dall'interfaccia
- ✅ Trasferimenti tra portafogli → Operazione semplice
- ❌ Contabilità complessa → Solo gestione portafogli base

**Design**: Gestione portafogli semplice, selezione chiara nelle operazioni, visione unificata o separata, trasferimenti intuitivi

**Nota**: Utente può avere anche un solo portafoglio, ma può crearne altri quando serve (scalabile ma semplice)

---

### ⚠️ 3. Fatturazione (ESSENZIALE - Con Riserva)

**Priorità che supporta**: 3 (Supporto Italiano), 2 (Integrazione), 1 (Semplice)

**Funzionalità essenziali**:
- **Emissione fatture**:
  - Collegata a vendite
  - Formato italiano
  - Numerazione automatica
- **Note di credito/debito**
- **Stampa/Invio fatture**

**⚠️ Fatturazione Elettronica**:
- **Obbligatoria per B2B in Italia**
- **Opzionale per B2C**
- **Decisione**: Valutare se necessaria per MVP o post-MVP
  - Se target include B2B → Necessaria
  - Se solo B2C/privati → Post-MVP

**Semplificazioni**:
- ✅ Fatture semplici ma conformi
- ❌ Fatturazione elettronica complessa → Valutare necessità

**Design**: Form fattura semplice, template professionale, numerazione automatica

---

### ⚠️ 4. Gestione Scadenze (OPZIONALE MVP)

**Priorità che supporta**: 5 (Affidabilità), 7 (Reportistica)

**Decisione**: **OPZIONALE per MVP**, da valutare se necessario

**Se incluso (semplificato)**:
- Scadenze incassi (da fatture)
- Scadenze pagamenti (da acquisti)
- Promemoria scadenze base

**Semplificazioni**:
- ❌ Pianificazione flussi complessa → Solo promemoria base

**Nota**: Utile per PMI con molti crediti/debiti, meno per vendita immediata

---

### ⚠️ 5. Contabilità Base (OPZIONALE MVP)

**Priorità che supporta**: 3 (Supporto Italiano), 6 (Adattabilità)

**Decisione**: **OPZIONALE per MVP**, da valutare se necessario

**Se incluso (semplificato)**:
- Registrazione contabile base
- Piano dei conti semplificato
- Classificazione movimenti base

**Semplificazioni**:
- ❌ Contabilità completa → Solo base
- ❌ Riconciliazione bancaria complessa → Opzionale avanzato

**🎯 FUNZIONALITÀ DIFFERENZIANTE: Prima Nota Automatica**

**Problema risolto**: Scritture contabili manuali, errori frequenti, doppio lavoro

**Funzionalità essenziali**:
- **Generazione automatica scritture contabili** da movimenti:
  - Vendita → Prima nota vendita
  - Acquisto → Prima nota acquisto
  - Pagamento → Scrittura contabile pagamento
  - Incasso → Scrittura contabile incasso
- **Export per commercialista**: Formati italiani standard (CSV, Excel strutturato)
- **Piano dei conti base**: Pre-configurato italiano, personalizzabile
- **Classificazione automatica**: Movimenti classificati automaticamente

**Semplificazioni**:
- ✅ Generazione automatica (no lavoro manuale)
- ✅ Export formati italiani standard
- ✅ Piano dei conti base pre-configurato
- ❌ Contabilità completa → Solo prima nota automatica

**Priorità che supporta**: 3 (Supporto Italiano), 2 (Integrazione), 5 (Affidabilità)

**Design**: Export semplice, formato compatibile commercialista, visualizzazione prima nota chiara

**Nota**: Solo per Azienda (account_type = "company") - Privato non ha bisogno

**Nota**: Utile per PMI che necessitano registrazione contabile, meno per privati

---

### ✅ 6. Report Finanziari Essenziali (ESSENZIALE)

**Priorità che supporta**: 7 (Reportistica Semplice), 2 (Integrazione), 1 (Semplice)

**Funzionalità essenziali**:
- **Report entrate/uscite**:
  - Per periodo
  - Per metodo pagamento
  - Per categoria base
- **Flussi di cassa**:
  - Entrate/uscite giornaliere/settimanali/mensili
  - Saldo cassa
- **Margini base**:
  - Margine per vendita
  - Margine totale periodo
- **Bilanci semplificati**:
  - Totale entrate
  - Totale uscite
  - Saldo

**Semplificazioni**:
- ❌ Bilanci complessi → Solo semplificati
- ❌ Analisi finanziarie avanzate → Opzionale avanzato
- ✅ Report essenziali ma utili → Priorità 7

**Design**: Report chiari, visualizzazioni semplici ma professionali, export base

---

## 🔗 INTEGRAZIONE NATIVA MAGAZZINO-CASSA (PRIORITÀ 2)

### ✅ Funzionalità Core Integrazione

**Obiettivo**: Sincronizzazione automatica, no doppio inserimento

**Flussi automatici**:

1. **Vendita → Scarico Magazzino + Incasso Portafoglio**:
   - Creazione ordine vendita
   - Selezione magazzino di scarico
   - Selezione portafoglio di incasso
   - Scarico automatico quantità da magazzino selezionato
   - Registrazione automatica incasso nel portafoglio selezionato
   - Generazione documento (DDT/Fattura)
   - Tracciabilità completa

2. **Acquisto → Carico Magazzino + Pagamento Portafoglio**:
   - Creazione ordine acquisto
   - Selezione magazzino di carico
   - Selezione portafoglio di pagamento
   - Carico automatico quantità nel magazzino selezionato
   - Registrazione automatica pagamento dal portafoglio selezionato
   - Generazione documento (DDT/Fattura)
   - Tracciabilità completa

3. **Trasferimenti**:
   - **Trasferimenti tra magazzini**: Movimentazione interna prodotti
   - **Trasferimenti tra portafogli**: Spostamento fondi

4. **Visione Unificata**:
   - Dashboard che mostra flussi integrati
   - Report che unificano magazzino e portafogli
   - Tracciabilità incrociata
   - Visione per magazzino/portafoglio o unificata

**Design**: Integrazione trasparente, selezione magazzino/portafoglio chiara, flussi automatici, no doppio lavoro

---

## 🎨 FUNZIONALITÀ SISTEMA - UX E VELOCITÀ

### ✅ 1. Ricerca Universale (Cmd+K) (ESSENZIALE - Funzionalità Differenziante)

**Priorità che supporta**: 1 (Semplice), 5 (Affidabilità)

**Problema risolto**: 10 click per trovare qualcosa, navigazione lenta

**Funzionalità essenziali**:
- **Cmd/Ctrl+K → cerca tutto**: Prodotti, clienti, fornitori, documenti, ordini, movimenti
- **Ricerca multi-campo**: Codice, descrizione, barcode, fornitore, categoria
- **Ricerca fuzzy**: Trovare anche con errori di digitazione
- **Filtri persistenti**: Filtri salvabili per ricerca rapida
- **Accesso rapido**: Tastiera sempre, mouse opzionale

**Semplificazioni**:
- ✅ Ricerca universale semplice
- ✅ Risultati chiari e ordinati per tipo
- ✅ Navigazione diretta ai risultati
- ❌ Ricerca complessa con operatori → Ricerca semplice ma efficace

**Design**: Overlay ricerca elegante, risultati categorizzati, navigazione diretta

**Nota**: Fondamentale per velocità d'uso - accesso rapido a tutto

---

### ✅ 2. Scorciatoie da Tastiera e Velocità (ESSENZIALE - Funzionalità Differenziante)

**Priorità che supporta**: 1 (Semplice)

**Problema risolto**: Interfaccia lenta, troppi click, lavoro ripetitivo frustrante

**Funzionalità essenziali**:
- **Scorciatoie da tastiera per operazioni comuni**:
  - `N` → Nuovo (prodotto, ordine, etc. in base al contesto)
  - `S` → Salva
  - `Esc` → Chiudi/Annulla
  - `Cmd+K` → Ricerca universale
  - `Cmd+S` → Salva
  - Navigazione con frecce/Tab
- **Navigazione senza mouse**: Tutto accessibile da tastiera
- **Azioni batch**: Operazioni multiple su più elementi
- **Flussi semplificati**: Carico merce in 3 click invece di 10

**Semplificazioni**:
- ✅ Scorciatoie standard e intuitive
- ✅ Navigazione completa da tastiera
- ✅ Azioni batch semplici
- ❌ Scorciatoie complesse personalizzate → Set base standard

**Design**: Scorciatoie visibili nel menu, tooltip con scorciatoie, navigazione fluida

**Nota**: Velocità = Semplicità - Utente esperto lavora 10x più veloce

---

### ✅ 3. Dark Mode (ESSENZIALE - Funzionalità Differenziante)

**Priorità che supporta**: 1 (Semplice), Design moderno

**Problema risolto**: Affaticamento visivo per chi lavora 8+ ore al PC

**Funzionalità essenziali**:
- **Dark Mode obbligatoria**: Non opzionale, sempre disponibile
- **Toggle semplice**: Switch rapido light/dark
- **Preferenza salvata**: Ricorda scelta utente
- **Sistema rispettoso**: Segue preferenza sistema se disponibile

**Semplificazioni**:
- ✅ Toggle visibile e accessibile
- ✅ Transizione fluida light/dark
- ✅ Design coerente in entrambe le modalità
- ❌ Temi personalizzati complessi → Light/Dark standard

**Priorità che supporta**: Design moderno, riduzione affaticamento visivo

**Design**: Toggle elegante, palette colori coerente dark/light, contrasti corretti

**Nota**: Standard 2025 - App moderna deve avere dark mode

---

### ✅ 4. Tabelle Intelligenti (ESSENZIALE - Funzionalità Differenziante)

**Priorità che supporta**: 1 (Semplice), 6 (Adattabilità)

**Problema risolto**: Popup continui, modifica lenta, colonne fisse

**Funzionalità essenziali**:
- **Modifica inline**: Doppio click o tasto per modificare direttamente nella tabella (no popup)
- **Colonne personalizzabili**: Mostra/nascondi colonne, salva preferenze per utente
- **Ordinamento e filtri persistenti**: Filtri salvati, ordinamento ricordato
- **Export Excel/CSV pulito**: Direttamente dalla tabella
- **Paginazione intelligente**: Server-side per performance

**Semplificazioni**:
- ✅ Modifica inline semplice
- ✅ Personalizzazione colonne intuitiva
- ✅ Filtri persistenti salvati automaticamente
- ❌ Tabelle complesse con formule → Tabelle intelligenti ma semplici

**Design**: Modifica inline fluida, gestione colonne intuitiva, filtri visibili

**Nota**: Ogni tabella è intelligente - no più popup continui

---

### ✅ 5. Mobile-First Reale (PWA) (ESSENZIALE - Funzionalità Differenziante)

**Priorità che supporta**: 1 (Semplice), 4 (Scalabile)

**Problema risolto**: Gestionali fanno schifo su mobile, impossibili da usare in magazzino

**Funzionalità essenziali**:
- **PWA (Progressive Web App)**: Installabile come app nativa
- **Interfaccia touch ottimizzata**: Tasti grandi, gesti intuitivi
- **Scanner camera barcode (mobile)**: Usa camera telefono per scanner
- **Scanner barcode USB/Bluetooth (desktop)**: Scanner hardware collegato
- **Funziona offline base**: Cache dati per lavoro senza connessione
- **Lavoro in piedi**: Interfaccia ottimizzata per tablet in verticale

**Semplificazioni**:
- ✅ PWA standard (no app native complesse)
- ✅ Interfaccia responsive reale (no desktop adattato)
- ✅ Scanner integrato nativo
- ❌ Offline completo complesso → Offline base per operazioni critiche

**Design**: Mobile-first reale, touch-friendly, scanner integrato, funziona ovunque

**Nota**: Non "mobile-friendly", ma "mobile-first" - progettato prima per mobile, poi desktop

---

### ✅ 6. Onboarding Guidato (ESSENZIALE - Funzionalità Differenziante)

**Priorità che supporta**: 1 (Semplice)

**Problema risolto**: Impossibile iniziare senza formazione, setup complesso

**Funzionalità essenziali**:
- **Setup wizard interattivo**: Passo-passo guidato per configurazione iniziale
- **Template pre-configurati per settore**:
  - "Privato - Gestione Personale"
  - "Negozio Fisico"
  - "E-commerce"
  - "PMI Generale"
- **Demo data opzionale**: Dati di esempio per provare l'app
- **Tutorial contestuali in-app**: Tooltip e guide nel contesto (no video esterni)
- **Obiettivo**: Operativo in 30 minuti, non 3 giorni

**Semplificazioni**:
- ✅ Wizard semplice e chiaro
- ✅ Template pre-configurati utili
- ✅ Tutorial contestuali non invasivi
- ❌ Onboarding complessi personalizzati → Guidato ma semplice

**Design**: Wizard step-by-step chiaro, template evidenti, tutorial non invasivi

**Nota**: Onboarding guidato = Primo impatto positivo = Utente che rimane

---

## 👥 GESTIONE UTENTI E PERMESSI

### ✅ Funzionalità Essenziali

**Priorità che supporta**: 1 (Semplice), 5 (Affidabilità), 6 (Adattabilità)

**Funzionalità essenziali**:
- **Autenticazione utenti**:
  - Login/logout
  - Gestione password
- **Ruoli base**:
  - Admin (tutto)
  - Utente (operazioni base)
  - Solo lettura (opzionale)
- **Multi-utente** (per aziende)
- **Audit log base** (chi, cosa, quando) - Priorità 5 → **Migliorato con Audit Trail Granulare**

**🎯 FUNZIONALITÀ DIFFERENZIANTE: Audit Trail Granulare**

**Problema risolto**: Nessuno sa chi ha modificato cosa, quando e perché - problema di affidabilità

**Funzionalità essenziali**:
- **Tracciamento completo**: Chi, cosa, quando, perché, da dove
- **Log modifiche giacenze**: Ogni variazione tracciata con utente e motivo
- **Log movimenti saldi portafogli**: Ogni movimento finanziario tracciato
- **Storia completa per entità**: Prodotto, ordine, documento hanno storico completo
- **Export audit trail**: Per compliance e verifiche

**Semplificazioni**:
- ✅ Tracciamento automatico (no lavoro manuale)
- ✅ Log strutturato e consultabile
- ✅ Export per verifiche
- ❌ Audit complessi personalizzati → Granulare ma semplice da consultare

**Priorità che supporta**: 5 (Affidabilità), 3 (Supporto Italiano - compliance)

**Design**: Visualizzazione storico chiara, filtri per ricerca, export audit

**Nota**: Livello base per Privato, livello granulare completo per Azienda

**Semplificazioni**:
- ❌ Permessi granulari complessi → Ruoli base semplici
- ✅ Multi-utente → Supportato per aziende
- ✅ Audit trail granulare → Tracciamento completo automatico

**Design**: Login semplice, gestione utenti chiara, ruoli evidenti, audit trail consultabile

---

## 📊 RIEPILOGO FUNZIONALITÀ ESSENZIALI MVP

### ✅ ESSENZIALI (Must Have)

**Magazzino**:
1. ✅ Gestione Anagrafica Prodotti (con categorie auto-amministrabili)
1.1. ✅ Multi-Listino Configurabile (funzionalità differenziante)
2. ✅ Gestione Inventario/Scorte (giacenze real-time, alert) + Inventario Smart con Mobile
2.1. ✅ Marginalità in Tempo Reale (funzionalità differenziante)
3. ✅ Multi-Magazzino (ESSENZIALE - creazione dall'app)
4. ✅ Movimentazioni Magazzino (carico/scarico, tracciabilità, trasferimenti) + Gestione Reso Automatizzata
5. ✅ Gestione Ordini (vendita/acquisto, integrazione, selezione magazzino) + Visualizzazione Kanban
6. ✅ Anagrafiche Clienti/Fornitori
7. ✅ Gestione Documenti (DDT, Fatture, formati italiani)
8. ✅ Reportistica Essenziale (dashboard, report base) + Export Excel Universale

**Cassa/Portafogli**:
1. ✅ Registrazione Pagamenti (incassi/pagamenti, integrazione)
2. ✅ Multi-Portafoglio/Cassa (ESSENZIALE - creazione dall'app)
   - Creazione multipli portafogli/conti (es: Conto Corrente, Contanti, Deposito)
   - Gestione saldi e movimenti per portafoglio
   - Trasferimenti tra portafogli
   - IVA Automatica (Scorporo) - funzionalità differenziante
3. ⚠️ Fatturazione (valutare fatturazione elettronica)
4. ✅ Report Finanziari Essenziali + Marginalità in Tempo Reale
4.1. ✅ Prima Nota Automatica (funzionalità differenziante - solo Azienda)

**Integrazione**:
1. ✅ Integrazione Nativa Magazzino-Cassa (sincronizzazione automatica)

**Sistema**:
1. ✅ Gestione Utenti e Permessi (ruoli base, multi-utente) + Audit Trail Granulare
2. ✅ Ricerca Universale (Cmd+K) - funzionalità differenziante
3. ✅ Scorciatoie da Tastiera - funzionalità differenziante
4. ✅ Dark Mode - funzionalità differenziante
5. ✅ Tabelle Intelligenti - funzionalità differenziante
6. ✅ Mobile-First Reale (PWA) - funzionalità differenziante
7. ✅ Onboarding Guidato - funzionalità differenziante

---

### ⚠️ OPZIONALI MVP (Nice to Have / Post-MVP)

**Magazzino**:
- ⚠️ Gestione Lotti e Scadenze (se necessario per settore)
- ⚠️ Ubicazioni avanzate (zone/corridoi - opzionale)
- ⚠️ Picking e Spedizioni (se necessario)

**Cassa**:
- ⚠️ Gestione Scadenze (se necessario)
- ⚠️ Contabilità Base (se necessario)

**Integrazioni**:
- ⚠️ Integrazione e-commerce (post-MVP)
- ⚠️ Integrazione ERP (post-MVP)

---

## 🎯 Prossimi Passi

1. ✅ Funzionalità essenziali definite
2. ✅ Stack tecnologico approvato - Vedi `.docs/STACK_TECNOLOGICO_FINALE.md`
3. ⏳ Validare con utente se opzionali necessari (fatturazione elettronica, lotti/scadenze)
4. ⏳ Definire priorità implementazione funzionalità essenziali
5. ⏳ Setup iniziale progetto con stack approvato

---

## 📝 Note Implementazione

**Principi da rispettare**:
- **Auto-amministrabile**: Categorie, configurazioni gestibili dall'app
- **Integrazione nativa**: Magazzino-Cassa sincronizzati automaticamente
- **Design moderno + UX semplice**: Componenti professionali, uso intuitivo
- **Ottimizzazione Network Transfer**: Paginazione, cache, query ottimizzate
- **Sviluppo gratuito**: Solo tecnologie gratuite/open source

**🎯 Funzionalità Differenzianti Integrate**:
- ✅ Dashboard "Buongiorno" Azionabile
- ✅ Marginalità in Tempo Reale
- ✅ Gestione IVA Automatica (Scorporo)
- ✅ Multi-Listino Configurabile
- ✅ Ricerca Universale (Cmd+K)
- ✅ Scorciatoie da Tastiera e Velocità
- ✅ Dark Mode
- ✅ Visualizzazione Kanban per Ordini
- ✅ Mobile-First Reale (PWA)
- ✅ Onboarding Guidato
- ✅ Tabelle Intelligenti
- ✅ Inventario Smart con Mobile
- ✅ Prima Nota Automatica
- ✅ Audit Trail Granulare
- ✅ Export Excel Universale
- ✅ Gestione Reso Automatizzata

**Nota**: Vedi `.docs/FUNZIONALITA_DIFFERENZIANTI_DA_INTEGRARE.md` per dettagli completi su ogni funzionalità differenziante.

