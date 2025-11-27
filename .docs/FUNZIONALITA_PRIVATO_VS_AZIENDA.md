# Funzionalità: Privato vs Azienda - Guida Definitiva

> Guida chiara e definitiva: quali funzionalità servono a privato e quali ad azienda.

**Data**: 2024-12-19  
**Decisione**: Funzionalità condizionali - Interfaccia adattiva basata su tipo account

---

## 🎯 APPROCCIO SCELTO

**Stessa app per tutti, interfaccia adattiva**:
- Tipo account: `"private"` o `"company"`
- Funzionalità mostrate solo se necessarie
- Interfaccia si adatta automaticamente
- Privato può diventare azienda (upgrade)

---

## 📊 TABELLA RIEPILOGATIVA

### Funzionalità Base (Per TUTTI)

| Funzionalità | Privato | Azienda | Note |
|---|---|---|---|
| **Multi-Magazzino** | ✅ Sì (1-2 magazzini) | ✅ Sì (5+ magazzini) | Funzionalità unica, interfaccia adattiva |
| **Multi-Portafoglio** | ✅ Sì (personal) | ✅ Sì (aziendali) | Conti personali vs aziendali |
| **Dashboard "Buongiorno"** | ✅ Sì | ✅ Sì | Informazioni critiche subito |
| **Ricerca Universale (Cmd+K)** | ✅ Sì | ✅ Sì | Cerca tutto velocemente |
| **Scorciatoie Tastiera** | ✅ Sì | ✅ Sì | Velocità d'uso |
| **Dark Mode** | ✅ Sì | ✅ Sì | Affaticamento visivo |
| **Mobile-First/PWA** | ✅ Sì | ✅ Sì | Funziona su tablet/telefono |
| **Onboarding Guidato** | ✅ Sì (template privato) | ✅ Sì (template azienda) | Setup diverso |
| **Marginalità Base** | ✅ Sì | ✅ Sì | Profitto per vendita |
| **Tabelle Intelligenti** | ✅ Sì | ✅ Sì | Modifica inline, filtri |
| **Scanner Barcode** | ✅ Sì | ✅ Sì | Utile per entrambi |
| **Export Base Excel/CSV** | ✅ Sì | ✅ Sì | Export base |

---

### Funzionalità Solo Azienda (Condizionali)

| Funzionalità | Privato | Azienda | Attivazione |
|---|---|---|---|
| **IVA Automatica (Scorporo)** | ❌ No | ✅ Sì (ESSENZIALE) | Solo se `account_type = "company"` + P.IVA presente |
| **Multi-Utente** | ❌ No | ✅ Sì | Solo se `account_type = "company"` |
| **Permessi Granulari** | ❌ No | ✅ Sì | Solo se `account_type = "company"` |
| **Fatturazione Elettronica** | ❌ No | ✅ Sì (B2B obbligatoria) | Solo se `account_type = "company"` + P.IVA |
| **Prima Nota Automatica** | ❌ No | ✅ Sì | Solo se `account_type = "company"` |
| **Multi-Listino Complesso** | ⚠️ Base (1 prezzo) | ✅ Sì (multi-listino) | Privato: 1 listino, Azienda: multipli |
| **Audit Trail Granulare** | ⚠️ Base | ✅ Sì (completo) | Livelli diversi |
| **Reso Automatizzato** | ⚠️ Semplice | ✅ Sì (completo) | Livelli diversi |
| **Export Commercialista** | ⚠️ Base | ✅ Sì (completo) | Livelli diversi |

---

## 👤 UTENTE PRIVATO - Funzionalità Essenziali

### Cosa Serve a un Privato:

**Magazzino**:
- ✅ Gestione prodotti base
- ✅ Giacenze e inventario
- ✅ Multi-magazzino (1-2 magazzini tipici: casa, garage)
  - Interfaccia semplificata se 1 magazzino
  - Selezione magazzino se 2+ magazzini
- ✅ Movimenti base (entrata/uscita)
- ✅ Ordini semplici

**Cassa/Portafogli**:
- ✅ Multi-portafoglio personali (es: Conto, Contanti)
- ✅ Tracciamento entrate/uscite
- ❌ NO IVA (se no P.IVA)

**Interfaccia**:
- ✅ Dashboard "Buongiorno"
- ✅ Ricerca universale
- ✅ Mobile-friendly
- ✅ Onboarding semplificato

**Report**:
- ✅ Report base (spese, entrate, valore magazzino)

**Cosa NON Serve**:
- ❌ Multi-utente (è solo lui)
- ❌ Fatturazione elettronica (se no P.IVA)
- ❌ IVA automatica (se no P.IVA)
- ❌ Prima nota contabile
- ❌ Permessi granulari

---

## 🏢 AZIENDA - Funzionalità Essenziali

### Cosa Serve a un'Azienda:

**Magazzino**:
- ✅ Gestione prodotti completa
- ✅ Multi-magazzino (sedi diverse)
- ✅ Tracciabilità completa
- ✅ Ordini complessi

**Cassa/Portafogli**:
- ✅ Multi-portafoglio aziendali
- ✅ **IVA automatica (ESSENZIALE)** - Scorporo automatico
- ✅ Gestione scadenze pagamenti/incassi

**Fiscalità e Documenti**:
- ✅ **Fatturazione elettronica** (obbligatoria B2B)
- ✅ DDT conformi italiani
- ✅ **Prima nota automatica**
- ✅ Export per commercialista

**Multi-Utente**:
- ✅ Più utenti con permessi diversi
- ✅ Proprietario, Magazziniere, Commercialista
- ✅ Permessi granulari

**Report**:
- ✅ Report fiscali
- ✅ Report commerciali
- ✅ Margini e profitti
- ✅ Flussi di cassa

**Altro**:
- ✅ Multi-listino configurabile
- ✅ Audit trail granulare
- ✅ Reso automatizzato
- ✅ Export commercialista completo

---

## 🔄 UPGRADE: Da Privato ad Azienda

**Possibilità**: ✅ Privato può diventare azienda

**Come funziona**:
1. Privato registrato come `account_type: "private"`
2. Privato aggiunge P.IVA
3. Sistema offre upgrade a `account_type: "company"`
4. Funzionalità aziendali si sbloccano automaticamente
5. Dati esistenti preservati

**Vantaggi**:
- Crescita naturale
- Nessun cambio app
- Transizione semplice

---

## 📋 IMPLEMENTAZIONE TECNICA

### Database Schema

```sql
-- Tabella Account
account_type: "private" | "company"
p_iva: string | null  -- Se presente, attiva funzionalità fiscali
```

### Logica Interfaccia

```typescript
// Esempio logico
if (account_type === "company" && p_iva) {
  // Mostra: IVA Automatica, Fatturazione Elettronica
} else {
  // Nascondi funzionalità fiscali
}

if (account_type === "company") {
  // Mostra: Multi-utente, Permessi granulari
} else {
  // Solo utente singolo
}
```

---

## ✅ RIEPILOGO DECISIONE

**Approccio Finale**:
- ✅ Stessa app per tutti
- ✅ Funzionalità condizionali (mostrate se necessarie)
- ✅ Interfaccia adattiva (si adatta al tipo account)
- ✅ Upgrade possibile (privato → azienda)

**Funzionalità Base**: Tutte le funzionalità essenziali per MVP disponibili per TUTTI

**Funzionalità Azienda**: Funzionalità avanzate/fiscali disponibili SOLO per aziende

**Semplificazione**: Privato vede solo cosa serve, interfaccia più pulita

---

## 📝 NOTE

**Principio Fondamentale**:
- Stessa app, interfaccia adattiva
- Utente vede solo cosa serve
- Nessuna complessità inutile per privato
- Funzionalità complete per azienda

**Benefici**:
- Un solo codice da mantenere
- Semplicità per privato
- Completezza per azienda
- Crescita naturale (upgrade)

