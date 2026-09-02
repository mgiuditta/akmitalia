# Le voci tornano in riga sopra i 1024px

`docs/adr/0007` ha messo le voci dietro il bottone a ogni breakpoint e ha scritto la
condizione per tornare indietro: «la riga in barra torna sopra i 1200px» quando il menu
smette di essere la strada per navigare. La condizione e' arrivata prima dai dati e dal
cliente che dal log dei clic: a 1440px una barra con il solo bottone «Menu» legge come una
pagina non finita, e il cliente, che viene da WordPress, si aspetta di vedere dove puo'
andare senza aprire niente.

Decisione: **sopra i 1024px le voci stanno in riga nella barra, fra il marchio e la CTA.
Sotto, resta tutto com'era: marchio, CTA, bottone e pannello.**

1024 e non 1200: quattro voci in Roboto 16 e la CTA entrano in 944px di contenuto con
margine, e sotto i 1024px il pannello a foglio funziona gia' bene. Un breakpoint solo,
lo stesso che spegne il pannello.

## Cosa resta di 0006 e 0007

- **Un solo landmark esposto.** Nel DOM ci sono due `<nav aria-label="Principale">`, la
  riga e il pannello, ma il CSS ne tiene in vita una sola per volta con `display: none`,
  che toglie l'altra dall'albero di accessibilita'. Nessuna voce e' letta due volte.
- **Il pannello non cambia.** Ordinali, conteggi, tre fondi, `inert` sul fondale, Escape che
  riporta il fuoco. Cambia solo che sopra i 1024px non esiste.
- **La CTA non si nasconde mai.** Resta in barra a ogni larghezza.
- **Non si anima mai `.barra` ne' `.barra__griglia`.** Il pannello e il velo sono ancora
  figli `fixed` della barra sotto i 1024px.

## Cosa cambia

- **Le voci e la CTA vengono dal global `Navigazione`.** Il cliente le cambia dall'admin.
  I conteggi sotto le voci del pannello restano nel codice, abbinati per indirizzo: una voce
  nuova senza conteggio non mostra il dato, e va bene.
- **La CTA in barra dice «Richiedi informazioni» e porta a /contatti.** «Trova un centro»
  era lo stesso bottone dell'eroe e della sezione centri: tre bottoni, due intenti. Ora
  ogni etichetta ha un intento solo: «Richiedi informazioni» e' il contatto, «Trova un
  centro» sono i centri.
- **Torna un listener di `matchMedia`**, quello che 0007 aveva tolto: chi apre il pannello a
  1000px e allarga la finestra non deve restare con la pagina `inert`. Chiude e basta.
- **GSAP non si scarica sopra i 1024px.** Il pannello non esiste, il warm-up si ferma prima.
- `tests/e2e/barra.e2e.spec.ts`: il caso desktop ora si aspetta la riga visibile e il
  bottone nascosto. Il caso telefono e' invariato.
