# Design system

> **SUPERATO — 25/08/2026.** Il design system descritto qui sotto (tipografico, token Tailwind v4,
> componenti costruiti da zero) **non viene realizzato**. Si è scelto di importare il template
> ThemeForest **Redox** (variante dark) così com'è: Bootstrap 5 + SCSS + GSAP, 14 home e ~35 pagine.
> Tailwind non è mai entrato nel progetto. Il documento resta come traccia dei vincoli reali
> (mancanza di foto, accessibilità, logo da ricalcare in SVG) che valgono comunque sul tema Redox.


## Il vincolo che decide tutto

Materiale disponibile: **solo i loghi in PNG**. Niente shooting, niente foto professionali,
nessun SVG del marchio.

Un restyle moderno "da palestra" vive di fotografia a tutta pagina. Qui non ce n'è.
Progettare un layout fotografico e riempirlo con le foto sgranate del sito attuale produce
un risultato peggiore del WordPress di partenza. Quindi il design è **tipografico**:
il carattere fa il lavoro che altrove farebbe l'immagine.

> **Da dire al cliente.** Il tetto di questo restyle è la mancanza di foto. Tre o quattro ore
> di shooting in palestra — anche con un fotografo non professionista, purché con luce e
> inquadrature coerenti — alzerebbero il risultato più di qualsiasi lavoro sul codice.
> Il layout è progettato per accogliere le foto dopo, senza rifare nulla.

## Tipografia

| Ruolo | Font | Uso |
|---|---|---|
| Display | **Archivo Black** (alt: Anton) | Titoli grandi, condensati, in maiuscolo. È l'elemento portante. |
| Testo | **Inter** | Corpo, navigazione, UI |

Self-hosted con `next/font/local`. Nessuna chiamata a `fonts.googleapis.com`:
pagina più veloce e un trasferimento dati verso terzi in meno da dichiarare nella privacy policy.

Scala tipografica ampia e con forte contrasto: un `h1` da 72–96px su desktop non è decorazione,
è ciò che sostiene la pagina al posto di una foto.

## Palette

| Token | Valore | Uso |
|---|---|---|
| `--color-nero` | `#0B0B0B` | Sfondo dominante |
| `--color-carbone` | `#161616` | Superfici, card |
| `--color-bianco` | `#FAFAFA` | Testo su scuro |
| `--color-rosso` | `#C8102E` | Accento primario, CTA |
| `--color-verde` | `#009246` | Accento tricolore, **usato con parsimonia** |
| `--color-grigio` | `#8A8A8A` | Testo secondario |

Impostazione **scura**. Tre ragioni: è coerente con un'accademia di difesa personale,
regge senza fotografia meglio di un layout chiaro, e nasconde i limiti dei PNG del logo.

I valori di rosso e verde vanno **campionati dal PNG del logo** prima di essere fissati:
quelli qui sopra sono la stima da schermo, non il colore reale del marchio.

## Grafica al posto delle foto

Il simbolo del logo AKM è una forma geometrica chiusa. Da lì si ricavano gli elementi grafici:

- Il marchio ingrandito e tagliato dal bordo come elemento di sfondo, in `#161616` su `#0B0B0B`
  (visibile ma non invadente)
- Regole orizzontali spesse in rosso a separare le sezioni
- Numerazione grande delle sezioni (`01`, `02`, `03`) in display
- Griglia visibile: le schede centro come blocchi netti, senza ombre né arrotondamenti morbidi

**Slot immagine che degradano.** Ogni componente che accetta una foto (`Centro`, `Corso`, `News`)
mostra, se il campo è vuoto, un blocco colore con l'iniziale o il numero in tipografia display.
Quando arriveranno le foto entreranno negli stessi slot senza toccare il layout.

## Logo

I PNG vanno **ricalcati in SVG** (ricalco manuale, ~1h). Un logo raster su schermo retina si vede,
ed è la prima cosa che il cliente nota. Servono tre varianti: positivo, negativo, solo simbolo (favicon).

## Componenti base

Pochi, riusati ovunque:

`Button` · `Card` · `Section` · `Nav` · `Footer` · `Accordion` · `OrarioTable` · `ImageSlot` · `Prose`

`Accordion` usa `<details>`/`<summary>` nativi: sono accessibili da tastiera, funzionano senza
JavaScript e non richiedono librerie. Il sito attuale usa un accordion Elementor per fare la stessa cosa.

## Accessibilità — non negoziabile

- Contrasto minimo AA (4.5:1) verificato sui token, non stimato a occhio.
  Attenzione al rosso `#C8102E` su nero: **va usato per elementi grandi o con bordo, non per testo piccolo**.
- Focus visibile su tutto ciò che è interattivo. Mai `outline: none` senza sostituto.
- Navigazione completa da tastiera, skip link a inizio pagina.
- Tutte le immagini con `alt` — obbligatorio nel CMS, non opzionale.
- `prefers-reduced-motion` rispettato: niente animazioni allo scroll per chi le ha disattivate.

## Gate di approvazione

Prima di costruire il resto del sito si realizza **solo la homepage**, completa e navigabile,
e la si mostra al cliente. Un restyle completo approvato a parole e bocciato a cose fatte
è la modalità più costosa di sbagliare.
