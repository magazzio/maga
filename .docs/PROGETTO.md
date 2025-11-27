# Definizione Progetto: Magazz.io

> Documento vivo che raccoglie tutte le informazioni sulla definizione del progetto.
> Si aggiorna man mano che definiamo i dettagli insieme.

**Data inizio definizione**: 2024-12-19  
**Stato**: 🟢 Definizione Base Completata - Pronto per Setup

---

## 📋 Panoramica Generale

### Cos'è Magazz.io
**Tipo**: Gestionale per flussi di magazzino e cassa

### Scopo Principale
Risolvere i problemi che i gestionali moderni non risolvono per:
- Utenti privati italiani
- Piccole/medie imprese italiane

### Problema da Risolvere
I gestionali esistenti (anche moderni) non soddisfano completamente le esigenze di utenti privati e PMI italiane.

### Tipo Applicazione
- **Primaria**: Web App
- **Dispositivi target**: 
  - Principalmente PC/Desktop
  - Tablet (adatta)
  - Telefono/ Mobile (adatta)
- **Piattaforma**: Browser-based

---

## 👥 Utenti e Accessi

### Modello Utente Identificato

#### Due Modalità di Registrazione:

1. **Utente Privato**
   - Registrazione come singolo utente
   - Accesso personale al gestionale

2. **Azienda**
   - Registrazione come azienda
   - Può avere **più utenti sotto di lei**
   - Gestione multi-utente

### ✅ Modello Account Definito

**Due Tipi di Account**:

1. **Account "Privato"** (`account_type: "private"`)
   - Singolo utente
   - Accesso personale
   - Funzionalità base semplificate
   - NO obblighi fiscali complessi (se no P.IVA)

2. **Account "Azienda"** (`account_type: "company"`)
   - Multi-utente (più persone)
   - Funzionalità complete
   - Obblighi fiscali (fatturazione, IVA)
   - Permessi granulari

**Funzionalità Condizionali**:
- Stessa app per tutti
- Interfaccia si adatta al tipo account
- Funzionalità mostrate solo se necessarie
- Privato può diventare azienda (upgrade)

**Dettagli completi**: 
- Guida rapida: `.docs/FUNZIONALITA_PRIVATO_VS_AZIENDA.md`
- Analisi dettagliata: `.docs/ANALISI_PRIVATO_VS_AZIENDA.md`
- Decisione architetturale: `.docs/DECISIONI.md` ADR-005

**Nota Multi-Magazzino**: Funzionalità unificata per tutti (non separata base/multi). Interfaccia adattiva: semplificata se 1 magazzino, completa se 5+. Vedi `.docs/DECISIONI.md` ADR-006 e `.docs/ANALISI_MAGAZZINO_BASE_VS_MULTI.md`

---

## 🔧 Funzionalità Core

### ✅ Funzionalità Essenziali Definite

Le funzionalità essenziali per MVP sono state completamente definite. Vedi `.docs/FUNZIONALITA_ESSENZIALI.md` per dettagli completi.

**Nota Importante**: Funzionalità distinte per **Privato** vs **Azienda** - Vedi `.docs/ANALISI_PRIVATO_VS_AZIENDA.md`

**Riepilogo funzionalità essenziali**:

**Magazzino**:
- ✅ Gestione Anagrafica Prodotti (con categorie auto-amministrabili)
- ✅ Gestione Inventario/Scorte (giacenze real-time, alert)
- ✅ Multi-Magazzino (creazione dall'app)
- ✅ Movimentazioni Magazzino (carico/scarico, tracciabilità, trasferimenti)
- ✅ Gestione Ordini (vendita/acquisto, integrazione, selezione magazzino)
- ✅ Anagrafiche Clienti/Fornitori
- ✅ Gestione Documenti (DDT, Fatture, formati italiani)
- ✅ Reportistica Essenziale (dashboard, report base)

**Cassa/Portafogli**:
- ✅ Registrazione Pagamenti (incassi/pagamenti, integrazione)
- ✅ Multi-Portafoglio/Cassa (creazione dall'app)
- ⚠️ Fatturazione (valutare fatturazione elettronica)
- ✅ Report Finanziari Essenziali

**Integrazione**:
- ✅ Integrazione Nativa Magazzino-Cassa (sincronizzazione automatica)

**Sistema**:
- ✅ Gestione Utenti e Permessi (ruoli base, multi-utente)

**Funzionalità opzionali**: Vedi `.docs/FUNZIONALITA_ESSENZIALI.md` sezione "OPZIONALI MVP"

---

## 🎯 Requisiti Specifici per Utenti Italiani

### ✅ Requisiti Identificati

**Supporto Italiano (Priorità 3)**:
- ✅ Interfaccia completamente in italiano
- ✅ Documentazione in italiano
- ✅ Supporto/assistenza in italiano
- ✅ Localizzazione completa (lingua, valuta, formato date)

**Requisiti Fiscali/Normativi**:
- ✅ Formati documenti italiani (DDT, Fatture, Note credito/debito)
- ⚠️ **Fatturazione elettronica**: Da valutare se necessaria per MVP
  - Obbligatoria per B2B in Italia
  - Opzionale per B2C
  - Integrazione complessa → Valutare se MVP o post-MVP
- ⏳ Conformità IVA italiana (da valutare se necessario)
- ⏳ GDPR compliance (da implementare)

**Note**: Dettagli completi in `.docs/FUNZIONALITA_ESSENZIALI.md` sezione "Gestione Documenti"

---

## 🔍 Analisi Problemi Gestionali Esistenti

### ✅ Problemi Identificati
Analisi completa disponibile in `.docs/PROBLEMI_GESTIONALI_ANALISI.md`

### ✅ Opportunità Strategiche - PRIORITÀ ASSOLUTE

Queste sono le opportunità che Magazz.io **DEVE** risolvere assolutamente:

#### 1. 🎯 Semplice e Intuitivo
**Priorità**: ASSOLUTA  
**Obiettivo**: Interfaccia user-friendly, facile da usare, senza curva di apprendimento elevata

**Cosa significa**:
- Interfaccia chiara e intuitiva
- Funzionalità accessibili senza formazione complessa
- Design che guida l'utente
- Niente complessità inutile
- **Professionalità e modernità visiva**: Design moderno, componenti professionali, estetica curata
- **Equilibrio**: Semplicità d'uso NON significa design "basso" o poco professionale

**Principio fondamentale**:
- **Vista/Design**: Moderno, professionale, esteticamente curato
- **Componenti**: Moderni, professionali, di qualità
- **UX/Usabilità**: Semplice, intuitiva, accessibile

**Problemi di usabilità da risolvere**:
- Interfaccia complessa → Interfaccia semplice e chiara (MA moderna e professionale)
- Curva di apprendimento elevata → Facile da imparare, nessuna formazione complessa necessaria
- Difficoltà d'uso → Accessibile anche a non esperti
- Design poco professionale → Design moderno e professionale che rimane semplice

#### 2. 🔗 Integrazione Nativa Magazzino-Cassa
**Priorità**: ASSOLUTA  
**Obiettivo**: Collegamento automatico tra magazzino e cassa, sincronizzazione nativa

**Cosa significa**:
- Vendita → Scarico automatico magazzino + Registrazione incasso cassa
- Acquisto → Carico automatico magazzino + Registrazione pagamento cassa
- Sincronizzazione automatica, no doppio inserimento
- Visione unificata flussi magazzino e cassa
- Integrazione semplice, non complessa

**Problemi funzionali da risolvere**:
- Mancanza sincronizzazione magazzino-cassa → Sincronizzazione automatica nativa
- Integrazione tra sistemi complicata → Integrazione semplice e automatica
- Doppio inserimento dati → Eliminato con sincronizzazione automatica

#### 3. 🇮🇹 Supporto Italiano
**Priorità**: ASSOLUTA  
**Obiettivo**: Assistenza e documentazione completamente in italiano

**Cosa significa**:
- Interfaccia in italiano
- Documentazione in italiano
- Supporto/assistenza in italiano
- Localizzazione completa per mercato italiano

#### 4. 📈 Scalabile ma Semplice
**Priorità**: ASSOLUTA  
**Obiettivo**: Cresce con l'azienda senza diventare complesso

**Cosa significa**:
- Può gestire crescita (più prodotti, più utenti, più dati)
- Resta semplice anche quando scala
- Non diventa complesso aggiungendo funzionalità
- Architettura che supporta crescita ma mantiene semplicità d'uso

#### 5. ✅ Affidabilità e Precisione Tecnica
**Priorità**: ASSOLUTA  
**Obiettivo**: Risolvere i problemi tecnici operativi alla radice - precisione e affidabilità garantite

**Cosa significa**:
- **Inventario sempre accurato** - Aggiornamento in tempo reale, sincronizzazione automatica
- **Nessuna scorta duplicata/mancante** - Visione chiara delle giacenze, logica precisa
- **Tracciabilità completa** - Ogni movimento tracciato (chi, cosa, quando, dove)
- **Nessun errore di sincronizzazione** - Dati sempre coerenti tra moduli
- **Precisione dati garantita** - Risolvere problemi tecnici alla radice, no workaround

**Problemi tecnici da risolvere**:
- Scorte duplicate o mancanti → Visione unificata, sincronizzazione accurata
- Inventario obsoleto → Aggiornamento real-time, sincronizzazione automatica
- Tracciabilità incompleta → Audit trail completo per ogni operazione
- Errori trasferimenti → Tracciamento preciso movimenti interni
- Precisione dati → Logica solida, validazioni, coerenza garantita

#### 6. 🔧 Adattabilità e Personalizzazione
**Priorità**: ASSOLUTA  
**Obiettivo**: Adattabile alle esigenze specifiche senza complessità inutile

**Cosa significa**:
- **Personalizzabile** - Si adatta alle esigenze azienda, non viceversa
- **Configurabile dall'app** - Personalizzazioni gestibili dall'interfaccia (non codice)
- **Flessibile** - Supporta diversi modelli operativi senza complicare
- **Non rigido** - Non forza un modo di lavorare, si adatta

**Problemi da risolvere**:
- Personalizzazione limitata → Software adattabile alle esigenze specifiche
- Rigidità gestionali → Flessibilità senza complessità
- Forzare processi → Adattarsi ai flussi aziendali esistenti

#### 7. 📊 Reportistica Semplice e Utile
**Priorità**: ASSOLUTA  
**Obiettivo**: Report facili da generare e utili per decisioni informate

**Cosa significa**:
- **Report semplici da generare** - Non complessi, accessibili facilmente
- **Report utili** - Informazioni che aiutano decisioni, non solo dati
- **Visualizzazioni chiare** - Grafici e tabelle comprensibili
- **Report essenziali** - Non troppi, ma quelli che servono veramente

**Problemi da risolvere**:
- Reportistica limitata/complessa → Report semplici ma utili
- Difficoltà analisi → Strumenti che facilitano analisi e decisioni
- Report inutili → Solo report che servono veramente

#### Integrazione tra Sistemi (Esplicitazione)
**Priorità**: Parte integrante priorità 2 (Integrazione Nativa Magazzino-Cassa)
**Estensione**: L'integrazione nativa deve essere semplice e automatica, non complessa

**Cosa significa**:
- Integrazione automatica tra moduli (magazzino-cassa)
- Integrazione futura con altri sistemi semplice se necessaria
- API chiare per integrazioni esterne se richieste
- Nessuna complessità nell'integrazione

---

## 🏗️ Architettura e Tecnologie

### ✅ Vincolo Fondamentale: Sviluppo Gratuito

**Requisito assoluto**: L'app deve essere sviluppata utilizzando solo tecnologie, strumenti e servizi gratuiti.

**Cosa significa**:
- **Stack tecnologico**: Solo tecnologie open source/gratuite
- **Hosting**: Servizi gratuiti o con tier gratuito generoso
- **Database**: Solo soluzioni gratuite
- **Servizi esterni**: Solo se gratuiti o con tier gratuito
- **Strumenti sviluppo**: Solo tool gratuiti/open source
- **Integrazioni**: Solo se gratuite o low-cost

**Implicazioni**:
- Influenza la scelta di framework, database, hosting
- Potrebbe limitare alcune funzionalità avanzate che richiedono servizi a pagamento
- Priorità a soluzioni open source e community-driven

### Stack Tecnologico
**✅ Approvato** - Vedi `.docs/STACK_TECNOLOGICO_FINALE.md` per stack completo approvato

**Stack finale approvato**:
- **Frontend**: React 18+ TS, shadcn/ui, Tailwind CSS, TanStack Query, React Router, React Hook Form, Zod, react-i18next, Vite
- **Backend**: Node.js 20+ LTS + Express.js
- **Database**: PostgreSQL + Drizzle ORM
- **Hosting**: Render (frontend+backend insieme), Neon (database)
- **Autenticazione**: JWT + bcrypt
- **Strumenti**: TypeScript, Vitest, Playwright, ESLint, Prettier

**Costi**: €0/mese (fase iniziale, tier gratuiti)

### Domande Architetturali:
- [ ] Backend necessario? (API, server, database) - Solo soluzioni gratuite
- [ ] Database type? (SQL, NoSQL) - Solo open source/gratuito
- [ ] Autenticazione/Autorizzazione? - Solo soluzioni gratuite
- [ ] Hosting/Deployment preferences? - Solo servizi gratuiti o tier gratuiti
- [ ] Integrazioni esterne necessarie? - Solo se gratuite

### ✅ Regola Tecnica: Ottimizzazione Network Transfer Database

**Regola fondamentale**: Minimizzare sempre il Network Transfer del database (importante per database gratuiti come Neon).

**Linee guida complete**: Vedi `.docs/PREFERENZE.md` sezione "Ottimizzazione Network Transfer Database" e `.docs/DECISIONI.md` ADR-004.

**In sintesi**:
- Paginazione obbligatoria per liste grandi
- Cache intelligente (React Query configurato correttamente)
- Filtri lato server, non lato client
- Nessun refetch aggressivo o polling inutile

---

## 📝 Note e Variabili da Considerare

### #KEYWORD: variabili_complete Analisi Completa Variabili

Per ogni decisione o proposta, consideriamo sempre:

#### Variabili Funzionali:
- [ ] Impatto su altre funzionalità
- [ ] Requisiti utente soddisfatti
- [ ] Coerenza con obiettivi progetto

#### Variabili Tecniche:
- [ ] Scalabilità necessaria?
- [ ] Volume di dati previsto?
- [ ] Numero utenti simultanei previsto?
- [ ] Performance requirements?
- [ ] Sicurezza dati (GDPR compliance)?
- [ ] Compatibilità dispositivi (PC, tablet, mobile)?

#### Variabili Operative:
- [ ] Offline capability necessaria?
- [ ] Backup/Restore requirements?
- [ ] Manutenibilità nel tempo?
- [ ] Dipendenze esterne?

#### Variabili Business:
- [ ] Prezzo/modello business?
- [ ] Costi sviluppo/tempo?
- [ ] Rischio implementazione?
- [ ] ROI potenziale?
- [x] **VINCOLO**: Costi sviluppo = ZERO - Solo tecnologie gratuite/open source

#### Variabili Legali/Normative:
- [ ] Conformità normative italiane
- [ ] GDPR compliance
- [ ] Requisiti fiscali italiani
- [ ] Altri obblighi legali?

---

## ✅ Prossimi Passi

1. ✅ **Definire funzionalità essenziali** - Completato: Vedi `.docs/FUNZIONALITA_ESSENZIALI.md`
2. ✅ **Analizzare problemi esistenti** - Completato: Vedi `.docs/PROBLEMI_GESTIONALI_ANALISI.md`
3. ✅ **Stack tecnologico completo** - Approvato: Vedi `.docs/STACK_TECNOLOGICO_FINALE.md`
4. ⏳ **Validare funzionalità opzionali** - Valutare se necessarie per MVP (fatturazione elettronica, lotti/scadenze, etc.)
5. ⏳ **Creare struttura progetto** - Setup iniziale con stack approvato

---

## 🔄 Cronologia Definizione

### 2024-12-19 - Prima Sessione
- ✅ Definito scopo generale: gestionale magazzino e cassa
- ✅ Definito target: utenti privati e PMI italiane
- ✅ Definito tipo: Web App (PC, tablet, mobile)
- ✅ Definito modello utente: Privato vs Azienda (multi-utente)
- ✅ Completata analisi problemi gestionali esistenti
- ✅ Identificate opportunità strategiche prioritarie

### 2024-12-19 - Decisioni Strategiche Fondamentali
Definite 7 PRIORITÀ ASSOLUTE che guidano tutte le decisioni del progetto:

- ✅ **PRIORITÀ 1**: Semplice e Intuitivo - Interfaccia user-friendly
- ✅ **PRIORITÀ 2**: Integrazione Nativa Magazzino-Cassa - Sincronizzazione automatica
- ✅ **PRIORITÀ 3**: Supporto Italiano - Completamente in italiano
- ✅ **PRIORITÀ 4**: Scalabile ma Semplice - Cresce senza diventare complesso
- ✅ **PRIORITÀ 5**: Affidabilità e Precisione Tecnica - Problemi tecnici operativi risolti alla radice
- ✅ **PRIORITÀ 6**: Adattabilità e Personalizzazione - Adattabile senza complessità
- ✅ **PRIORITÀ 7**: Reportistica Semplice e Utile - Report facili e utili
- ✅ **VINCOLO FONDAMENTALE**: Sviluppo Gratuito - Solo tecnologie e servizi gratuiti/open source

**Documentazione completa**: Vedi sezione "Opportunità Strategiche - PRIORITÀ ASSOLUTE" e "Vincolo Fondamentale: Sviluppo Gratuito" sopra.

- ✅ Funzionalità essenziali definite: Vedi `.docs/FUNZIONALITA_ESSENZIALI.md`
- ✅ Stack tecnologico approvato: Vedi `.docs/STACK_TECNOLOGICO_FINALE.md`
- ✅ Setup iniziale progetto: Struttura base creata con stack approvato (Vedi `SETUP.md`)

---

