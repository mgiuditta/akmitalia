# Il sistema visivo e Fenriz, non l'Albo

`DESIGN.md` portava una north star chiamata «L'Albo»: registro civico, tricolore come
tassonomia a tre percorsi, Fira Sans, neutri tinti verso il verde di marca, superfici piatte
con righe a 1px. Il primo «Don't» di quel documento e la prima anti-reference di `PRODUCT.md`
vietavano esplicitamente il registro da palestra da combattimento.

Il cliente ha chiesto di importare integralmente il sistema di **Fenriz**
(fenriz-gym.com), una palestra di sport da combattimento di Berlino: nero puro e carbone,
bianco, un solo grigio, zero accento cromatico, un display condensato sovradimensionato
(Kenyan Coffee) contro Roboto per tutto il resto, spigolo vivo ovunque, piatto salvo due
componenti.

Decisione: **Fenriz sostituisce l'Albo come sistema attivo**. Non e un innesto parziale, e un
cambio di north star, e le conseguenze si propagano fuori da `DESIGN.md`.

## Cosa cambia

- **Palette**. Quattro ruoli di percorso derivati dal tricolore (Verde AKM, Rosso Mattone,
  Carta, Inchiostro) spariscono. Restano quattro **valori di superficie** senza tinta: Nero
  `#000000`, Carbone `#1C1C1C`, Bianco `#FFFFFF`, Grigio `#E8E8E8`. La Regola della Bandiera
  Smontata non serve piu: senza accento cromatico non c'e bandiera da smontare. La Regola
  dell'Etichetta resta, e diventa piu importante, non meno.
- **Tipografia**. Fira Sans esce, entrano due famiglie. Kenyan Coffee e commerciale (Yellow
  Design Studio) e non licenziabile qui: si sostituisce con **Anton** (OFL 1.1), la scelta che
  il documento sorgente stesso indica per primo. **Roboto** (Apache 2.0, file variabile) fa il
  workhorse. Cadono i quattro pesi 400/500/700/900 dell'Albo, restano i tre di Fenriz:
  300, 400, 700. Cade anche il maiuscoletto vero: Anton non ne ha, e il livello Label si
  ridefinisce su Roboto 700 a corpo piccolo.
- **Neutri**. L'Albo vietava `#000` e `#fff` e chiedeva ogni neutro tinto verso il verde con
  chroma 0.005-0.01. Fenriz usa esattamente `#000000` e `#FFFFFF`. Il divieto e revocato.
- **Elevazione**. L'Albo era piatto salvo risposta a stato. Fenriz e piatto salvo due
  componenti nominati, `button-primary` e `card`, con ombre pesanti dichiarate a riposo.
  Il cromo strutturale resta piatto in entrambi i sistemi.
- **Anti-references**. La prima trappola di `PRODUCT.md` era la palestra MMA tattica. Non e
  piu una trappola: e il registro scelto, ripulito dai suoi cliche. Restano tre trappole.
- **Schema**. `Corsi.colore` diventa `Corsi.superficie`, enum chiuso su
  `nero | carbone | bianco | grigio`. Nessuna migration da riscrivere: non ce ne sono ancora,
  e in sviluppo lo schema si applica con `push`.

## Cosa non cambia

`CONTEXT.md` regge intero: centro tecnico, luogo evento, orario, docente, corso, percorso
restano quello che erano. La decisione di `0003` regge intera: il percorso e ancora un corso
marcato con `inBivio` e `domanda`, cambia solo il nome del campo che porta il ruolo visivo.
I cinque principi di prodotto reggono, con il quinto riscritto: l'estetica e severa per
scelta, il messaggio no.

## Il costo, dichiarato

`PRODUCT.md` motivava il divieto cosi: «se il sito sembra questo, ha gia escluso genitori,
donne e adulti sopra i 40». Quel rischio non e sparito perche la north star e cambiata, e non
lo neutralizza il fatto che Fenriz sia una versione pulita del registro, senza camo, teschi,
stencil o rosso sangue.

Il carico si sposta sul copy e sul dato: sono le parole a tenere bassa la soglia d'ingresso
mentre la tipografia alza la voce. Le pagine che parlano ai pubblici secondari (Kids,
antiaggressione femminile) vanno scritte e riviste con questa consapevolezza, e la prima
implementazione va guardata proprio li, non sull'hero.

L'alternativa era l'innesto parziale, prendere da Fenriz solo geometria, ritmo di sezione e
disciplina dei pesi. Scartata su richiesta esplicita: mezzo sistema non e un sistema, e i due
non sono componibili sul punto che conta, la tinta.

## Conseguenze operative

- `pnpm font:scarica` scarica Anton e Roboto, non piu Fira Sans. I `.ttf` restano fuori dal
  repo.
- `src/app/(frontend)/tokens.css` porta i token esatti del sistema. Il frontend era ancora il
  boilerplate Payload, quindi non c'e codice da riscrivere: e il momento piu economico in cui
  questo cambio potesse arrivare.
- `docs/research/font-candidate.md` e `docs/research/corpus-registri.md` restano come sono:
  sono ricerca fatta, e documentano perche Fira Sans era la scelta giusta *per l'Albo*.
  Non sono piu istruzioni.
- Il wordmark AKM ITALIA resta tricolore: e un vincolo del cliente e l'unico punto in cui il
  colore entra. Non si estende a nulla.
