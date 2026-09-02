# Le coordinate dei centri sono facoltative: il link Maps e tutta la feature

`coordinate.lat` e `coordinate.lng` erano `required: true` per servire una mappa dei centri
che non e mai stata decisa. La fonte WordPress (40 `tribe_venue`) ha **zero coordinate**: il
campo obbligatorio rendeva l'import impossibile per difendere una pagina che non esiste.

Decisione: coordinate **facoltative**, e `mapsUrl` (il link «condividi» di Google Maps) e la
funzione completa. Un link per sede costa zero, non richiede API key ne consenso cookie, e su
mobile apre l'app di navigazione meglio di qualunque embed.

Se la mappa dei centri verra decisa, la geocodifica one-shot di 40 indirizzi resta possibile
in mezza giornata; il costo di rimandare e quindi basso, quello di bloccare l'import subito
era alto.

## Aggiornamento: la mappa e stata decisa, le coordinate restano facoltative

La pagina `/centri` porta una mappa. **Leaflet** puro (una dipendenza, nessun wrapper React)
con le tile **CARTO Dark Matter**: gratis, nessuna chiave, nessun cookie, e la basemap e gia
grigia e nera, quindi sta dentro il sistema monocromo invece di combatterlo. L'attribuzione
OpenStreetMap e CARTO e visibile sulla mappa, come richiesto da entrambe le licenze.

La geocodifica e uno script una tantum, `pnpm sedi:geocodifica`, che interroga **Nominatim**
(OSM, gratis, una richiesta al secondo) partendo dagli indirizzi gia in CMS e riempie i campi
vuoti. Non gira in build e non gira a runtime.

Il resto di questa decisione **non cambia**: le coordinate restano `required: false` e
`mapsUrl` resta la funzione di navigazione. Un centro senza coordinate resta nell'elenco con
indirizzo e orari e sparisce solo dalla mappa: la mappa e un secondo accesso al dato, mai
l'unico. Chi Nominatim non risolve (indirizzi con «n° 17/A» o «(angolo Via Vitruvio)») si
completa a mano dal pannello, e lo script stampa l'elenco di chi manca.
