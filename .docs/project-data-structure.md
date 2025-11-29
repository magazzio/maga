# Struttura Dati - Magazz.io

Struttura dati adattata alle esigenze specifiche del caso d'uso.

---

## Entità Principali

### 1. Product Types (Tipi Prodotto) - Personalizzabili
**Campi:**
- `id` - Identificativo univoco (auto-incrementale)
- `name` - Nome del tipo (es. "Fiore", "Hash", "Olio")
- `description` - Descrizione (opzionale)

**Nota:** I tipi prodotto sono completamente personalizzabili dall'utente via interfaccia (sezione Impostazioni).

### 2. Products (Prodotti)
**Nota importante:** I prodotti contengono SOLO anagrafica. Stato e proprietà vengono gestiti dai movimenti.

**Campi:**
- `id` - Identificativo univoco formato "P" + 3 numeri casuali (es. P123, P456) - generato automaticamente
- `tipo_id` - Riferimento al tipo prodotto (personalizzabile)
- `strain` - Nome/Strain del prodotto
- `note` - Note aggiuntive (opzionale)
- `active` - Stato attivo/inattivo (boolean, default: true)

**Unità di misura:**
- L'unità di misura è sempre il **grammo (g)** - fissa per tutti i prodotti

**Nota:** 
- La quantità non è memorizzata nel prodotto, ma calcolata dai movimenti.
- Stato (Raw/Cured) e proprietario (Driplug/Meetdrip) vengono gestiti dai movimenti, non dal prodotto.
- I prodotti non attivi (`active: false`) non compaiono nelle selezioni future per mantenere le liste pulite.

### 2. Warehouses (Magazzini)
**Campi:**
- `id` - Identificativo univoco
- `name` - Nome magazzino (es. "Driplug", "Meetdrip")
- `description` - Descrizione (opzionale)
- `owner` - Proprietario (Driplug/Meetdrip)

**Magazzini predefiniti:**
- Magazzino Driplug
- Magazzino Meetdrip

**Vista personalizzata:** Le viste magazzini e casse sono personalizzate per entità (Meetdrip o Driplug).

### 3. Stock (Giacenze)
**Nota importante:** La quantità è CALCOLATA dai movimenti, non memorizzata.

**Campi:**
- `id` - Identificativo univoco
- `product_id` - Riferimento al prodotto
- `warehouse_id` - Riferimento al magazzino
- `quantity` - Quantità disponibile (CALCOLATA dai movimenti)
- `reserved_quantity` - Quantità riservata (per ordini in corso, opzionale)
- `batch` - Lotto/Batch (per tracciamento, opzionale)
- `cut` - Taglio specifico di questa giacenza (es. "pacco da 100g")
- `state` - Stato specifico di questa giacenza (Raw/Cured)
- `notes` - Note aggiuntive

**Funzionalità:**
- Tracciamento quantità per magazzino (calcolata)
- Gestione tagli (es. pacco da 1kg diviso in 10 da 100g)
- Ottimizzazione scelta tagli per ordini

### 4. Portfolios (Portafogli/Casse)
**Campi:**
- `id` - Identificativo univoco
- `name` - Nome portafoglio (es. "Driplug", "Meetdrip")
- `description` - Descrizione (opzionale)
- `balance` - Saldo (calcolato dai movimenti)
- `cash_balance` - Saldo cash (solo movimenti cash)
- `debt_balance` - Saldo debiti non saldati (solo debiti pending)
- `owner` - Proprietario (Driplug/Meetdrip)

**Portafogli predefiniti:**
- Portafoglio Driplug
- Portafoglio Meetdrip

**Vista personalizzata:** Le viste magazzini e casse sono personalizzate per entità (Meetdrip o Driplug).

**Gestione pagamenti:**
- **Cash**: visibile nel saldo cash del portafoglio
- **Bancomat**: tracciato ma non visibile nel saldo (solo storico)
- **Debiti**: tracciati separatamente, possono essere saldati in qualsiasi momento

### 5. Transaction Types (Tipi Movimento) - Personalizzabili
**Campi:**
- `id` - Identificativo univoco
- `name` - Nome tipo movimento (es. "Stock", "Cura", "Delivery", "Meet", "Ship", "Acquisto")
- `description` - Descrizione
- `affects_warehouse` - Se influisce su magazzino (true/false)
- `affects_portfolio` - Se influisce su portafoglio (true/false)
- `payment_type` - Tipo pagamento ("monthly" o "instant")
- `custom_fields` - Campi personalizzati (JSON)

**Tipi movimento predefiniti (esempi):**
- Stock (affects_warehouse: true, affects_portfolio: true, payment_type: "monthly")
- Cura (affects_warehouse: true, affects_portfolio: true, payment_type: "monthly")
- Delivery (affects_warehouse: true, affects_portfolio: true, payment_type: "monthly")
- Meet (affects_warehouse: true, affects_portfolio: true, payment_type: "instant")
- Ship (affects_warehouse: true, affects_portfolio: true, payment_type: "instant")
- Acquisto (affects_warehouse: true, affects_portfolio: true)

**Nota:** Tutti i tipi movimento sono personalizzabili e modificabili via interfaccia.

### 6. Transactions/Movements (Movimenti)
**Campi:**
- `id` - Identificativo univoco
- `type_id` - Riferimento al tipo movimento (personalizzabile)
- `date` - Data movimento
- `product_id` - Riferimento al prodotto
- `quantity` - Quantità
- `from_warehouse_id` - Magazzino origine (opzionale)
- `to_warehouse_id` - Magazzino destinazione (opzionale)
- `from_portfolio_id` - Portafoglio origine (opzionale)
- `to_portfolio_id` - Portafoglio destinazione (opzionale)
- `amount` - Importo (se coinvolge portafoglio)
- `payment_method` - Metodo pagamento ("cash", "bancomat", "debito")
- `is_debt` - Se è un debito (true/false)
- `debt_status` - Stato debito ("pending", "paid") - solo se is_debt = true
- `debt_paid_date` - Data saldo debito (opzionale)
- `notes` - Note
- `metadata` - Dati aggiuntivi personalizzati (JSON)

**Metodi di pagamento:**
- **Cash**: visibile nel portafoglio (cassa)
- **Bancomat**: solo tracciamento, non visibile nel conto bancario
- **Debito**: può essere saldato in qualsiasi momento

**Gestione debiti:**
- I debiti possono essere creati con qualsiasi movimento
- Possono essere saldati in qualsiasi momento
- Stato: "pending" (non saldato) o "paid" (saldato)

**Esempi movimenti:**
- Stock: prodotto entra in magazzino Driplug, movimento su portafoglio Driplug
- Cura: prodotto passa da Raw a Cured, movimento su portafoglio Driplug
- Delivery: prodotto esce da magazzino Driplug, movimento su portafoglio Driplug
- Meet: prodotto esce da magazzino Driplug, movimento su portafoglio Driplug (pagamento istantaneo)
- Ship: prodotto esce da magazzino Driplug, movimento su portafoglio Driplug (pagamento istantaneo)
- Acquisto: prodotto entra in magazzino Meetdrip da magazzino Driplug, movimento su portafogli

### 7. Customers (Clienti)
**Nota importante:** Solo clienti di Meetdrip. Non si gestiscono clienti di Driplug.

**Campi:**
- `id` - Identificativo univoco
- `name` - Nome cliente
- `contact_info` - Informazioni di contatto (opzionale)
- `notes` - Note aggiuntive

**Funzionalità:**
- Gestione solo clienti di Meetdrip
- Collegamento a movimenti/ordini (opzionale)

### 8. Stock Movements (Movimenti Stock) - Storico
**Campi:**
- `id` - Identificativo univoco
- `transaction_id` - Riferimento al movimento
- `product_id` - Riferimento al prodotto
- `warehouse_id` - Magazzino
- `quantity_change` - Variazione quantità (+/-)
- `quantity_before` - Quantità prima
- `quantity_after` - Quantità dopo
- `date` - Data movimento

**Funzionalità:**
- Storico completo movimenti stock
- Tracciamento variazioni quantità
- Audit trail

---

## Relazioni

- **Product Types** ↔ **Products** (1:N) - Un tipo prodotto può avere più prodotti
- **Products** ↔ **Stock** (1:N) - Un prodotto può avere più giacenze
- **Warehouses** ↔ **Stock** (1:N) - Un magazzino può avere più giacenze
- **Products** ↔ **Transactions** (1:N) - Un prodotto può avere più movimenti
- **Warehouses** ↔ **Transactions** (N:N) - Movimenti tra magazzini
- **Portfolios** ↔ **Transactions** (N:N) - Movimenti tra portafogli
- **Transaction Types** ↔ **Transactions** (1:N) - Un tipo può avere più movimenti

---

## Note

- Tutti i campi personalizzabili possono essere modificati via interfaccia
- I tipi movimento sono completamente personalizzabili
- La struttura permette flessibilità per adattarsi a cambiamenti futuri
- **Viste personalizzate:** Le viste magazzini e casse sono personalizzate per entità (Meetdrip o Driplug)
- **Quantità prodotti:** Calcolata dai movimenti, non memorizzata nel prodotto
- **Clienti:** Solo clienti di Meetdrip, non si gestiscono clienti di Driplug
- **Pagamenti:**
  - Cash: visibile nel portafoglio (cassa)
  - Bancomat: solo tracciamento, non visibile nel conto bancario
  - Debiti: possono essere saldati in qualsiasi momento

