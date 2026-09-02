# Il calendario e' una griglia del mese resa dal server

La collection `eventi` esisteva dall'import senza una rotta (docs/adr/0011 la lasciava
fuori di proposito). Il vecchio sito WordPress la mostrava con The Events Calendar: vista
mese, vista lista, vista giorno, ricerca per parola, esportazione in Google Calendar e in
`.ics`, e un archivio di 197 eventi in sette categorie.

Decisione: **`/eventi` e' una tabella del mese scritta dal server, con il mese nella URL
(`?mese=2026-09`) e nessun JavaScript.** Sotto la tabella c'e' l'agenda del mese, una riga
per evento. Ogni evento ha una scheda in `/eventi/[slug]`, e ogni centro mostra i propri
eventi futuri sotto gli orari.

## Perche' il server e non un componente

E' la stessa scelta del filtro di `/centri`: la URL e' la verita', l'HTML di un mese arriva
gia' pronto al motore di ricerca e al primo paint, e un link «Mese successivo» e' un link.
Un calendario a componente avrebbe portato una libreria di date, uno stato e un caricamento
per una pagina che cambia una volta al mese.

## Perche' niente viste, ricerca ed export

Gli eventi sono poche decine l'anno e stanno quasi tutti in tre o quattro mesi. La vista
giorno di un giorno con un evento e' la scheda dell'evento; la vista lista e' l'agenda sotto
la griglia; la ricerca per parola su trenta titoli e' Ctrl+F. L'esportazione in calendario
non l'ha chiesta nessuno: quando arrivera' la richiesta e' una rotta da quindici righe.

## L'agenda e' la vista del telefono

Sette colonne di testo in 375px non si leggono. Sotto i 768px la tabella tiene solo i
numeri e un quadrato nero sui giorni pieni, e l'agenda sotto porta tutto: data, orario,
titolo, tipo, dove. E' un solo markup con due CSS, non due componenti.

## Il tipo si scrive, non si colora

Le sette categorie del vecchio calendario diventano il campo `tipo`, che compare come
parola nella scheda e nell'agenda. Nessun colore per categoria: il rosso dice azione e il
verde presenza (docs/adr/0005), e una legenda di sette colori sarebbe un terzo ruolo.
«Oggi» e' un bordo nero intorno al numero, per lo stesso motivo.

## Cosa ne consegue

- La voce «Eventi» entra nella barra come quinta voce, prima di «Contatti»: il tetto di
  cinque di `Navigazione` (docs/adr/0008) esisteva per questo.
- `pnpm importa:eventi` porta dentro gli eventi dal 2024 dall'API REST del vecchio sito,
  come punto di partenza. L'abbinamento al centro e' un'euristica sul nome del luogo: gli
  eventi che non trovano un centro finiscono in `luogo` e si sistemano dall'admin.
- Un evento a mezzanotte e' un evento «senza orario»: nessun flag «tutto il giorno».
