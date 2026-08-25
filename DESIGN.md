---
name: AKM Italia
description: Accademia di Krav Maga in Lombardia — struttura Redox/Arrox, colori riportati al brand AKM (nero/carbone/bianco/rosso/verde)
colors:
  primary-text: "#FAFAFA"
  secondary-text: "#8A8A8A"
  accent-theme: "#E30713"
  accent-secondary: "#00963F"
  surface-bg: "#161616"
  base-bg: "#0B0B0B"
  border-hairline: "rgba(250,250,250,0.1)"
typography:
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontWeight: 400
  hero-display:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontWeight: 500
    lineHeight: 0.9
rounded:
  pill: "50px"
  pill-lg: "100px"
components:
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.primary-text}"
    rounded: "{rounded.pill}"
    padding: "9px 25px"
  button-outline-hover:
    backgroundColor: "{colors.primary-text}"
    textColor: "{colors.surface-bg}"
---

# Design System: AKM Italia

## 1. Overview

**Creative North Star: "The Inherited Studio"**

Il sistema attuale non è stato progettato per AKM Italia: è il tema ThemeForest
Redox (venduto anche come "Arrox — Creative Agency and Portfolio HTML Template"),
importato com'è nella variante dark. Bootstrap 5 + SCSS + GSAP, 14 varianti di
home page e circa 35 pagine di dimostrazione, di cui solo `(home)` è realmente in
uso sul sito pubblico. Il resto (`agency-portfolio`, `creative-agency`,
`design-agency`, `marketing-agency`, `modern-agency`, `startup-agency`,
`portfolio-*`, `parallax-carousal`) resta nel repo come demo del tema, non come
parte del sito live.

La struttura resta quella del tema (Bootstrap 5 + SCSS + GSAP, token via CSS
custom properties in `_variables.scss`), ma i colori non sono più il placeholder
arancio/quasi-nero di Redox: sono stati riportati alla palette reale AKM,
sostituendo ogni occorrenza dei vecchi valori Redox (`#FF6A3A`, `#111111`,
`#171717`, `#999999`, `#555555`) nell'intero albero `public/assets/scss/`.
Il rosso (`#E30713`) e il verde (`#00963F`) sono campionati direttamente dal
logo reale in `public/assets/imgs/logo-akm/akm-italia-nero.jpg` (non più una
stima). Il logo
demo del tema Redox resta in `public/assets/imgs/logo/`, non più referenziato
da header/footer live.
Quello che il sistema **non** ha ancora è un'identità propria dell'accademia:
la libreria tipografica (sei font decorativi da agenzia creativa, pensati per
distinguere 14 home intercambiabili) e i contenuti demo (portfolio, servizi
agenzia) vanno filtrati o sostituiti componente per componente, non ereditati
in blocco.

**Key Characteristics:**
- Dark by default sulla home attiva (`className="dark"` su `MainWrapper`)
- Palette **Full palette a due accenti**: rosso come accento primario (CTA,
  hover, dettagli interattivi), verde tricolore come accento secondario
  usato con parsimonia, su base neutra nero/carbone/bianco
- Bottoni a pillola, bordo pieno 2px, nessuna ombra come linguaggio primario
  di profondità
- Libreria font sovrabbondante (6 famiglie) ereditata da un template
  multi-home, da ridurre quando si passa al restyle vero e proprio

## 2. Colors

Full palette a due accenti: neutri nero/carbone/bianco più un accento primario
rosso (CTA, stati interattivi) e un accento secondario verde, usato con
parsimonia per richiamare il tricolore senza appesantire il tono "serio,
disciplinato" richiesto da PRODUCT.md.

### Primary
- **Bianco Caldo** (`#FAFAFA`, token `--primary` in modalità `.dark`):
  colore del testo primario e degli elementi di UI su sfondo scuro. Mai
  `#FFFFFF` puro (vedi shared design laws).

### Secondary
- **Grigio Neutro** (`#8A8A8A`, token `--secondary` / `--white-2` in `.dark`):
  testo secondario, didascalie, elementi meno prioritari.

### Tertiary
- **Rosso Azione** (`#E30713`, token `--theme` / `--action`): accento
  primario del sistema. Non viene ridefinito da `.dark`, resta identico in
  entrambe le modalità. Usato su CTA, stati hover, dettagli decorativi.
  Campionato dal logo reale.
- **Verde Tricolore** (`#00963F`, token `--accent-secondary`): accento
  secondario, non ancora cablato in componenti — riservato a usi puntuali
  (separatori, dettagli) da introdurre con parsimonia. Campionato dal logo
  reale.

### Neutral
- **Nero Dominante** (`#0B0B0B`, token `--bg` in modalità non-dark e
  `background-color` diretto su `.body-digital-agency.dark`): sfondo
  dominante della home attiva.
- **Carbone Superficie** (`#161616`, token `--bg` in `.dark`): sfondo di
  superfici secondarie (es. `hero-area` in dark mode), un gradino più chiaro
  del nero dominante.
- **Bordo Sottile** (`rgba(250,250,250,0.1)`, token `--border` in `.dark`):
  separatori, contorni deboli su superfici scure.

### Named Rules
**The Primary Accent Rule.** Il rosso (`#E30713`) è il colore che porta
l'azione ("fai questo", "questo è interattivo"): CTA, hover, stati attivi.
Il verde (`#00963F`) è un accento secondario, non un secondo colore-segnale:
usarlo con parsimonia (dettagli, separatori puntuali), mai su CTA o stati
interattivi al posto del rosso. Non introdurre altri colori-segnale senza
aggiornare questo file: il tono "serio, disciplinato" di PRODUCT.md regge
finché l'azione resta segnalata da un solo colore.

## 3. Typography

**Display Font (in uso su `(home)`):** Instrument Sans (variabile
`--font_instrumentsans`), peso 500, `line-height: 0.9`
**Body Font:** DM Sans (variabile `--font_dmsans`)
**Altre famiglie ereditate dal tema, non usate sulla home attiva:** BDO Grotesk,
Tartuffo Trial, TimesNow, Thunder, Sequel Sans Roman/Medium — ciascuna legata a
una delle 14 varianti home del tema Redox/Arrox. Sono caricate globalmente in
`layout.tsx` anche se solo una è realmente usata: costo di peso pagina da
verificare in un futuro `/impeccable audit`.

**Character:** coppia sans-serif neutra e geometrica (Instrument Sans per i
titoli, DM Sans per il corpo). Non decorativa, non calligrafica: si presta bene
al registro "tecnico" richiesto, ma non porta ancora un'identità distintiva
propria dell'accademia.

### Hierarchy
- **Display** (Instrument Sans, 500, clamp fino a ~96px su desktop, scala
  giù fino a 35px su mobile, `line-height: 0.9`): titoli hero, apertura di
  sezione.
- **Body** (DM Sans, 400, dimensione base tema): corpo testo, navigazione, UI.

### Named Rules
**The Two-Family Rule.** Sulla home attiva sono in uso solo due famiglie
(Instrument Sans + DM Sans), anche se il tema ne carica sei. Ogni nuova pagina
costruita sul tema deve attenersi a queste due, non pescare dalle altre quattro
ereditate dalle varianti home inutilizzate.

## 4. Elevation

Sistema sostanzialmente **flat**: nessun `box-shadow` strutturale nei
componenti core (bottoni, header, card). La profondità è comunicata per
contrasto cromatico (superficie carbone `#161616` contro bianco del testo) e
per bordo sottile (`rgba(250,250,250,0.1)`), non per ombra. Le uniche
transizioni legate a `box-shadow` nel tema riguardano il cursore custom
(`_cursor.scss`) e micro-interazioni hover isolate, non un vocabolario di
elevazione sistematico.

### Named Rules
**The Flat-By-Default Rule.** Nessuna superficie ha ombra a riposo. Se serve
profondità, usare bordo sottile o scarto cromatico di background, non
`box-shadow`.

## 5. Components

### Buttons
- **Shape:** pillola (`border-radius: 50px` sul bottone doppio outline/icona,
  `100px` sulla variante piena)
- **Primary (`.rr-btn-group .b` / `.c`):** sfondo trasparente, testo e bordo
  `var(--primary)` (bianco in dark mode), bordo pieno `2px`, padding
  `9px 25px`, font DM Sans 500, `font-size: 18px`
- **Hover / Focus:** l'icona interna ruota (`rotate(-20deg)`) o trasla
  (`translate(-7px, 0)`); transizione `all 0.3s`. Nessun cambio di colore di
  sfondo nello stato hover di base — è un linguaggio di movimento, non di
  colore.
- Coerente con il tono "serio, disciplinato" di PRODUCT.md: la pillola e il
  bordo netto restano professionali, non giocosi; da mantenere così com'è,
  non da rifare da zero.

### Navigation
Header con menu (`meanmenu` per mobile), stile ereditato dal tema, non ancora
riadattato alle 6 voci di navigazione previste da `docs/contenuti.md` (Corsi ·
Centri Tecnici · Krav Maga · Chi Siamo · News · Contatti).

## 6. Do's and Don'ts

### Do:
- **Do** trattare il rosso `#E30713` come accento primario (The Primary Accent
  Rule): il verde `#00963F` resta secondario e usato con parsimonia, niente
  altri colori-segnale senza aggiornare questo file.
- **Do** limitare i nuovi componenti a Instrument Sans + DM Sans (The
  Two-Family Rule), anche se il tema espone altre quattro famiglie.
- **Do** mantenere il sistema flat: bordo sottile o scarto cromatico invece di
  `box-shadow` per comunicare profondità.
- **Do** riusare la forma pillola + bordo 2px dei bottoni: è già coerente col
  registro serio richiesto.

### Don't:
- **Don't** far assomigliare nuove pagine al **sito WordPress attuale**:
  niente 39 pagine frammentate, niente PDF orari, niente due elenchi centri
  disallineati (anti-riferimento diretto da PRODUCT.md).
- **Don't** lasciare che il sito si legga come un **template "creative
  agency" generico**: le 13 varianti home e le pagine portfolio/servizi del
  tema Redox/Arrox sono materiale demo, non destinazioni reali del sito
  AKM — non collegarle dalla navigazione pubblica.
- **Don't** introdurre un'estetica da **palestra/box lotta stereotipata**
  (neon, muscoli in primo piano, tono da combattimento spettacolarizzato):
  il pubblico include bambini, donne e aziende/FFOO.
- **Don't** usare `outline: none` su elementi interattivi senza sostituto
  visibile del focus (vincolo di accessibilità ereditato, non negoziabile).
- **Don't** caricare le quattro famiglie tipografiche non usate (BDO Grotesk,
  Tartuffo Trial, TimesNow, Thunder, Sequel Sans) su pagine nuove finché non
  sono state valutate in un audit di performance.
