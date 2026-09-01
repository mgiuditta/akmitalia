# Il percorso e un corso marcato, non una collection

«Percorso» significava tre cose diverse in tre posti: quattro voci in `PRODUCT.md`, tre colori
del tricolore in `DESIGN.md`, sei destinatari nell'enum `Corsi.target`. I dati importati
sciolgono meta del nodo: i corsi veri sono **tre** (20 slot di Krav Maga regolare, 5 di
antibullismo, 1 di antiaggressione femminile a Muggio) e mappano 1:1 sui tre colori. La quarta
voce di `PRODUCT.md`, la formazione tecnica, non ha corso ne orari; `aziende-ffoo` non esiste
fuori dall'enum.

Decisione: **il percorso non e un'entita separata**. E un corso marcato come voce del primo
bivio, con tre campi nuovi su `corsi`:

- `colore`: enum chiuso sui quattro ruoli di `DESIGN.md`. Il cliente sceglie *quale ruolo*, mai
  *quale colore*. Un color picker qui ucciderebbe la Regola della Bandiera Smontata.
- `inBivio`: booleano, **spento di default**. Un corso nuovo nasce come pagina, non come voce
  di orientamento.
- `domanda`: la riga del bivio in prima persona, visibile solo se `inBivio`.

L'alternativa era una collection `percorsi` in relazione a `corsi`. Scartata: il cliente arriva
da WordPress e deve poter modificare tutto il contenuto, e due entita da tenere allineate a mano
sono esattamente il disordine da cui l'enum lo difende. Con i campi su `corsi` edita una cosa
sola.

Cablare i percorsi nel codice era l'altra alternativa, ed e stata scartata per lo stesso motivo:
avrebbe reso non modificabili anche i nomi e le descrizioni, non solo il numero di colori.

## Conseguenze

- Il primo bivio si interroga: `corsi` dove `inBivio` e vero, ordinati per `ordine`. Nessun
  numero di voci cablato: se il cliente ne accende sei, il danno e suo e reversibile.
- Due percorsi possono condividere un ruolo di colore. Degrada, non rompe: la Regola
  dell'Etichetta vieta gia di identificare un percorso dal solo colore.
- La formazione tecnica sara la quarta voce **quando esistera il corso** che la porta, in
  Inchiostro. Oggi il bivio ne ha tre. E contenuto del cliente, non lavoro di schema.
- Il percorso si sceglie per chi domanda, mai per eta: «crescita dei ragazzi» e la voce del
  genitore e non taglia la fascia 14-17, che il corso regolare copre gia con «Adulti e Ragazzi».
- `target` sopravvive accanto a `colore` e dice un'altra cosa: a chi si rivolge il corso, non
  che ruolo visivo porta.
- Un percorso senza centri attivi resta nel bivio (#24). `inBivio` non si combina mai con il
  conteggio degli orari: un interruttore acceso che non produce una voce sarebbe l'admin che
  mente al cliente. La pagina corso porta il peso della verita', dicendo a parole che il corso
  non e' in calendario e nominando l'ultimo centro che lo teneva.
