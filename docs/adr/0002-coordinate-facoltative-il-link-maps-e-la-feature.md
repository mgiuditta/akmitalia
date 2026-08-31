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
