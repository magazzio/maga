# Design System e Stile Visivo - Magazz.io

> Definizione completa dello stile visivo, design system e principi UI/UX per Magazz.io, allineato a best practice 2025, scopo dell'app e target utenti.

**Data definizione**: 2024-12-19  
**Obiettivo**: Stile moderno, professionale, semplice e intuitivo per gestionali magazzino-cassa

---

## 🎯 PRINCIPI FONDAMENTALI

### 0. Filosofia Visiva: "Clean Corporate Moderno"

**Parola chiave**: **"Data Density with Breathing Room"** (Densità di dati con spazio per respirare)

**Principio**: Minimalista, bordi sottili, ombre impercettibili, focus maniacale sulla tipografia.  
**Stile di riferimento**: Stripe (corporate serio), Linear (moderno ma pro), Notion (accessibile e friendly)

**Tre Pilastri Fondamentali**:

1. **Respiro**: Non riempire ogni pixel. Gli spazi bianchi sono alleati. Lascia respirare i contenuti.
2. **Gerarchia Chiara**: L'occhio deve capire immediatamente cosa è importante e cosa è secondario.
3. **Consistenza Ossessiva**: Ogni bottone, ogni input, ogni card deve sembrare della stessa famiglia.

**Cosa significa**:
- Densità dati ottimale: molte informazioni ma ben organizzate
- Spazio bianco generoso: "breathing room" per leggibilità
- Design pulito e moderno, non "fogli di calcolo glorificati" anni 2000
- Contrasto per gerarchia, non decorazioni eccessive
- Non troppo "creativo" che distrae

**Esempio**: 
- ❌ Foglio di calcolo glorificato anni 2000: grigio, righe minuscole, sovraffollato
- ❌ Design troppo creativo: distrae dal lavoro
- ✅ App moderna corporate: pulita, contrasto per gerarchia, piacevole da usare, professionale

---

### 1. Semplicità + Professionalità

**Principio**: Design moderno e professionale che rimane semplice e intuitivo da usare.

**Cosa significa**:
- **Vista/Design**: Moderno, professionale, esteticamente curato, stile "Linear/Vercel"
- **Componenti**: Moderni, professionali, di alta qualità (shadcn/ui)
- **Usabilità**: Semplice, intuitiva, accessibile, senza complessità inutile
- **Equilibrio**: Design enterprise-quality ma UX consumer-friendly

**Esempio**: 
- ❌ Interfaccia "spartana" in nome della semplicità
- ❌ Fogli di calcolo glorificati (grigi, minuscoli, brutti)
- ✅ Interfaccia moderna come Notion/Linear/Vercel ma semplice come Google Docs

---

### 2. Chiarezza e Leggibilità

**Principio**: L'informazione deve essere immediatamente comprensibile.

**Cosa significa**:
- Gerarchia visiva chiara (cosa è più importante?)
- **Contrasti ADEGUATI per leggibilità**: Testo principale quasi nero (slate-900), non grigio scuro
- Spazi bianchi generosi (no sovraccarico visivo) - "breathing room"
- Testi leggibili e ben formattati

**⚠️ Cosa EVITARE assolutamente**:
- ❌ **Contrasto basso**: Grigio chiaro su bianco è elegante ma illeggibile in magazzino illuminato male
- ❌ **Font obsoleti**: Arial, Times New Roman (usare font moderni)
- ❌ **Ombre pesanti**: Drop shadows anni 2010 (usare ombre diffuse e leggere)
- ❌ **Troppi bordi**: Non mettere bordi a tutto (spesso basta sfondo diverso o spazio bianco)

---

### 3. Coerenza Visiva

**Principio**: Elementi grafici uniformi per esperienza armoniosa.

**Cosa significa**:
- Colori coerenti in tutta l'app
- Tipografia consistente
- Spaziatura uniforme
- Componenti riutilizzabili

---

### 4. Accessibilità

**Principio**: L'app deve essere utilizzabile da tutti.

**Cosa significa**:
- Contrasti WCAG AA (minimo)
- Supporto screen reader
- Navigazione da tastiera completa
- Dimensioni touch target adeguate (min 44x44px)

---

### 5. Velocità Percepita

**Principio**: L'app deve sentirsi veloce e reattiva.

**Cosa significa**:
- Feedback immediato alle azioni
- Loading states eleganti
- Transizioni fluide (non troppo lente)
- Ottimizzazione performance

---

### 6. Mobile-First Reale

**Principio**: Progettato prima per mobile, poi desktop.

**Cosa significa**:
- Touch-friendly (tasti grandi, gesti intuitivi)
- Layout responsive reale (non desktop adattato)
- Funziona bene in verticale (tablet in piedi)
- PWA installabile

---

## 🎨 PALETTE COLORI

### Colori Primari

**Principio**: Colori professionali, non invasivi, adatti a lavoro quotidiano.

**Palette Base** (adattabile a tema brand futuro):

```
Primario:        #2563eb (Blue 600) - Azioni principali, link
Primario Hover:  #1d4ed8 (Blue 700)
Primario Light:  #3b82f6 (Blue 500)

Secondario:      #64748b (Slate 500) - Elementi secondari
Secondario Hover: #475569 (Slate 600)

Successo:        #10b981 (Green 500) - Operazioni positive, conferme, soldi in entrata, stock alto
Successo Light:  #dcfce7 (Green 50) - Sfondo pastello per successo
Successo Text:   #065f46 (Green 800) - Testo scuro su sfondo pastello

Warning:         #f59e0b (Amber 500) - Avvisi, attenzioni, in scadenza, stock basso
Warning Light:   #fef3c7 (Amber 100) - Sfondo pastello per warning
Warning Text:    #92400e (Amber 800) - Testo scuro su sfondo pastello

Errore:          #dc2626 (Red 600) - ⚠️ Rosso desaturato, non acceso (meno ansiogeno)
Errore Light:    #fee2e2 (Red 100) - Sfondo pastello per errore
Errore Text:     #991b1b (Red 800) - Testo scuro su sfondo pastello

Info:            #06b6d4 (Cyan 500) - Informazioni, tooltip
```

**🎨 Approccio Strategico: Regola 80/20**:
- **80% dell'interfaccia**: Neutri (bianchi, grigi) - Il 90% delle cose
- **20% dell'interfaccia**: Colore brand + colori semantici

**Palette Minimalista**:
- **Neutri**: Dal bianco puro a vari grigi sempre più scuri fino al quasi-nero per testo
- **Un Colore Brand Forte**: UN blu professionale (corporate serio) oppure UN verde gestionale
  - Non mischiare troppi colori
  - Va su: Bottoni principali, Link, Elementi selezionati, Icone importanti

**Colori Semantici** (solo quando servono):
- **Verde brillante** = Successo, tutto ok, salvataggio riuscito
- **Rosso deciso** = Errore, attenzione, elimina (desaturato, non ansiogeno)
- **Giallo/arancione** = Warning, fai attenzione
- **Azzurro** = Informazione neutra

**Cosa Evitare**:
- ❌ Gradienti complicati (sono anni 2010)
- ❌ Colori saturi ovunque (stancano)
- ❌ Più di 2-3 colori accent (confonde)

**Razionale**:
- **Un solo brand color forte** (Blue 600): Per bottoni "Call to Action" (es. "Nuova Fattura")
- Slate/Zinc per grigi: Professionale, neutro (80% dell'interfaccia)
- **Colori semantici con toni pastello per sfondo**: Verde pastello per successo, rosso pastello per errore
- **Rosso desaturato** (non acceso): Meno ansiogeno, più professionale
- Palette Tailwind CSS standard (coerente con shadcn/ui)

---

### Colori Neutrali (Light Mode)

```
Background:      #ffffff (White)
Background Alt:  #f8fafc (Slate 50)
Background Hover: #f1f5f9 (Slate 100)

Border:          #e2e8f0 (Slate 200)
Border Light:    #f1f5f9 (Slate 100)

Text Primary:    #0f172a (Slate 900) - ⚠️ Quasi nero, non grigio scuro (leggibilità)
Text Secondary:  #475569 (Slate 600)
Text Tertiary:   #94a3b8 (Slate 400)
Text Disabled:   #cbd5e1 (Slate 300)
```

---

### Colori Neutrali (Dark Mode)

```
Background:      #0f172a (Slate 900)
Background Alt:  #1e293b (Slate 800)
Background Hover: #334155 (Slate 700)

Border:          #334155 (Slate 700)
Border Light:    #475569 (Slate 600)

Text Primary:    #f8fafc (Slate 50)
Text Secondary:  #cbd5e1 (Slate 300)
Text Tertiary:   #94a3b8 (Slate 400)
Text Disabled:   #64748b (Slate 500)
```

**Razionale Dark Mode**:
- Background scuro ma non nero puro (riduce affaticamento)
- Contrasti adeguati per leggibilità
- Coerenza con palette light mode

---

### Stati e Feedback

```
Hover:           Luminosità -10% rispetto al colore base
Active/Pressed:  Luminosità -20% rispetto al colore base
Focus:           Ring outline color primario + shadow
Disabled:        Opacity 50% + cursor not-allowed
```

---

## 📝 TIPOGRAFIA

### Font Family

**Font Primario** (scelta moderna 2025):

**Inter** (standard industriale, pulitissimo, gratis, perfetto per UI):
```css
Font Sans:  "Inter", system-ui, -apple-system, sans-serif
```

**Raccomandazione**: **Inter** - Standard industriale, pulito, leggibile, variabile, gratis, perfetto per B2B

**⚠️ Due Font Massimo**:
- Font Sans-Serif Moderno: Inter per tutto (titoli, testo, pulsanti)
- Font Monospace (opzionale): Solo per numeri/codici/importi nelle tabelle (per allineamento perfetto)

**Font Mono** (per codice/numeri):
```css
Font Mono:  "SF Mono", "Cascadia Code", "Roboto Mono", Consolas, monospace
```

**🔢 Tabular Nums (CRUCIALE)**:
- **ATTIVARE tabular-nums per tutti i numeri** (prezzi, quantità, importi)
- **Perché**: Allineamento perfetto verticale delle virgole e cifre nelle liste
- **Implementazione**: `font-variant-numeric: tabular-nums;` o `font-feature-settings: "tnum";`
- **Importante**: Senza questo, liste di prezzi sembrano amatoriali

**Razionale**:
- Font moderni e leggibili (non Arial/Times)
- Inter: standard industriale, perfetto per B2B
- Tabular nums: essenziale per professionalità con numeri
- Mono per codice quando necessario

---

### Scala Tipografica

**Gerarchia Semplice (4-5 dimensioni, non venti)**:

```
Molto Grande:  text-3xl (30px) - Titoli pagina
Grande:        text-xl  (20px) - Sottotitoli sezione
Normale:       text-base (16px) / text-sm (14px) - 90% del testo (corpo, bottoni, input)
Piccolo:       text-sm  (14px) - Etichette, note
Minuscolo:     text-xs  (12px) - Helper text, footer
```

**Pesi Font**:

```
Grassetto (600):  Titoli e cose importanti
Medio (500):      Cose leggermente evidenziate
Normale (400):    Tutto il resto
```

**⚠️ Cosa Evitare**:
- ❌ Font troppo sottili (illeggibili)
- ❌ Troppi pesi diversi (confusione)
- ❌ Testi tutti in maiuscolo ovunque (urla)
- ❌ Venti dimensioni diverse

**Razionale**:
- Scala semplice e chiara (4-5 dimensioni)
- Dimensioni adatte a lavoro quotidiano (no font troppo piccoli)
- Pesi font chiari e coerenti
- Leggibilità prima di tutto

---

### Uso Tipografia

**Regole**:
- **Display/Heading 1**: Solo per landing page o titoli sezioni molto importanti
- **Heading 2-3**: Titoli sezioni principali
- **Heading 4**: Sottotitoli sezioni
- **Body**: Contenuto principale (default 14px o 16px)
- **Label**: Etichette form, badge, tag
- **Caption**: Note, date, metadata

**Evitare**:
- ❌ Font troppo piccoli (< 12px)
- ❌ Font troppo grandi per contenuto
- ❌ Troppi pesi font diversi nella stessa schermata

---

## 📐 SPAZIATURA E LAYOUT

### Sistema Spaziatura

**Sistema ad 8 (Regola Magica)**:

**Principio**: Tutto deve essere multiplo di 8 pixel. Quindi: 8, 16, 24, 32, 48, 64...

**Spacing Scale** (multipli di 8):
```
0:   0px
1:   8px   (gap minimo)
2:   16px  (gap piccolo/standard)
3:   24px  (gap medio)
4:   32px  (gap grande)
5:   40px
6:   48px  (gap molto grande)
8:   64px  (gap enorme)
```

**Applica a Tutto**:
- Padding dentro i componenti: multipli di 8
- Margini tra elementi: multipli di 8
- Altezze bottoni/input: multipli di 8

**Filosofia dello Spazio**:
- **Più vicini = più correlati**:
  - Elementi strettamente correlati: poco spazio (8px)
  - Elementi della stessa sezione: spazio medio (16-24px)
  - Sezioni diverse: molto spazio (32-48px)
- **Respiro Generoso**: Non stipare tutto. Se hai dubbio tra poco e tanto spazio, scegli tanto.

**Razionale**:
- Sistema modulare 8px crea ritmo visivo e coerenza automatica
- Più semplice da ricordare e applicare
- Standard industria (molti design system usano 8px)
- Spazi generosi (no sovraffollamento)

---

### Layout - Struttura Solida

**Header Fisso in Alto**:
- Sempre visibile anche scrollando
- Contiene: logo, ricerca universale, menu utente
- Sfondo bianco (o chiaro), ombra sottile sotto
- Altezza fissa confortevole (multipla di 8)

**Sidebar Laterale Sinistra**:
- Navigazione principale
- Sfondo leggermente più scuro del contenuto (ma comunque chiaro)
- Icone + testo per ogni voce
- Evidenzia chiaramente la pagina attiva
- Desktop: sempre visibile
- Tablet: collassabile
- Mobile: diventa hamburger menu o bottom nav

**Contenuto Centrale**:
- Non troppo largo (max 1400px circa) altrimenti righe illeggibili
- Centrato con spazi ai lati
- Sfondo diverso dal bianco delle card (per distinguerle)
- Padding generoso tutto intorno (multipli di 8)

**Container Max Width**:
```
Mobile:     100% (no padding laterale)
Tablet:     max-w-3xl (768px) con padding 16px
Desktop:    max-w-7xl (1280px) con padding 24px
Large:      max-w-[1400px] con padding 32px (non più largo, leggibilità)
```

**Grid System**:
- CSS Grid per layout complessi
- Flexbox per componenti semplici
- Tailwind grid utilities

---

### Border Radius

**Sistema coerente** (bordi sottili, raggio moderato):

```
None:   0px
SM:     4px   (input, badge piccoli)
MD:     6px   (card, button standard) - Moderatamente arrotondati
LG:     8px   (card grandi, modal)
XL:     12px  (card molto grandi)
Full:   9999px (pill, avatar, badge arrotondati)
```

**⚠️ Principio**: Bordi sottili, raggio moderato. Non esagerare con border radius.

---

### Shadow (Elevation)

**⚠️ Principio**: Ombre diffuse e leggere, NON pesanti (no drop shadows anni 2010)

**Gerarchia elevazione** (ombre impercettibili):

```
None:    shadow-none
SM:      shadow-sm   (0 1px 2px rgba(0,0,0,0.05)) - Sottilissime, impercettibili
MD:      shadow      (0 1px 3px rgba(0,0,0,0.06)) - Diffuse, leggere
LG:      shadow-lg   (0 4px 6px rgba(0,0,0,0.07)) - Leggere, non pesanti
XL:      shadow-xl   (0 10px 15px rgba(0,0,0,0.08)) - Massima, ma sempre leggere
```

**Uso**:
- **SM**: Hover states, sottilissime
- **MD**: Card standard (ombra impercettibile)
- **LG**: Modal, dropdown (ombre leggere)
- **XL**: Solo per elementi molto importanti (ma sempre leggere)

**Evitare**: Ombre pesanti, drop shadows pronunciate, anni 2010 style

---

## 🧩 COMPONENTI UI

### Component Library: shadcn/ui

**Scelta**: shadcn/ui + Tailwind CSS (già approvato nello stack)

**Razionale**:
- Componenti moderni e professionali
- Copy-paste (no dipendenza npm pesante)
- Personalizzabili con Tailwind
- Accessibilità built-in (Radix UI)
- Coerente con best practice 2025

---

### Componenti Chiave

**Cards (Il Mattone Base)**:
- **Tutto è una card**:
  - Sfondo bianco
  - Bordo grigio chiaro sottile
  - Angoli leggermente arrotondati (non esagerare, 6-8px)
  - Ombra quasi impercettibile (ombra leggera)
  - Padding interno generoso (multiplo di 8)
- Se è cliccabile: al hover bordo più scuro e ombra leggermente più evidente
- Header, body, footer opzionali

**Button - Tre Tipi**:
- **Primario** (azione principale): Pieno del colore brand, testo bianco
- **Secondario** (azione alternativa): Bianco con bordo, testo grigio
- **Ghost** (azione terziaria): Trasparente, testo grigio, appare sfondo al hover

**Stati Importanti**:
- **Hover**: sempre un feedback visivo (colore più scuro)
- **Disabled**: grigio, cursor che dice "no"
- **Loading**: spinner + leggera trasparenza
- Dimensioni: sm, md, lg (altezze multipli di 8: 32px, 40px, 48px)
- Icone supportate (prima/dopo testo)

**Input Fields**:
- Altezza confortevole (non schiacciati, multipla di 8)
- Bordo grigio che diventa blu (colore brand) al focus
- **Label sempre sopra** (mobile-friendly)
- Asterisco rosso per campi obbligatori
- Messaggio errore rosso sotto se c'è problema
- Varianti: default, error, disabled
- Supporto icona (prima/dopo), helper text

**Table (Tabelle "Ricche" - Il Cuore del Gestionale)**:

**Le tabelle sono l'80% del lavoro quotidiano, quindi massima cura**:

**Header Tabella**:
- Sfondo grigio chiaro
- **Sticky**: Resta visibile scrollando (non scompare mai)
- Testo piccolo maiuscoletto (text-xs uppercase)
- Cliccabile per ordinare

**Righe Dati**:
- Sfondo bianco
- Al hover: sfondo grigio chiarissimo
- Bordi orizzontali sottili tra righe
- **Numeri allineati a destra** (con tabular-nums)
- Azioni (modifica/elimina): sempre visibili o al hover (preferibile hover per pulizia visiva)
- **Badge di Stato**: "Pillole" arrotondate per stati ([Pagato], [Spedito], [Reso])

**Dettagli Importanti**:
- Checkbox per selezione multipla
- Icone colorate solo se significative (es. triangolo rosso = scorta bassa)
- Densità regolabile (righe più o meno alte)
- Stripe alternati per leggibilità (zebra striping)
- Responsive (scroll orizzontale su mobile o card view)

**Modal/Dialog**:
- Overlay con backdrop blur
- Animazione fade-in
- Focus trap
- Chiudibile con Esc

**Toast/Notification**:
- Posizioni: top-right (default), top-center, bottom-right
- Varianti: success, error, warning, info
- Auto-dismiss con timer
- Dismiss manuale

**Badge (Pillole di Stato)**:
- Varianti: default, secondary, destructive, outline
- Dimensioni: sm, md
- Forma: Pill arrotondate (border-radius full)
- Uso: Stati ordini ([Pagato], [Spedito], [Reso])

**Dropdown Menu**:
- Animazione slide-down
- Keyboard navigation
- Separatori per raggruppamenti

---

### Pattern UI Specifici

**Dashboard "Bento Grid"** (layout ispirato ai portapranzo giapponesi):
- **Layout modulare**: Blocchi rettangolari ben definiti
- **Esempio**: Blocco grande quadrato per grafico fatturato, due blocchi rettangolari piccoli per "Ultimi ordini" e "Cassa attuale"
- **Responsive per natura**: Si adatta automaticamente
- **No grafici sparsi**: Tutto organizzato in griglia modulare
- Card con shadow leggera (non media)

**Data Table Intelligente** (Tabelle "Ricche"):
- **Sticky Header**: Intestazione fissa quando scroll (non scompare mai)
- **Hover Actions**: Azioni (Modifica/Cancella) mostrate solo al passaggio del mouse
- **Badge di Stato**: Pillole arrotondate per stati ([Pagato], [Spedito])
- Modifica inline (doppio click)
- Filtri persistenti visibili
- Export button sempre visibile
- Paginazione server-side

**Form Wizard**:
- Progress indicator chiaro
- Step navigation (avanti/indietro)
- Validazione step-by-step
- Salvataggio bozza

**Command Palette (Cmd+K)**:
- Overlay full-screen con backdrop
- Input ricerca in alto
- Risultati categorizzati
- Keyboard navigation (arrow keys, Enter)
- Animazione slide-up

**Sheet/Drawer Laterale**:
- **Invece di modali centrali**: Pannello che scorre da destra
- **Mantiene contesto**: Utente vede ancora la lista sotto mentre modifica
- **Per modifiche dettagli**: Modificare un prodotto/ordine senza perdere vista lista
- Animazione slide-in da destra

---

## 🌓 DARK MODE

### Implementazione

**Approccio**: CSS Variables + Tailwind dark mode

**Toggle**:
- Switch nella header/settings
- Preferenza salvata (localStorage)
- Rispetta preferenza sistema (preferenza utente > sistema)

**Principi**:
- Background scuro ma non nero (#0f172a)
- Contrasti adeguati (WCAG AA minimo)
- Coerenza palette colori (stessi colori semantici)
- Transizione fluida tra light/dark

---

## 📱 RESPONSIVE DESIGN

### Breakpoints (Tailwind Standard)

```
sm:   640px   (mobile landscape)
md:   768px   (tablet)
lg:   1024px  (desktop)
xl:   1280px  (large desktop)
2xl:  1536px  (extra large)
```

---

### Mobile-First Approach

**⚠️ Non Adattare Desktop, Ripensare**: Mobile non è "desktop schiacciato"

**Principi**:
1. Progettare prima per mobile (320px+)
2. Progressive enhancement per desktop
3. Touch target minimo 44x44px
4. Layout verticale ottimizzato

**Breakpoint Mentali**:
- **Mobile**: Stack tutto verticalmente, un elemento alla volta
- **Tablet**: Ibrido, sidebar collassabile
- **Desktop**: Layout completo con sidebar sempre visibile

**Adattamenti Mobile** (magazziniere in piedi):

**Navigation - "Thumb Zone"**:
- **Bottom Bar** (navigazione in basso), NON hamburger menu in alto
- **Perché**: Più facile da raggiungere col pollice
- **Elementi principali** visibili in bottom bar
- Alternativa: Hamburger menu se bottom bar non possibile

**Bottoni Grandi**:
- **Bottoni critici**: "Scansiona", "Conferma Carico" larghi quanto lo schermo
- **Altezza minima**: 48px (multiplo di 8, non 40px)
- **Perché**: Chi lavora in magazzino ha fretta e dita grosse (o guanti)
- **Azioni principali sempre raggiungibili col pollice**

**Altri adattamenti**:
- Sidebar diventa menu hamburger o bottom nav
- Table: scroll orizzontale o card view (non tabella schiacciata)
- Form: stack verticale, input più grandi (tocco dita), full-width
- Button primari: full-width su mobile
- Modal: full-screen su mobile

---

### Tablet (768px - 1024px)

**Ottimizzazioni**:
- Layout a colonne (2-3 colonne dove utile)
- Navigation: sidebar collassabile
- Form: 2 colonne quando possibile
- Table: scroll orizzontale se necessario

---

### Desktop (1024px+)

**Ottimizzazioni**:
- Navigation: sidebar sempre visibile
- Layout multi-colonna (dashboard)
- Form: 2-3 colonne quando logico
- Table: tutte colonne visibili
- Hover states attivi

**⚠️ Responsive Vero**: Testa su device veri, non responsive finto

---

## ♿ ACCESSIBILITÀ

### WCAG 2.1 Level AA (Minimo)

**Contrasti**:
- Testo normale: minimo 4.5:1
- Testo grande (18px+): minimo 3:1
- Componenti UI: minimo 3:1

**Navigazione**:
- Tutto accessibile da tastiera
- Focus visible (ring outline)
- Skip to content link
- Logical tab order

**Screen Reader**:
- ARIA labels appropriati
- Landmark regions (header, nav, main, footer)
- Alt text per immagini
- Form labels associati

**Touch**:
- Target minimo 44x44px (multiplo di 8: 48px è meglio)
- Spaziatura adeguata tra elementi cliccabili
- No hover-only interactions su mobile (tutto cliccabile/tappabile)

**Contrasto Testo**:
- Testo normale su sfondo: contrasto alto
- Testo piccolo: contrasto ancora più alto
- Mai testo grigio chiaro su sfondo bianco

**Focus Visibile**:
- Quando navighi con TAB, deve essere chiarissimo dove sei
- Anello blu (colore brand) intorno all'elemento focalizzato
- Mai togliere l'outline senza sostituirlo

---

## ⚡ ANIMAZIONI E TRANSIZIONI

### Principi

**Razionale**: Animazioni sottili migliorano UX senza rallentare.

**Linee Guida**:
- Durata: 150-300ms (veloce, non invasiva)
- Easing: ease-out o ease-in-out
- No animazioni eccessive
- Respect prefers-reduced-motion

---

### Micro-Interazioni che Fanno la Differenza

**Principio**: Ogni azione deve dare feedback immediato

**Ogni Azione Deve Dare Feedback**:
- **Click bottone** → Loading spinner (non solo trasparenza)
- **Salvataggio riuscito** → Toast verde in alto a destra "Salvato!"
- **Errore** → Toast rosso con messaggio chiaro
- **Caricamento dati** → Skeleton (grigio che pulsa) nella forma del contenuto

**1. Skeleton Loading**:
- **Non rotellina che gira**: Mostra "scheletro" grigio della tabella/card
- **Riduce percezione attesa**: Utente vede struttura mentre carica
- **Esempio**: Griglie grigie animate per tabella durante caricamento

**2. Toasts (Notifiche)**:
- **Popup nero in alto a destra** (o basso a destra): "Prodotto salvato ✓"
- **Auto-dismiss**: Sparisce dopo 3 secondi
- **Conferma immediata**: Utente sa che azione è completata
- **Varianti**: Success (verde), Error (rosso), Warning (amber), Info (blu)

**3. Stati di Hover**:
- Praticamente tutto ciò che è cliccabile deve reagire al passaggio del mouse:
  - Bottoni: colore più scuro
  - Righe tabelle: sfondo grigio chiarissimo
  - Cards: ombra più evidente (leggermente)
  - Link: underline o colore diverso

**4. Transizioni Morbide**:
- Tutti i cambiamenti visivi (hover, focus, apertura/chiusura) devono avere una breve transizione fluida
- Non brusco
- Durata: 150-200ms (veloce ma percepibile)

**5. Sheet/Drawer Laterali**:
- **Pannello che scorre da destra**: Invece di aprire nuove pagine o modali centrali
- **Mantiene contesto**: Utente vede ancora lista sotto mentre modifica
- **Per modifiche dettagli**: Prodotti, ordini, clienti
- Animazione slide-in fluida

---

### Transizioni Standard

```css
Fast:     150ms ease-out    (hover, focus)
Medium:   200ms ease-out    (modal, dropdown)
Slow:     300ms ease-in-out (page transition)
```

**Uso**:
- Hover states: 150ms
- Modal/Dropdown: 200ms
- Page transitions: 300ms (se implementate)

---

## 🎯 STILE SPECIFICO PER TARGET

### Per Utenti Privati

**Approccio**: Semplicità massima, meno elementi visivi.

**Caratteristiche**:
- Dashboard più semplice (meno widget)
- Menu semplificato
- Terminologia accessibile (no gergo tecnico)
- Wizard e onboarding più guidati

---

### Per Aziende

**Approccio**: Professionale e completo, senza compromettere semplicità.

**Caratteristiche**:
- Dashboard completa con tutti i widget
- Menu completo con tutte le sezioni
- Terminologia professionale dove necessario
- Report e analytics più dettagliati

**Nota**: Stessa base visiva, interfaccia adattiva (come già definito)

---

## 📊 ESEMPI VISUALI

### Dashboard "Buongiorno"

**Layout**:
```
┌─────────────────────────────────────┐
│  Buongiorno! 👋                     │
├─────────────────────────────────────┤
│  ┌─────┐  ┌─────┐  ┌─────┐         │
│  │💰   │  │📦   │  │⚠️    │         │
│  │Cassa│  │Ordini│  │Alert │         │
│  │1.5K │  │   3 │  │   5 │         │
│  └─────┘  └─────┘  └─────┘         │
│                                     │
│  [Ordini da spedire oggi]          │
│  ┌─────────────────────────────┐   │
│  │ #123 - Cliente A    [Vedi] │   │
│  │ #124 - Cliente B    [Vedi] │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Caratteristiche**:
- Card con shadow media
- Numeri grandi e chiari
- Icone semantiche
- Azioni dirette (pulsanti evidenti)
- Spazi bianchi generosi

---

### Tabella Intelligente

**Layout**:
```
┌────────────────────────────────────────┐
│ [🔍 Cerca...] [Filtri ▼] [Export Excel]│
├────────────────────────────────────────┤
│ Nome    │ Categoria │ Prezzo │ Azioni  │
├────────────────────────────────────────┤
│ Prodotto│ Elettron. │ 29.99€ │ [✏️][🗑️]│
│ Prodotto│ Abbigliam │ 19.99€ │ [✏️][🗑️]│
└────────────────────────────────────────┘
```

**Caratteristiche**:
- Header fisso con azioni
- Righe alternati (zebra striping)
- Hover state chiaro
- Azioni inline visibili
- Export sempre accessibile

---

## 🔧 IMPLEMENTAZIONE TECNICA

### Stack Design

**Come implementato**:
- **shadcn/ui**: Componenti base
- **Tailwind CSS**: Utility classes, customizzazione
- **CSS Variables**: Per theming (light/dark)
- **Radix UI**: Primitives accessibili (usato da shadcn)

**File Struttura**:
```
/app/globals.css          → CSS variables, base styles
/app/components/ui/       → shadcn/ui components
/app/lib/utils.ts         → cn() utility (class merging)
```

---

### Theming

**CSS Variables** (per customizzazione futura):

```css
:root {
  --primary: 37 99 235;      /* Blue 600 */
  --secondary: 100 116 139;  /* Slate 500 */
  --success: 16 185 129;     /* Green 500 */
  --warning: 245 158 11;     /* Amber 500 */
  --error: 239 68 68;        /* Red 500 */
  
  --background: 255 255 255;
  --foreground: 15 23 42;
  --border: 226 232 240;
  --muted: 248 250 252;
}

.dark {
  --background: 15 23 42;
  --foreground: 248 250 252;
  --border: 51 65 85;
  --muted: 30 41 59;
}
```

---

## ✅ CHECKLIST IMPLEMENTAZIONE

**Da rispettare sempre**:
- [ ] Contrasti WCAG AA
- [ ] Touch target minimo 44x44px
- [ ] Keyboard navigation completa
- [ ] Dark mode funzionante
- [ ] Responsive mobile-first
- [ ] Feedback immediato azioni
- [ ] Loading states eleganti
- [ ] Error states chiari
- [ ] Empty states informativi
- [ ] Spazi bianchi generosi
- [ ] Gerarchia visiva chiara

---

## 📝 NOTE IMPLEMENTAZIONE

**Principi da Rispettare**:
- Design moderno + UX semplice
- Professionalità visiva + semplicità d'uso
- Coerenza con shadcn/ui + Tailwind
- Allineato a best practice 2025
- Accessibile e inclusivo
- Velocità percepita alta

**Customizzazione Futura**:
- Palette colori personalizzabile (CSS variables)
- Font personalizzabile (se necessario)
- Brand identity applicabile facilmente

---

---

## 📋 RIEPILOGO INTEGRAZIONE INDICAZIONI GEMINI

### Filosofia: "Clean SaaS" / "Linear-Style Design"

**Parola chiave**: **"Data Density with Breathing Room"** (Densità di dati con spazio per respirare)

**Stile di riferimento**: Linear, Stripe, Vercel (app moderne B2B di fascia alta)

---

### ⚠️ Cosa EVITARE Assolutamente

1. ❌ **Ombre pesanti**: Drop shadows anni 2010 → Usa ombre diffuse e leggere
2. ❌ **Troppi bordi**: Non mettere bordi a tutto → Spesso basta sfondo diverso o spazio bianco
3. ❌ **Contrasto basso**: Grigio chiaro su bianco è elegante ma illeggibile → Testo principale quasi nero (slate-900)
4. ❌ **Font obsoleti**: Arial, Times New Roman → Usa font moderni (Inter o Geist Sans)

---

### ✅ Cosa IMPLEMENTARE (da Gemini)

**1. Font Moderni**:
- **Inter** (standard industriale, pulitissimo) - RACCOMANDATO
- **Geist Sans** (font di Vercel, modernissimo e tecnico)
- ❌ NO Arial o Times

**2. Tabular Nums (CRUCIALE)**:
- Attivare `font-variant-numeric: tabular-nums` per TUTTI i numeri
- **Perché**: Allineamento perfetto verticale virgole e cifre nelle liste prezzi
- **Senza questo**: Liste prezzi sembrano amatoriali

**3. Colori Semantici**:
- **Stati funzionali con toni pastello**: Sfondo pastello (es. green-50), testo scuro (es. green-800)
- **Rosso desaturato**: Non rosso acceso (ansiogeno), ma rosso desaturato (red-600)
- **Un solo brand color forte**: Per bottoni CTA (es. "Nuova Fattura")
- **Grigi**: Usa scala Slate o Zinc (Tailwind) per bordi e testi secondari

**4. UI Patterns Specifici**:

**A. Tabelle "Ricche"**:
- Sticky Header (non scompare mai)
- Azioni al hover (mostra "Modifica/Cancella" solo al passaggio mouse)
- Badge di stato: "Pillole" arrotondate ([Pagato], [Spedito], [Reso])

**B. Dashboard "Bento Grid"**:
- Layout modulare: blocchi rettangolari ben definiti
- Esempio: Blocco grande per grafico fatturato, due piccoli per "Ultimi ordini" e "Cassa"
- Modulare e responsive per natura

**C. Mobile "Thumb Zone"**:
- Navigazione in **Bottom Bar** (non hamburger menu in alto)
- Bottoni critici larghi quanto schermo, alti 48px minimo
- Per magazzinieri: dita grosse o guanti, fretta

**5. Micro-Interazioni**:
- **Skeleton Loading**: Griglia grigia animata, non rotellina
- **Toasts**: Popup nero basso a destra, auto-dismiss 3 secondi
- **Drawer Laterali**: Pannello che scorre da destra, mantiene contesto lista

---

## 🎨 ICONE - Minimaliste e Consistenti

### Una Famiglia Sola

**Scegli un set di icone e usa solo quello**.

**Raccomandazione**: 
- **Lucide Icons** (moderno, pulito, grande varietà, molto popolare)
- **Heroicons** (alternativa valida, minimalista)

**⚠️ Cosa Evitare**:
- ❌ Icone inconsistenti: Una famiglia sola
- ❌ Mischiare set di icone diverse (confusione visiva)

### Uso Strategico

- **Navigazione sidebar**: Icona + testo
- **Bottoni azione**: Icona piccola + testo
- **Stato/feedback**: Solo icona con colore semantico
- **Tabelle**: Piccole icone per azioni

### Dimensioni Standard

- **Piccola**: 16px
- **Media**: 20px (default)
- **Grande**: 24px

---

## 📚 RIFERIMENTI PER ISPIRAZIONE

### Per Tabelle e Dati

- **Linear** (gestione issue) - Tabelle perfette
- **Notion** (database view) - Data density ottimale
- **Airtable** (grid) - Layout tabelle

### Per Dashboard

- **Stripe Dashboard** - Layout pulito e professionale
- **Vercel Analytics** - Visualizzazioni dati eleganti

### Per Overall Feeling Professionale

- **Stripe** (se vuoi fare corporate serio)
- **Linear** (se vuoi fare moderno ma pro)
- **Notion** (se vuoi fare accessibile e friendly)

**Principio**: Copia da Stripe, Linear, Notion - sono i migliori esempi.

---

## 📋 RIEPILOGO INTEGRAZIONE INDICAZIONI CLAUDE

### Filosofia: "Clean Corporate Moderno"

**Tre Pilastri**:
1. **Respiro**: Non riempire ogni pixel. Spazi bianchi sono alleati.
2. **Gerarchia Chiara**: L'occhio deve capire immediatamente cosa è importante.
3. **Consistenza Ossessiva**: Ogni bottone, input, card della stessa famiglia.

---

### ⚠️ ERRORI DA NON FARE (da Claude)

❌ **Troppi popup/modal**: Usa inline editing quando possibile  
❌ **Colori ovunque**: Neutralità è eleganza (80% neutri)  
❌ **Campi obbligatori nascosti**: Mostra subito cosa serve  
❌ **Loading senza feedback**: Sempre spinner/skeleton  
❌ **Ombre pesanti**: Sottile è meglio  
❌ **Font troppo piccoli**: Leggibilità prima di tutto  
❌ **Responsive finto**: Testa su device veri  
❌ **Icone inconsistenti**: Una famiglia sola  

---

### ✅ I COMANDAMENTI (TL;DR da Claude)

1. **Spazi bianchi generosi** - respira
2. **Un colore brand** - non un arcobaleno
3. **Gerarchia chiara** - cosa è importante?
4. **Consistenza religiosa** - ogni elemento della stessa famiglia
5. **Feedback immediato** - ogni azione ha reazione visiva
6. **Mobile vero** - non desktop schiacciato
7. **Semplicità** - se in dubbio, togli
8. **Guarda i migliori** - copia da Stripe, Linear, Notion

**L'obiettivo**: Quando l'utente apre Magazz.io pensa "wow, finalmente un gestionale che non sembra fatto nel 2005 e che capisco subito come usare".

---

### 🔧 APPROCCIO IMPLEMENTATIVO (da Claude)

**Usa Tailwind CSS**:
- Ti dà già tutto il design system pronto
- Colori predefiniti ottimi
- Spaziature ad 8
- Responsive facile
- Hover/focus stati automatici

**Usa Componenti Pre-fatti**:
- shadcn/ui o Radix UI ti danno componenti accessibili già pronti
- Personalizza solo lo stile, non reinventare la ruota

**Crea Pattern Riusabili**:
- Una volta deciso come fai un bottone, quello è il tuo bottone
- Componente React riutilizzabile ovunque
- Stesso per card, input, tabella...

---

