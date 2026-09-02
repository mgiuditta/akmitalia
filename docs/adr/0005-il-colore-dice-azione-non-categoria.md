# Il colore dice azione, non categoria

`docs/adr/0004` ha portato dentro il sistema di Fenriz e con esso lo zero accento cromatico:
la gerarchia si costruisce scambiando il valore di superficie (`#000000` → `#1C1C1C` →
`#E8E8E8`/`#FFFFFF`), mai la tinta. `DESIGN.md` lo scriveva in tre punti: la Regola del Valore,
la Regola del Rosso Assente e un «Don't introdurre un accento cromatico. Niente verde, niente
rosso, niente tricolore fuori dal wordmark».

Il committente ha chiesto di vedere il rosso e il verde AKM dentro il sito. La richiesta e
legittima e non e negoziabile: il marchio e tricolore, e un sito che non porta mai i colori
del proprio stemma li smentisce.

Il rischio non e il colore in se, e il ritorno della **tassonomia cromatica** che `0004`
aveva appena rimosso: quattro percorsi, quattro tinte, e il lettore che deve ricordare che
verde vuol dire ragazzi. Quella era la Regola della Bandiera Smontata dell'Albo, ed e morta
per una ragione.

Decisione: **il colore entra come segno semantico, non come tassonomia.** Due ruoli e basta,
nessun terzo.

## Cosa cambia

- **Rosso `#E30917` = azione.** Superficie del solo `bottone--primario`, con l'etichetta in
  bianco (4.86:1, sopra AA) e `#B00711` per hover e active (7.28:1). Non tocca nessuna
  superficie di sezione, nessun titolo, nessun bordo.
- **Verde `#00B44B` = presenza.** Solo segnale di dato vivo: il centro attivo in questa
  stagione, il marker sulla mappa, il conteggio dei centri che tengono un percorso. Su fondo
  chiaro passa a `#006B2C`, perche il verde chiaro su bianco si ferma a 2.75:1.
- **Filetto tricolore.** Una banda da 3px verde/bianco/rosso chiude la barra in fondo e apre
  le sezioni di testata. E decorativa, sta in un pseudo-elemento o porta `aria-hidden`, e non
  veicola mai informazione.
- **La Regola del Rosso Assente diventa la Regola del Colore Semantico.** Le altre regole di
  `DESIGN.md` restano intatte, e due in particolare vincolano questa: la **Regola del Valore**
  continua a governare la gerarchia (il colore non e mai il modo per distinguere due sezioni)
  e la **Regola dell'Etichetta** continua a imporre il nome scritto (il pallino verde non e mai
  solo, porta sempre la parola «Attivo»).
- **I quattro valori di superficie non cambiano.** `Corsi.superficie` resta senza tinta e i
  percorsi restano indistinguibili dal colore. Questo ADR **integra** `0004`, non lo supera.

## Il costo

Il tema del sito e la sicurezza personale, e `PRODUCT.md` chiede esplicitamente di togliere
paura, non di aggiungerla: un rosso saturo su quel tema puo leggere come allarme. E il motivo
per cui il rosso e confinato all'azione, dove significa «premi qui», e non tocca mai una
superficie estesa. Se in revisione la home dovesse leggere come un avviso di pericolo, la
mossa non e smorzare il rosso a un bordeaux: e ridurre quanti bottoni primari stanno nella
stessa schermata.

Secondo costo, minore: il verde ha ora due valori (`#00B44B` su scuro, `#006B2C` su chiaro)
perche uno solo non regge AA su entrambe le superfici. Sono due token e non un tema chiaro:
il sistema resta dark-first come stabilito in `0004`.
