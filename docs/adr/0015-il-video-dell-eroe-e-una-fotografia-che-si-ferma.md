# Il video dell'eroe e' una fotografia che si ferma

Il cliente vuole poter mettere un video al posto della foto in cima alla home. Lo spot che
ha mandato come esempio e' 848x480, 35 secondi, con audio, e ha sopra lo stemma, una banda
con l'indirizzo del sito, titoli e tendine gialle: sotto il titolo della home si
scontrerebbe con tutto, e ingrandito a tutto schermo si sgrana. La possibilita' serve, quel
file no.

Decisione: **il video e' la fotografia dell'eroe che si muove, non un nuovo elemento.**

- Sta nel global Impostazioni accanto alla foto (`videoHero`), solo MP4, al massimo 12 MB.
- Prende la stessa classe della foto: stesso monocromo, stesso taglio, stesso velo. La
  Regola del Valore non ha un'eccezione per il video.
- La foto resta sotto e fa da copertina. E' lei l'elemento principale del caricamento, e
  resta l'unica cosa visibile a chi ha chiesto meno animazioni o risparmia dati: in quei
  casi il video non si scarica nemmeno.
- Parte muto, in loop, senza controlli nativi, con un solo bottone «Ferma il video» in
  alto a destra. Il bottone non e' facoltativo: un contenuto che si muove da solo per piu'
  di cinque secondi deve potersi fermare (WCAG 2.2.2).
- Con il video acceso la didascalia dell'eroe e' quella del video: dice cosa si vede, e
  cosa si vede non e' piu' la fotografia.
- La guida a cosa caricare, il brief per il videomaker, il comando ffmpeg e il prompt per
  un generatore stanno nell'admin, sopra i due campi, e non in un documento a parte: chi
  carica il file la legge mentre lo carica.

## Il repertorio del movimento passa a sei voci

La Regola dell'Indice chiude il repertorio. Il loop del video non scandisce un elenco, ma
non e' coreografia: e' contenuto, come la foto che sostituisce. Entra come sesta voce a
condizione che resti lento, senza tagli rapidi e senza lampi, e che si fermi.

## Lasciato fuori

Un secondo file per il telefono e le versioni WebM o AV1. Si aggiungono se un MP4 da 8 MB
a 1080p si rivela troppo pesante sulla rete mobile.
