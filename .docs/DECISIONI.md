# Decisioni Tecniche (ADR - Architecture Decision Records)

> Questo file registra le decisioni architetturali importanti prese durante lo sviluppo. Ogni decisione include il contesto, le opzioni considerate e la motivazione.

## Formato ADR

Ogni decisione segue questo formato:

```markdown
## [ADR-XXX] Titolo Decisione

**Data**: YYYY-MM-DD
**Stato**: Proposta / Accettata / Deprecata / Sostituita

### Contesto
Perché questa decisione è necessaria?

### Opzioni Considerate
1. Opzione A - Descrizione
2. Opzione B - Descrizione
3. Opzione C - Descrizione

### Decisione
Quale opzione abbiamo scelto e perché?

### Conseguenze
- Pro: Benefici
- Contro: Svantaggi
- Note: Altre considerazioni
```

---

## Decisioni

> Documenta qui SOLO decisioni architetturali importanti che non si capiscono dal codice.
> Per tutto il resto, il codice è auto-documentante.
> 
> **Ricerca rapida**: Usa `#KEYWORD:` o cerca per `[ADR-XXX]` per trovare decisioni specifiche.

---

## [ADR-002] #KEYWORD: priorita_assolute Priorità Strategiche Assolute del Progetto

**Data**: 2024-12-19
**Stato**: Accettata

### Contesto

Dopo analisi approfondita dei problemi dei gestionali esistenti, è necessario definire le priorità strategiche assolute che Magazz.io deve risolvere per differenziarsi e soddisfare utenti privati e PMI italiane.

### Decisione

Abbiamo scelto 7 priorità assolute che devono guidare tutte le decisioni del progetto:

1. **Semplice e Intuitivo** - Interfaccia user-friendly, facile da usare
   - Risolve: Interfaccia complessa, curva di apprendimento elevata, difficoltà d'uso

2. **Integrazione Nativa Magazzino-Cassa** - Sincronizzazione automatica
   - Risolve: Mancanza sincronizzazione magazzino-cassa, integrazione complicata, doppio inserimento dati

3. **Supporto Italiano** - Completamente in italiano
   - Risolve: Supporto in italiano limitato, barriere linguistiche

4. **Scalabile ma Semplice** - Cresce senza diventare complesso
   - Risolve: Scalabilità limitata, complessità crescente

5. **Affidabilità e Precisione Tecnica** - Risolvere problemi tecnici operativi alla radice
   - Risolve: Scorte duplicate/mancanti, inventario obsoleto, tracciabilità incompleta, errori trasferimenti

6. **Adattabilità e Personalizzazione** - Adattabile alle esigenze senza complessità
   - Risolve: Personalizzazione limitata, rigidità, forzare processi

7. **Reportistica Semplice e Utile** - Report facili e utili per decisioni informate
   - Risolve: Reportistica limitata/complessa, difficoltà analisi, report inutili

### Conseguenze

- ✅ **Pro**: 
  - Focus chiaro su cosa rendere Magazz.io diverso
  - Tutte le decisioni future devono rispettare queste priorità
  - Base solida per definire funzionalità e architettura
  
- ⚠️ **Contro**: 
  - Alcune opportunità non selezionate (fatturazione elettronica, pricing, personalizzazione) rimandate
  - Necessità di bilanciare semplicità con funzionalità
  
- 📝 **Note**: 
  - Queste priorità influenzano TUTTE le decisioni future
  - Ogni feature deve essere valutata rispetto a queste priorità
  - Architettura deve supportare semplicità anche quando scala
  - La priorità 5 (Affidabilità Tecnica) è fondamentale per garantire qualità operativa

---

## [ADR-005] #KEYWORD: funzionalita_condizionali Funzionalità Condizionali: Privato vs Azienda

**Data**: 2024-12-19
**Stato**: Accettata

### Contesto

Utenti privati e aziende hanno esigenze diverse per un gestionale magazzino-cassa. Un privato non ha bisogno di fatturazione elettronica, IVA complessa, multi-utente, mentre un'azienda sì. Serve una strategia per gestire queste differenze senza complicare l'app.

### Opzioni Considerate

1. **App separate** - App diversa per privato e azienda
2. **Funzionalità sempre visibili** - Tutto visibile, semplificato per privati
3. **Funzionalità condizionali** - Interfaccia si adatta al tipo account, mostra solo cosa serve

### Decisione

Abbiamo scelto l'opzione 3: **Funzionalità Condizionali**.

**Approccio**:
- Stessa app per tutti (codice unico)
- Tipo account: `account_type: "private" | "company"`
- Interfaccia si adatta automaticamente
- Funzionalità mostrate solo se necessarie
- Privato può diventare azienda (upgrade)

**Funzionalità Base (per tutti)**:
- Magazzino base, Multi-magazzino, Multi-portafoglio
- Dashboard "Buongiorno", Ricerca universale
- Marginalità base, Mobile-first, Onboarding

**Funzionalità Solo Azienda (condizionali)**:
- IVA Automatica (scorporo) - Solo se P.IVA attiva
- Multi-utente e Permessi granulari
- Fatturazione Elettronica
- Prima Nota Automatica
- Multi-listino complesso
- Audit Trail granulare
- Reso automatizzato completo

### Conseguenze

- ✅ **Pro**: 
  - Un solo codice da mantenere
  - Utente vede solo cosa serve (semplicità)
  - Crescita naturale (privato → azienda)
  - Interfaccia pulita e adattiva
  
- ⚠️ **Contro**: 
  - Logica condizionale nell'interfaccia
  - Gestione tipo account
  
- 📝 **Note**: 
  - Interfaccia si adatta automaticamente in base a `account_type`
  - Upgrade possibile: privato può diventare azienda aggiungendo P.IVA
  - Funzionalità fiscali attivate solo se P.IVA presente

---

## [ADR-004] #KEYWORD: network_transfer Ottimizzazione Network Transfer Database

**Data**: 2024-12-19
**Stato**: Accettata

### Contesto

Con database gratuito (es. Neon tier gratuito), il Network Transfer è limitato. Ogni funzionalità che accede al database deve minimizzare il trasferimento dati, mantenendo la funzionalità richiesta ma ottimizzando le modalità di implementazione.

### Opzioni Considerate

1. **Approccio naive** - Caricare tutti i dati, filtrare lato client, refetch frequenti
2. **Workaround sporchi** - Disattivare controlli o limiti per evitare problemi
3. **Ottimizzazione strutturale** - Paginazione, cache intelligente, query ottimizzate

### Decisione

Abbiamo scelto l'opzione 3: **Ottimizzazione strutturale intelligente**.

Ogni accesso al database deve:
- Usare paginazione per liste grandi (server-side)
- Cache intelligente con React Query (`staleTime: 60s` di default)
- Invalidation mirata invece di refetch aggressivi
- Filtri lato server, non lato client
- Nessun polling aggressivo

### Conseguenze

- ✅ **Pro**: 
  - Network transfer minimizzato
  - Migliori performance
  - Scalabilità con crescita dati
  - Rispetto limiti tier gratuito database
  
- ⚠️ **Contro**: 
  - Richiede più attenzione nell'implementazione
  - Deve essere considerato fin dall'inizio, non dopo
  
- 📝 **Note**: 
  - Questa regola influenza TUTTE le query al database
  - Ogni nuova funzionalità deve rispettare queste linee guida
  - La funzionalità richiesta viene sempre realizzata, ma in modo ottimizzato

---

## [ADR-003] #KEYWORD: sviluppo_gratuito Sviluppo Gratuito: Solo Tecnologie e Servizi Gratuiti

**Data**: 2024-12-19
**Stato**: Accettata

### Contesto

È fondamentale sviluppare l'app utilizzando solo tecnologie, strumenti e servizi gratuiti, senza costi di sviluppo.

### Opzioni Considerate

1. **Tecnologie a pagamento** - Servizi, hosting, database a pagamento
2. **Mix gratuito/a pagamento** - Alcuni servizi gratuiti, altri a pagamento
3. **Solo gratuito/open source** - Tecnologie, hosting, database, servizi completamente gratuiti

### Decisione

Abbiamo scelto l'opzione 3: **Solo tecnologie e servizi gratuiti/open source**.

Tutto lo stack deve essere:
- Tecnologie open source/gratuite
- Hosting gratuito o con tier gratuito generoso
- Database gratuito/open source
- Servizi esterni solo se gratuiti
- Strumenti sviluppo gratuiti
- Integrazioni solo se gratuite o low-cost

### Conseguenze

- ✅ **Pro**: 
  - Nessun costo di sviluppo
  - Stack completamente controllabile
  - Soluzioni open source generalmente ben documentate
  - Community support per tecnologie open source
  
- ⚠️ **Contro**: 
  - Potrebbe limitare alcune funzionalità avanzate
  - Hosting gratuito potrebbe avere limiti (traffico, storage, etc.)
  - Alcune integrazioni potrebbero non essere disponibili gratuitamente
  - Potrebbe richiedere più tempo per configurare soluzioni self-hosted
  
- 📝 **Note**: 
  - Questo vincolo influenza TUTTE le decisioni tecnologiche
  - Ogni scelta di stack/servizio deve essere valutata per costo (deve essere zero)
  - Priorità a soluzioni open source e community-driven
  - Potrebbe richiedere soluzioni creative per funzionalità avanzate

---

## [ADR-007] #KEYWORD: design_sistema Design System e Stile Visivo

**Data**: 2024-12-19
**Stato**: Accettata

### Contesto

Serve definire uno stile visivo e design system per Magazz.io che sia:
- Allineato a best practice 2025
- Adatto allo scopo (gestionale magazzino-cassa)
- Professionale e moderno
- Semplice e intuitivo
- Orientato al target (privati e PMI italiane)

### Opzioni Considerate

1. **Design minimalista/spartano** - Focus solo su funzionalità, design semplice
2. **Design complesso/enterprise** - Massima professionalità, più complesso
3. **Design moderno ma semplice** - Professionalità visiva + UX semplice

### Decisione

Abbiamo scelto l'opzione 3: **Design Moderno ma Semplice**.

**Principi Fondamentali**:
1. **Semplicità + Professionalità**: Design moderno e professionale che rimane semplice
2. **Chiarezza e Leggibilità**: Informazione immediatamente comprensibile
3. **Coerenza Visiva**: Elementi grafici uniformi
4. **Accessibilità**: Utilizzabile da tutti (WCAG AA minimo)
5. **Velocità Percepita**: App veloce e reattiva
6. **Mobile-First Reale**: Progettato prima per mobile, poi desktop

**Stack Design**:
- **shadcn/ui**: Componenti moderni e professionali
- **Tailwind CSS**: Utility-first, design system coerente
- **Palette colori**: Blue primario professionale, slate neutri, colori semantici chiari
- **Tipografia**: System fonts per performance, scala leggibile
- **Dark Mode**: Obbligatoria, transizione fluida

**Caratteristiche Chiave**:
- Design moderno come Notion/Linear ma semplice come Google Docs
- Componenti professionali (shadcn/ui) con UX consumer-friendly
- Spazi bianchi generosi (no sovraffollamento)
- Gerarchia visiva chiara
- Interfaccia adattiva per privato/azienda

### Conseguenze

- ✅ **Pro**: 
  - Design moderno e professionale
  - UX semplice e intuitiva
  - Accessibile e inclusivo
  - Mobile-first reale
  - Coerente con stack tecnologico (shadcn/ui + Tailwind)
  - Allineato a best practice 2025
  
- ⚠️ **Contro**: 
  - Richiede attenzione a dettagli visivi (ma gestito con design system)
  
- 📝 **Note**: 
  - Design system completo documentato in `.docs/DESIGN_SISTEMA_STILE.md`
  - Palette colori personalizzabile via CSS variables
  - Interfaccia adattiva per privato/azienda (stessa base, diversa complessità)

---

## [ADR-006] #KEYWORD: multi_magazzino_unificato Multi-Magazzino Unificato con Interfaccia Adattiva

**Data**: 2024-12-19
**Stato**: Accettata

### Contesto

Serve decidere se separare "magazzino base" (singolo) da "multi-magazzino" (multipli) oppure unificare tutto in un'unica funzionalità multi-magazzino per tutti.

### Opzioni Considerate

1. **Separare**: Magazzino base (1 solo) per privato, Multi-magazzino (più) per azienda
2. **Unificare**: Multi-magazzino per tutti, interfaccia adattiva al numero di magazzini

### Decisione

Abbiamo scelto l'opzione 2: **Multi-Magazzino Unificato con Interfaccia Adattiva**.

**Funzionalità Unica**: Multi-magazzino disponibile per tutti (privato e azienda)

**Interfaccia Adattiva**:
- Se 1 magazzino → Interfaccia semplificata (NO selezione magazzino, tutto va lì)
- Se 2-3 magazzini → Interfaccia media (selezione semplice, trasferimenti base)
- Se 5+ magazzini → Interfaccia completa (selezione completa, trasferimenti avanzati, report)

**Utilizzo Tipico**:
- **Privato**: 1-2 magazzini (casa, garage) → Interfaccia semplificata
- **Azienda**: 5-10+ magazzini (sedi) → Interfaccia completa

### Conseguenze

- ✅ **Pro**: 
  - Un solo codice da mantenere (no duplicazione)
  - Privato può crescere (casa → casa + garage) senza limiti
  - Flessibilità totale
  - Interfaccia si adatta automaticamente (semplice se 1 magazzino)
  - Allineato a principio "Scalabile ma Semplice"
  
- ⚠️ **Contro**: 
  - Logica interfaccia adattiva richiede più attenzione (ma risolta con condizioni semplici)
  
- 📝 **Note**: 
  - La semplificazione NON è nella funzionalità (separare), ma nell'INTERFACCIA (adattiva)
  - Un privato può volere 2-3 magazzini (casa + garage + deposito)
  - Stessa funzionalità tecnica per tutti, interfaccia che si adatta al numero di magazzini

---

## [ADR-001] #KEYWORD: auto_amministrabile App Auto-Amministrabile: Gestione Contenuti dall'Interfaccia Web

**Data**: 2024-12-19
**Stato**: Accettata

### Contesto

L'obiettivo è rendere l'applicazione completamente gestibile direttamente dall'interfaccia web, senza dover modificare il codice per aggiungere/modificare contenuti o configurazioni.

### Opzioni Considerate

1. **Hardcoding nel codice** - Valori/configurazioni direttamente nel codice sorgente
2. **File di configurazione** - Valori in file JSON/YAML modificabili manualmente
3. **Database + Admin Panel** - Tutti i contenuti nel database con interfaccia admin per gestirli dall'app

### Decisione

Abbiamo scelto l'opzione 3: **Database + Admin Panel integrato**.

Tutti i contenuti configurabili (categorie, prodotti, configurazioni, etc.) devono essere:
- Memorizzati nel database (non hardcoded)
- Gestibili tramite interfaccia admin integrata nell'app
- Accessibili e modificabili dall'utente direttamente dalla web app

### Conseguenze

- ✅ **Pro**: 
  - Utente completamente autonomo nella gestione dei contenuti
  - Nessuna necessità di modificare il codice per aggiungere/modificare contenuti
  - Scalabile e flessibile per future aggiunte
  - Esperienza utente professionale
  
- ⚠️ **Contro**: 
  - Richiede più sviluppo iniziale (admin panel + CRUD)
  - Richiede database ben strutturato
  - Necessita autenticazione/autorizzazione per l'admin

- 📝 **Note**: 
  - Questa decisione influenza l'intera architettura dell'app
  - Ogni entità "gestibile" deve avere il suo CRUD admin
  - L'admin panel fa parte integrante dell'app, non è un progetto separato

---

