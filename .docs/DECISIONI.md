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

---

## [ADR-001] App Auto-Amministrabile: Gestione Contenuti dall'Interfaccia Web

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

