# L'elenco dei centri e alfabetico per comune, non raggruppato per provincia

`indirizzo.provincia` e un campo indicizzato e la sua descrizione originale prometteva di
raggruppare l'elenco dei centri. I dati dicono il contrario: dei 40 centri, **27 sono in
provincia di Milano, 6 a Monza-Brianza, 2 a Varese e cinque province hanno un centro solo**
(Lodi, Alessandria, Rimini, Padova, piu Chiasso in Ticino). Un raggruppamento per provincia
produce un blocco da 27 voci e sei intestazioni con una riga sotto: non e un elenco
raggruppato, e un elenco con sei orfani in fondo.

Decisione: l'elenco e **alfabetico per comune, senza sezioni**, come un albo professionale.
La provincia resta come **etichetta** sulla riga (livello Label di `DESIGN.md`) e come
**filtro**, e per questo resta indicizzata: chi legge il codice non deve dedurre da `index: true`
che esista un raggruppamento.

## Conseguenze

- L'indice su `provincia` serve il filtro, non un `groupBy`.
- Se un giorno i centri si distribuiscono davvero sul territorio, il raggruppamento torna
  discutibile: la ragione qui e la distribuzione dei dati, non un principio.
