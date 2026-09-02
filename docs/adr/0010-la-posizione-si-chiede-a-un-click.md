# La posizione si chiede a un click, mai al caricamento

Il visitatore primario arriva da telefono, di sera, e cerca **una sede raggiungibile**
(`PRODUCT.md`). Quindici centri in ordine alfabetico per comune sono l'elenco giusto
(`docs/adr/0001`) ma non rispondono alla domanda che ha in testa, che e' «quale mi resta
comodo».

La richiesta iniziale era di chiedere la posizione all'ingresso. Non si fa, per due motivi
che tirano nella stessa direzione:

- **Meccanico.** Un permesso chiesto senza che l'utente abbia fatto niente e' quello che i
  browser trattano peggio: Chrome blocca il prompt dopo un rifiuto e non lo ripropone,
  quindi un no dato al primo secondo chiude la funzione per sempre.
- **Di merito.** Il tema del sito e' la sicurezza personale. Un sito che chiede dove sei
  prima ancora di dirti chi e' aggiunge esattamente il disagio che `PRODUCT.md` chiede di
  togliere.

Decisione: **la posizione si chiede quando l'utente preme «Trova il centro più vicino»,
e mai al caricamento.** Il bottone sta in `/centri` accanto ai filtri di provincia. In home
il bottone e' un link a `/centri?vicino=1`, e quel parametro fa partire la richiesta
all'arrivo: e' lo stesso gesto dell'utente, su due pagine, non un prompt automatico.

## Cosa succede con la posizione

- L'elenco si riordina per distanza. I centri senza coordinate si accodano invece di
  sparire: `docs/adr/0002` resta valido.
- Ogni riga porta «a 3,4 km da te», e la prima porta anche la parola «Il più vicino a te».
  Il centro piu' vicino non e' identificato dalla sola posizione nell'elenco.
- La mappa inquadra quel centro, il cui marker prende il segno pieno e il nome del comune
  scritto accanto (Regola dell'Etichetta).

## Cosa succede senza

L'ordine alfabetico e' il default e resta raggiungibile. Permesso negato, posizione non
disponibile e attesa si dicono a parole in una regione `aria-live`: il rosso e' gia'
impegnato a dire «premi qui» e non puo' dire anche «attento» (`docs/adr/0005`).

## Il dato

La posizione resta nel browser. Serve a ordinare un elenco gia' presente in pagina, non
viene mandata al server, non finisce in nessuna richiesta e non tocca `richieste`. L'unica
traccia e' la `sessionStorage` del browser, che si svuota chiudendo la scheda ed esiste per
non richiedere il permesso a ogni navigazione. E' scritto nella pagina privacy, perche' una
cosa che non facciamo va detta quanto una che facciamo.

Il calcolo e' `distanzaKm` in `src/componenti/dati.ts`: emisenoverso, Terra sferica. Su una
regione larga 150 km l'errore sta sotto lo 0,5%, e serve a ordinare quindici righe.
