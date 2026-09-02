# Il build puo' fare a meno del database

Tutte le rotte pubbliche hanno `revalidate`, quindi `next build` le prerenderizza, e per
farlo interroga Payload davvero: diciotto centri, tre percorsi, quaranta pagine
editoriali, piu' i tre global che compongono barra e piede. Con il database spento il
build non degrada, si ferma: «Failed to collect page data».

Finche' il rilascio e' stato `docker compose` su una macchina sola la cosa reggeva: si
alzava `db`, poi si costruiva, e il `Dockerfile` passava `host.docker.internal` come
stringa di connessione. Su Coolify no. Il container che costruisce l'immagine non sta
sulla rete dei servizi, e per fargliela raggiungere le strade erano due, tutte e due
peggiori del problema: pubblicare Postgres su una porta di internet, oppure spostare il
build sulla macchina di chi rilascia e rinunciare al deploy da `main`.

Decisione: **con `BUILD_SENZA_DB=1` il build riceve un Payload che risponde vuoto.**

Sta tutto in `src/componenti/payload.ts`, che diventa l'unico punto in cui le rotte
aprono Payload. Fuori dal build la bandiera non si legge nemmeno - la condizione vuole
anche `NEXT_PHASE=phase-production-build` - quindi il build in locale e qualunque
rilascio che il database ce l'ha continuano a pregenerare tutto, schede comprese.

## Cosa esce, con la bandiera accesa

Le `generateStaticParams` tornano vuote e le schede si rendono su richiesta: `dynamicParams`
e' acceso di suo, non cambia niente per chi naviga. Le pagine indice si prerenderizzano
senza elenchi, e `revalidate` le riempie al primo accesso.

I global invece non sono vuoti: `valoriPredefiniti()` ricostruisce dai campi gli stessi
valori che Payload restituisce su un database appena migrato - e che restituisce davvero,
verificato, finche' nessuno ha salvato quel global. Serve perche' senza quei valori il
guscio non regge: `navigazione.cta.href` esplode in `Barra.tsx` e il build muore lo
stesso, solo piu' avanti. Con i default il guscio prerenderizzato ha il menu giusto, il
bottone giusto e il piede giusto, e a mancare sono i soli dati di collection.

## Il prezzo

Una pagina prerenderizzata si serve dalla cache finche' non e' piu' vecchia del suo
`revalidate`, e solo allora la richiesta successiva ne innesca la rigenerazione. Quindi
dopo un rilascio il guscio senza elenchi resta in circolo per quel tempo: **un minuto per
le pagine, un'ora per `sitemap.xml` e `opengraph-image`**. Poi si riempiono da sole.

Scaldare le rotte con un `curl` subito dopo il deploy non serve - a quel punto la cache
non e' scaduta e la richiesta non rigenera niente - e per questo il post-deployment di
Coolify non ce l'ha.

Le due pagine che contano di piu' non hanno il problema: `/centri` e `/contatti` sono
dinamiche e si rendono a ogni richiesta, quindi l'elenco dei centri e il modulo sono
giusti dal primo secondo.

L'alternativa era rendere dinamiche anche le altre, perdendo la cache per sempre a causa
del primo minuto di vita di un rilascio. Su un rilascio che il database ce l'ha al build
- la produzione - il problema non esiste: la bandiera resta spenta e le pagine escono
gia' piene.

## Cosa non copre

`valoriPredefiniti()` conosce `row` e `group`, i due contenitori che i nostri global
usano. Un `tabs` in un global tornerebbe vuoto e non se ne accorgerebbe nessuno finche'
il guscio non si rompe: il caso si aggiunge li' quando servira'. Il test in
`tests/int/predefiniti.int.spec.ts` tiene fermo quello che la barra legge.
