# Product

## Register

brand

## Users

Quattro segmenti in parallelo, nessuno prevale:

- **Genitori** che cercano corsi per figli (antibullismo bambini, ragazzi)
- **Adulti e donne** che cercano autodifesa (Krav Maga adulti, Donna Sicura)
- **Aziende e Forze dell'Ordine** che cercano corsi speciali/formazione
- **Praticanti esistenti** che cercano orari e centro più vicino

La home deve smistare bene tra questi profili senza far prevalere nessuno. Il job da
completare quasi sempre è: trovare il centro/corso giusto e i suoi orari, o farsi
un'idea sull'accademia prima di preiscriversi.

## Product Purpose

Restyle del sito di AKM Italia (accademia di Krav Maga con ~20 centri tecnici in
Lombardia), da WordPress/Elementor a Next.js + Payload CMS. Riduce 39 pagine
frammentate a 9, unifica i due elenchi centri disallineati (pagina vs dropdown form)
in un'unica collezione `centri` filtrata su `attivo: true`. Successo = un genitore o
un adulto interessato trova in pochi click il centro più vicino con orari corretti,
e si preiscrive dal form; l'accademia gestisce contenuti (centri, corsi, docenti,
news, eventi) dal CMS senza intervento tecnico.

## Brand Personality

Serio, disciplinato, tecnico. Tono da accademia di difesa personale: autorevole,
essenziale, poco decorativo. Non urla, non decora, non intrattiene: comunica
competenza e disciplina attraverso tipografia e struttura, non attraverso
fotografia patinata o effetti da agenzia creativa.

## Anti-references

- **Il sito WordPress attuale**: 39 pagine frammentate, due elenchi centri
  disallineati, PDF orari, dropdown scoordinato, accordion Elementor.
- **Template "creative agency" generico**: il progetto ha importato Redox
  (ThemeForest, tema dark Bootstrap/GSAP pensato per agenzie creative/portfolio).
  L'estetica di base — home multiple intercambiabili, portfolio, effetti scroll
  decorativi — va pesantemente ripulita e riorientata: non deve leggersi come
  "un'altra landing page da agenzia".
- **Palestre/box lotta stereotipate**: niente estetica MMA aggressiva da neon,
  muscoli in primo piano, tono da combattimento spettacolarizzato. Il target
  include bambini, donne e aziende/FFOO, non solo atleti.

## Design Principles

1. **La tipografia sostiene ciò che altrove farebbe la fotografia.** Materiale
   fotografico disponibile: solo loghi PNG, nessuno shooting professionale.
   Scala tipografica ampia e con forte contrasto porta il peso visivo.
2. **Un'unica fonte di verità per i centri.** Ogni vista (elenco, dropdown form,
   dettaglio) legge dalla stessa collezione `attivo: true`: mai più liste che
   divergono.
3. **Smistamento senza gerarchia forzata.** Nessuno dei quattro segmenti utente
   deve sembrare un ripiego rispetto agli altri nella navigazione o in home.
4. **Meno pagine, contenuto più denso.** Consolidare pagine che si contendono le
   stesse chiavi di ricerca (es. le 9 pagine storia del Krav Maga → 1 pagina con
   indice laterale) invece di frammentare.
5. **Serietà prima di decorazione.** Ogni elemento ereditato da Redox (effetti
   scroll, portfolio, home multiple) va giustificato dal contenuto reale
   dell'accademia o rimosso.

## Accessibility & Inclusion

WCAG AA come standard, nessun requisito aggiuntivo formale. Vincoli concreti già
noti dal precedente DESIGN.md e da tenere validi sul tema Redox:

- Contrasto minimo 4.5:1 verificato sui token, non stimato a occhio.
- Focus visibile su tutto ciò che è interattivo; mai `outline: none` senza sostituto.
- Navigazione completa da tastiera, skip link a inizio pagina.
- Tutte le immagini con `alt`, obbligatorio nel CMS.
- `prefers-reduced-motion` rispettato: gli effetti scroll/GSAP ereditati da Redox
  vanno disattivati per chi li ha disabilitati.
