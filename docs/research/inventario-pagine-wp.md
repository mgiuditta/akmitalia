# Inventario delle 39 pagine WordPress: cosa sopravvive

Ricerca per la issue [#15](https://github.com/mgiuditta/akmitalia/issues/15), figlia della mappa [#14](https://github.com/mgiuditta/akmitalia/issues/14).

**Domanda.** Delle 39 pagine del sito WordPress vivo, quali sopravvivono, quali si fondono e quali muoiono?

**Regola.** Il default deciso in mappa e' **la morte**: rientra solo cio' che qualcuno rivendica. Il giudice e' `PRODUCT.md`, in particolare i cinque Design Principles e l'anti-reference n. 2 (il «sito federale anni 2000»: pagine accatastate, PDF, loghi). Contenuto gia' coperto da Payload — centri, orari, docenti, corsi — non e' una pagina da salvare: e' un dato che esiste gia'.

**Fuori scopo qui.** I redirect dalle vecchie URL (SEO, deciso in #14). Le immagini (nessun ritratto esiste sul sito vecchio; le 118 immagini contate sotto sono locandine e scansioni). News ed eventi restano **nebbia della mappa**: li segnalo, non li decido.

Data: 2026-09-01. Sito interrogato: `https://www.akm-italia.it`.

---

## 1. Metodo

Fonte primaria unica: la REST API WordPress del sito vivo, non il sito renderizzato ne' la memoria.

```bash
curl -s 'https://www.akm-italia.it/wp-json/wp/v2/pages?per_page=100&_fields=id,slug,title,content,parent,menu_order'
```

Una sola chiamata restituisce **39 pagine** (`x-wp-total: 39`), contenuto incluso. Il markup e' del page builder DSLC (`<div class="dslc-module-front" data-module="DSLC_Text_Simple">`): un `<h1>` di una riga puo' stare dentro 6.000 caratteri di involucro. Per contare **prosa vera** ho spogliato il markup prima di misurare:

```python
c = re.sub(r'(?is)<(script|style)[^>]*>.*?</\1>', ' ', c)   # via script e style
c = re.sub(r'(?i)<(br|/p|/h[1-6]|/div|/li|/tr|/td)[^>]*>', '\n', c)  # confini di blocco
c = re.sub(r'(?s)<[^>]+>', ' ', c)                           # via tutti i tag
c = html.unescape(c).replace('\xa0', ' ')                    # entita' e nbsp
prosa = '\n'.join(l for l in (re.sub(r'[ \t]+',' ',l).strip() for l in c.split('\n')) if l)
```

I «caratteri» della tabella sono `len(prosa)`: testo leggibile, spazi interni inclusi, righe vuote escluse. `<img>`, `href` a PDF e `<a>` sono contati sul markup originale.

Due controlli incrociati oltre alla API:

- **id 520** risulta a zero caratteri. Ho verificato anche sul sito vivo (`curl -sL https://www.akm-italia.it/altre-informazioni-krav-maga/` → 301 verso `/storia-del-krav-maga/altre-informazioni-krav-maga/`, HTTP 200, 56 KB): l'area di contenuto renderizzata e' **vuota**, zero caratteri. Non e' un artefatto della API.
- I due link esterni della Rassegna Stampa sono stati testati (`curl -sI -L`): entrambi **200**.

Cosa Payload copre gia', letto in `src/collections/` e in `data/centri-tecnici.json` (il cui campo `_fonte` dichiara: trascritto a mano dalla pagina Centri Tecnici, wp id 7426): **18 sedi** (15 attive), **3 corsi**, **13 istruttori**, con `Sedi.orari[]`, `Sedi.descrizione`, `Istruttori.credenziali[]`, `Corsi.focus/risultati/adattoA/prova/durata/ingresso/cadenza`.

**Correzione all'enunciato del ticket:** le figlie di «Chi Siamo» (id 254) non sono 11 ma **13** (`parent=254`). Le figlie di «Krav Maga» (id 437) sono **9**, come detto. 17 pagine di primo livello + 13 + 9 = 39.

---

## 2. La tabella, pagina per pagina

Verdetti: **vive** (esiste come pagina nel nuovo inventario), **si fonde** (il contenuto entra in una pagina o in un campo che esiste gia'), **muore**, **nebbia** (la mappa lo tiene aperto, non lo decido).

Il segno **†** marca le righe che la mappa #14 elenca sotto «Not yet specified» (Chi siamo e Albo istruttori; pagine legali oltre l'informativa privacy; News ed Eventi): li' il verdetto e' una **proposta alla mappa**, non una chiusura.

### 2.1 Primo livello (17 pagine)

| id | slug | titolo | car. | verdetto | ragione |
|---|---|---|---:|---|---|
| 5381 | `home` | Home | 2.706 | **vive** | E' la radice della catena di conversione. Il testo pero' muore tutto: la prosa attuale non nomina un solo centro, e il link «Scarica il file: GIORNI E ORARI CORSI 2026/2027» e' il PDF dell'anti-reference n. 2 con dentro dati che stanno in `Sedi.orari[]`. |
| 5355 | `privacy-policy` | Privacy Policy | 3.464 | **vive** | Il form raccoglie dati personali: l'informativa e' obbligatoria, ed e' l'unica pagina legale che la mappa tiene dentro. Da riscrivere: nomina un DPO, un'«area riservata» e `info@akm-italia.it`, tre cose che il nuovo sito non ha. |
| 7426 | `centri-tecnici-akm-italia` | Centri Tecnici AKM ITALIA | 8.574 | **si fonde** | Gia' assorbita: e' la fonte dichiarata di `data/centri-tecnici.json`, e vive come `/centri` e `/centri/[slug]`. Anche il «punto di riferimento per le zone di…» e' gia' dentro, in `Sedi.descrizione` (14 sedi su 18). |
| 1901 | `corsi-regolari-e-speciali` | Corsi Regolari e Corsi Speciali | 1.731 | **si fonde** | Le quattro righe di elenco (regolari, istruttori, antibullismo, speciali) sono la collection `Corsi`. Il bivio non e' una rotta (#14), quindi non c'e' una pagina indice: resta `/corsi/[slug]`. Il form incorporato muore (un form solo). |
| 437 | `storia-del-krav-maga` | Krav Maga | 1.953 | **si fonde** | Una riga di origine («sistema nato in Israele negli anni quaranta, poi adattato ai civili») dentro la pagina del corso regolare. Il resto e' storia militare che non nomina ne' un luogo ne' una persona di AKM: Principio 1. |
| 424 | `cosa-e-il-krav-maga` | Cos'è il Krav Maga | 3.383 | **si fonde** | La pagina piu' utile del sito vecchio. La sezione «UNA PRATICA SICURA» («si usano delle protezioni», «e' molto piu' facile farsi male in una partita di calcetto») e' materia prima per `Corsi.adattoA[]` e `Corsi.prova`: e' Principio 5 scritto dal cliente. |
| 505 | `krav-maga-f-a-q` | Krav Maga F.A.Q. | 4.920 | **si fonde** | Vedi §3.3: una sola domanda, un solo fatto usabile («nessun corso a pacchetto di 10 o 20 ore»), da spostare in `Corsi.durata` e `Corsi.ingresso`. La polemica e la descrizione dell'aggressione non passano. |
| 527 | `richiesta-informazioni` | Richiesta Informazioni | 1.407 | **si fonde** | E' il form, quindi confluisce in `/contatta`. Muore il nome e muore il testo: «preiscrizione» e' la parola che `CONTEXT.md` vieta esplicitamente, e «(N.B. I posti sono limitati)» e' una leva sulla scarsita' che il Principio 5 esclude. |
| 341 | `contatti` | Contatti | 1.113 | **si fonde** | I due telefoni e le due email sono dati reali → global `Contatti`. Il form allegato muore: chiede «Data di nascita *», che la mappa ha tolto, ed e' la terza copia dello stesso modulo (vedi §3.4). |
| 511 | `corsi-istruttori-krav-maga` | Corsi Istruttori Krav Maga | 767 | **si fonde** | E' la materia prima della quarta voce del bivio, la formazione tecnica, che l'ADR 0003 dice esistera' «quando esistera' il corso». Oggi non ha corso ne' orari in Payload: non e' una pagina, e' un `Corsi` che il cliente deve ancora creare. |
| 5909 | `rassegna-stampa` | Rassegna Stampa | 507 | **si fonde** | Sopravvivono due link esterni, entrambi vivi (HTTP 200) e entrambi sull'antibullismo: NoiBrugherio 2015, BuoneNotizie 2014. Diventano `prova` del corso antibullismo. La pagina no: una rassegna stampa e' l'anti-reference n. 2. Le altre tre voci sono scansioni JPG, quindi fuori. |
| 5480 | `news` | News | 1.398 | **nebbia** † | 235 post, archivio mensile da dicembre 2011 a gennaio 2026. La mappa tiene News ed Eventi aperti: segnalo e mi fermo. Nota di fatto: la pagina in se' e' solo un elenco di archivi mensili e 108 link. |
| 3758 | `cookie-policy` | Cookie Policy | 3.711 | **muore** † | Descrive cookie analitici e «di rilevamento di terze parti». Il nuovo sito non ha terze parti per costruzione (#14: niente reCAPTCHA, nessuno script esterno, nessun banner): questa pagina descriverebbe un sito che non esiste. |
| 618 | `kick-boxing-adulti` | Kick Boxing Ragazzi e Adulti | 3.496 | **muore** | Voce enciclopedica sulla kickboxing (storia giapponese, Bruce Lee, elenco di calci e pugni). Non nomina AKM, ne' un centro, ne' un istruttore: Principio 1. E nei dati non esiste un corso ne' un orario di kickboxing. |
| 320 | `centri-studi` | CENTRO STUDI | 593 | **muore** | Contenitore autoreferenziale: «Questa iniziativa produce i risultati che trovate in questa sezione», e la sezione non contiene nulla. Nessuna figlia, nessun documento. |
| 402 | `donna-sicura` | Donna Sicura | 12 | **muore** | 12 caratteri di prosa (il titolo) e 50 immagini. Il tema vive gia' come corso reale (`krav-maga-antiaggressione-femminile`, Muggio'); la pagina e' una galleria di locandine, e le immagini sono fuori scopo. |
| 403 | `festival-arti-marziali` | Festival Arti Marziali | 22 | **muore** | 22 caratteri e 28 locandine. Muore comunque, qualunque cosa si decida su Eventi: e' una galleria, e le immagini sono fuori. |
| 398 | `gruppi-akm-italia` | Gruppi AKM ITALIA | 17 | **muore** | 17 caratteri (il titolo) e 16 immagini. Nessuna prosa da salvare. |
| 401 | `full-contact` | Full Contact | 12 | **muore** | 12 caratteri («Full Kontact», con il refuso) e 14 immagini. Nessun corso di full contact nei dati. |

### 2.2 Le tredici figlie di «Chi Siamo» (id 254)

| id | slug | titolo | car. | verdetto | ragione |
|---|---|---|---:|---|---|
| 254 | `chi-siamo` | Chi Siamo | 2.624 | **muore** † | La «Mission»: quattro paragrafi che non nominano ne' un centro ne' una persona (tranne Porreca), e promettono «consapevolezza dei propri mezzi». E' l'astrazione che il Principio 1 vieta. Una riga («associazione nata per diffondere la difesa personale basata sul Krav Maga») puo' entrare nella home. |
| 3914 | `dicono-di-noi` | Dicono di Noi | 13.282 | **si fonde** | La pagina piu' lunga del sito. 28 testimonianze con nome e cognome veri, e molte rispondono esattamente al secondo dubbio di `PRODUCT.md` («sono fuori posto in una palestra così?»): «mi son sentita subito accolta», «nessuno obbliga nessuno ad andare oltre ai propri limiti». Non una pagina: una selezione corta dove il dubbio nasce. Subordinata al consenso (§5). |
| 4115 | `istruttori-krav-maga-albo-tecnici-akm-italia` | Albo Tecnici 2024/2025 | 606 | **si fonde** † | E' `Istruttori`, non una pagina. Elenca 20 nomi (quasi tutti di battesimo) contro i 13 in Payload, ed e' fermo alla stagione 2024/2025. Il delta e' contenuto del cliente, non lavoro di schema. |
| 213 | `team-management-vittorio-porreca` | Team Management | 2.126 | **si fonde** | Le uniche credenziali verificabili del sito: «Albo FEKDA n° 42698 - Albo CSEN-CONI n° 6297», le qualifiche di Porreca e di Borghini. Vanno in `Istruttori.credenziali[]`, dove nasce la domanda «funziona davvero?» (Principio 4). Il medico consulente e il «Responsabile sito» non stanno nella catena: muoiono. |
| 368 | `riconoscimenti` | Riconoscimenti | 1.094 | **si fonde** | Quattro numeri veri: registro ASD n° 8372 Serie 3 del 30.11.2007, CSEN n° 20993, registro CONI n° 58586, FEKDA n° 872. Sono prove, e come prove sopravvivono. I quattro loghi allegati no: «loghi di enti accatastati in footer» e' l'anti-reference n. 2 alla lettera. |
| 353 | `codice-etico-deontologico` | Codice Etico Deontologico | 1.449 | **si fonde** † | Il contenuto e' una risposta a «funziona davvero?»: docenti diplomati dopo «almeno quattro anni», esame teorico-pratico di abilitazione, neo-diplomati seguiti da un tecnico esperto, tutti tesserati e assicurati CSEN. Va accanto agli istruttori, non in una pagina intitolata «Codice etico». |
| 7164 | `dona-il-tuo-5-x-1000` | Dona il tuo 5 x 1000 | 1.034 | **si fonde** | Un solo dato che nessun'altra pagina ha: il codice fiscale **97472400155**. Diventa una riga nel piede, non una pagina: il 5 x 1000 non e' l'esito che il sito misura. Se il cliente lo vuole ancora chiedere, e' una sua decisione (§5). |
| 416 | `credits` | Credits | 191 | **si fonde** | 191 caratteri: e' l'indirizzo della sede legale, gia' modellato nel global `Contatti.sedeLegale`. Come pagina non esiste piu'. |
| 239 | `staff-docenti` | Staff Docenti | 506 | **muore** | **Duplicato verificato.** Dodici righe, tutte credenziali di Porreca gia' presenti in id 213 (tre identiche alla lettera, le altre parafrasi della stessa qualifica), piu' un «Leggi tutto» che rimanda a 213. Zero contenuto proprio. |
| 507 | `la-differenza-che-fa-la-differenza` | La Differenza che fa la Differenza | 3.928 | **muore** | Non parla di Krav Maga: e' brochure di coaching aziendale a firma Porreca formatore, con «Financial Times Maggio 2002», «con il coaching raggiunge 88%» e una citazione di Henry Ford. Anti-reference n. 3 e n. 4 insieme. |
| 377 | `collaborazioni-e-consulenze` | Collaborazioni e Consulenze | 365 | **muore** | Dieci voci di elenco puntato («Istituti di Vigilanza Privata», «Comunita' di Recupero») e nessun contenuto, nessun cliente nominato, nessuna prova. E' l'enum `aziende-ffoo` che l'ADR 0003 dichiara inesistente fuori dall'enum. |
| 421 | `legal-disclaimer` | Legal Disclaimer | 6.692 | **muore** † | Seconda pagina piu' lunga del sito e vale zero: modulo del 2008 («Corsico, 18 Giugno 2008») che regola il download di «Sfondi (Wallpaper)» e «Salva schermo», parla di «prodotti A.K.M. Italia» e di «servizi post vendita», e contiene clausole sui dati che contraddicono la privacy policy del 2019. |
| 627 | `partners` | Partners | 639 | **muore** | Quindici link commerciali esterni: un'armeria, un tatuatore, un'autofficina, Decathlon. Non c'e' rapporto con la catena di conversione, ed e' esattamente la pila di loghi dell'anti-reference n. 2. |

### 2.3 Le nove figlie di «Krav Maga» (id 437)

| id | slug | titolo | car. | verdetto | ragione |
|---|---|---|---:|---|---|
| 424 | `cosa-e-il-krav-maga` | Cos'è il Krav Maga | 3.383 | **si fonde** | (vedi §2.1: e' l'unica figlia che sopravvive per intero come materia prima della pagina corso) |
| 505 | `krav-maga-f-a-q` | Krav Maga F.A.Q. | 4.920 | **si fonde** | (vedi §2.1 e §3.3) |
| 461 | `imi-lichtenfeld` | Imi Lichtenfeld | 2.792 | **muore** | Biografia che ripete quello che id 437 dice gia' nella sezione «Alle origini del Krav Maga»: stesso ginnasta-pugile-lottatore, stessa Bratislava, stessa fuga nel 1940. Ridondante con la pagina madre, che a sua volta sopravvive per una riga sola. |
| 456 | `le-caratteristiche-del-krav-maga` | Le caratteristiche del Krav Maga | 1.847 | **muore** | Sostiene che il Krav Maga «punta ad un approccio offensivo», mira «alla neutralizzazione del nemico» e che l'approccio anticipatorio «potrebbe portare a complicazioni di natura penale». Aggiunge paura e dubbio legale a un visitatore gia' a disagio: Principio 5 al contrario. E contraddice id 424, che vende sicurezza. |
| 470 | `i-principi-del-krav-maga-di-imi-lichtenfeld` | I principi del Krav Maga di Imi Lichtenfeld | 4.257 | **muore** | Contiene una riga usabile («per prima cosa, cercate di evitare il confronto»), gia' detta meglio altrove, dentro un testo che include «Se qualcuno viene ad uccidervi, uccidetelo per primi». Inutilizzabile davanti al genitore che valuta il corso per il figlio. |
| 483 | `krav-maga-hollywood` | Krav Maga & Hollywood | 1.387 | **muore** | Jennifer Lopez, Angelina Jolie, Tomb Raider 2, Terminator 3. Nessun luogo, nessuna persona di AKM: Principio 1. E la prova per «funziona davvero?» non e' un film. |
| 476 | `israel-defense-force` | IDF Israel Defense Forces | 1.352 | **muore** | Copia-incolla enciclopedico sull'esercito israeliano, con frasi mutile («l'integrità territoriale e la dello stato di Israele»). Non dice niente su cosa succede in una palestra ad Abbiategrasso. |
| 495 | `abbigliamento-protezioni-armi` | Abbigliamento Protezioni Armi | 397 | **muore** | E' il vero **rifiuto** del sito (vedi §3.3): promette di dire cosa serve e rimanda al docente, seguito da uno shortcode `[nggallery id=1]` che non renderizza. La domanda che pone e' giusta e resta aperta (§5). |
| 520 | `altre-informazioni-krav-maga` | Altre Informazioni | **0** | **muore** | **Zero caratteri**, verificato sia via API sia sul sito vivo. Non e' una pagina: e' un'etichetta di menu con dentro il vuoto. |

---

## 3. Cosa dicono i numeri e le sovrapposizioni

### 3.1 Il conto

- **39 pagine**, **86.354 caratteri** di prosa in tutto. Meno di 90 KB di testo per un sito da 39 pagine: la maggior parte del peso e' markup del page builder e locandine.
- **2 pagine vivono** come pagine (`home`, `privacy-policy`), e di entrambe sopravvive la rotta, non il testo.
- **16 si fondono** in una pagina o in un campo che gia' esiste.
- **20 muoiono.**
- **1 e' nebbia** (`news`, id 5480), per decisione della mappa.
- **145 immagini** in tutto, di cui **108 concentrate in quattro pagine-galleria** (`donna-sicura` 50, `festival-arti-marziali` 28, `gruppi-akm-italia` 16, `full-contact` 14), che insieme hanno **63 caratteri** di prosa. Confermano la nota di #14: sono locandine, non ritratti.
- **Un solo PDF** linkato in tutto il sito, ed e' in home: gli orari dei corsi 2026/2027, cioe' dati che in Payload sono `Sedi.orari[]`.
- Quattro pagine hanno **meno di 25 caratteri** di prosa. Una ne ha **zero**.

Attenzione a non leggere «si fonde» come «sopravvive»: delle 16 fusioni, la maggior parte contribuisce due o tre righe. La pagina piu' lunga che si fonde (`dicono-di-noi`, 13.282 caratteri) contribuisce una selezione, ed e' subordinata a un permesso che non abbiamo.

### 3.2 «Altre Informazioni» e «Krav Maga F.A.Q.»: la risposta e' nessuna delle due

Il ticket ipotizzava che fossero la stessa pagina, oppure una pagina e un rifiuto. Sono un'altra cosa.

- **id 520 «Altre Informazioni» ha zero caratteri.** Non e' un rifiuto: non e' niente. E' un contenitore di menu (menu_order 10 sotto id 437) rimasto vuoto, e lo e' anche sul sito renderizzato.
- **id 505 «Krav Maga F.A.Q.» non e' una F.A.Q.**: ha **una sola domanda** («Quanto dura un Corso di Krav Maga?»), e la risposta e' lunga 4.920 caratteri di polemica contro «molti istruttori (?) di Krav Maga che vendono corsi a pacchetto».
- **Il rifiuto vero e' id 495 «Abbigliamento Protezioni Armi»**: 397 caratteri che annunciano «in questa sezione vengono indicate le protezioni e le armi necessarie» e poi dicono «prima dell'acquisto, rivolgersi ai Docenti». E' l'unica pagina che prova a rispondere a «cosa porto la prima volta», e si ferma un attimo prima di rispondere.

### 3.3 Cosa si salva davvero della F.A.Q.

Un fatto solo, e vale: **AKM non vende pacchetti di 10 o 20 ore, i corsi sono continuativi**, con l'aneddoto verificabile di praticanti «che se la sono cavata avendo frequentato solo 3 o 4 mesi di corso». Sta in `Corsi.durata` e `Corsi.ingresso`, dove risponde a una domanda vera senza attaccare nessuno.

Non si salva il resto: il paragrafo che descrive un'aggressione in presa diretta («il cuore inizia a battere all'impazzata… la vista si annebbia, le mani e le gambe tremano») e' precisamente la leva sull'insicurezza che il Principio 5 vieta, e il tono («pensando in modo sconsolato a tutti quegli istruttori o pseudo-istruttori») non e' quello dell'istruttore che spiega.

### 3.4 Le tre copie dello stesso form, e una contraddizione nei dati

Lo stesso modulo compare identico su **tre pagine**: id 341 `contatti`, id 527 `richiesta-informazioni`, id 1901 `corsi-regolari-e-speciali`. Tutte e tre chiedono «Data di nascita \*» come campo obbligatorio — che la mappa ha tolto — e tutte e tre offrono la stessa tendina di **20 centri**.

Quella tendina non e' allineata con la pagina dei centri, che ne elenca **19**:

- in tendina ma non fra i centri: **Caronno Pertusella (VA)** e **Milano - Zona 8 (MI)**;
- fra i centri ma non in tendina: **Saronno (VA)**.

E' l'argomento piu' concreto a favore del vincolo gia' deciso in #14 — un form solo, con `sede` come relazione vera invece che come tendina scritta a mano.

### 3.5 Il gruppo «Krav Maga»: nove pagine, un corso

Le nove figlie di id 437 sono nove capitoli di un'unica cosa che nel nuovo sito e' **una pagina corso**, `/corsi/krav-maga-self-defense-system`. Cinque muoiono per contraddizione o per tono (456 dice offensivo dove 424 dice sicuro; 470 arriva a «uccidetelo per primi»; 483 e 476 non nominano AKM; 520 e' vuoto), una muore da duplicato (461 ripete 437), una e' un rifiuto (495). Restano 424 e, per un fatto solo, 505.

### 3.6 Il gruppo «Chi Siamo»: tredici pagine, e le credenziali sono l'unica cosa che pesa

Delle tredici figlie, **otto** portano un fatto verificabile e sopravvivono come dato: numeri d'albo (213), numeri di registro (368), percorso formativo dei docenti (353), elenco dei tecnici (4115), codice fiscale (7164), sede legale (416), recapiti (341), testimonianze firmate (3914). Le altre cinque — 507, 377, 421, 627, 239 — non portano nulla che non sia gia' altrove o che il Principio 4 non vieti di ammassare.

Nessuna di queste otto e' pero' una **pagina**: sono campi. E' l'argomento che la mappa aveva gia' intuito nella riga «forse non sono pagine».

---

## 4. L'inventario proposto del sito nuovo

Sette voci, di cui due gia' costruite.

| rotta | cosa e' | stato | da dove viene |
|---|---|---|---|
| `/` | Home: la presenza (centri e persone reali) e il primo bivio | da fare | testo nuovo; una riga da id 254, una riga di origine da id 437 |
| `/corsi/[slug]` | Pagina corso, tre istanze reali (regolare, antibullismo, antiaggressione femminile) | da fare | campi di `Corsi`; prosa da id 424, id 505, id 1901, prove da id 5909 e id 353 |
| `/centri` | L'elenco dei centri, alfabetico per comune (ADR 0001) | **fatto** | `Sedi`, gia' importate da id 7426 |
| `/centri/[slug]` | La scheda del centro: indirizzo, orari, docente, come arrivarci | **fatto** | `Sedi`, `Sedi.orari[]`, `Istruttori` |
| `/contatta` | La pagina del form unico, con sede e corso precompilati da querystring | da fare | id 341, id 527, id 1901 fusi in uno; il nome viene dall'etichetta «Contatta» decisa in #14 |
| `/privacy` | Informativa privacy | da riscrivere | id 5355 |
| `/istruttori` | L'albo: nomi, qualifiche, numeri d'albo | **candidato, non deciso** † | `Istruttori` + `credenziali[]` da id 213, id 4115, id 353 |

Note sull'inventario:

- **Non c'e' una pagina indice dei corsi.** Il bivio non e' una rotta (#14) ed e' una domanda posta una volta nella home; `/corsi/[slug]` basta.
- **Non c'e' `/chi-siamo`.** La mission non nomina nessun luogo e nessuna persona: quello che ne resta e' una riga in home. La prova di credibilita' che «Chi Siamo» raccoglieva vive dove nasce la domanda, cioe' sulla scheda del centro, sulla pagina corso e nel piede.
- **Non c'e' un piede pieno di loghi.** Sopravvivono come testo il codice fiscale (id 7164), la sede legale (id 416) e i numeri di registro (id 368). I loghi CSEN, CONI e FEKDA no.
- `/istruttori` e' segnato come candidato perche' la mappa lo tiene aperto. La ricerca dice che **il contenuto esiste** (13 istruttori con qualifica, credenziali verificabili) e che **la pagina non e' necessaria alla catena**: e' una decisione della mappa, non di questo ticket.
- News ed Eventi restano fuori dall'inventario **in attesa**, non per rifiuto: sono nebbia della mappa. I numeri per deciderli, dalla fonte: **235 post** e **22 eventi** in calendario (settembre 2026).

---

## 5. Domande che solo il cliente puo' chiudere

1. **Le testimonianze si possono pubblicare?** Id 3914 contiene 28 testi firmati con nome e cognome (Sonia Cavagna, Martina Raddusa, Fabio Piccolo…), scritti anni fa per un altro sito. Portarli sul nuovo sito richiede il consenso delle persone, o l'anonimizzazione (che ne toglie il valore di prova). Sono il miglior materiale esistente per rispondere a «sono fuori posto in una palestra così?»: vale la pena chiederlo.
2. **Cosa serve alla prima lezione?** Id 495 e' l'unica pagina che affronta la domanda e si ferma prima di rispondere («rivolgersi ai Docenti»). `PRODUCT.md` Principio 5 la vuole risposta esplicitamente («cosa portare, cosa succede la prima volta, che non serve essere allenati»). Serve una risposta reale — e probabilmente un campo che oggi in `Corsi` non c'e'.
3. **L'albo tecnici e' fermo al 2024/2025.** Id 4115 elenca 20 nomi, quasi tutti di battesimo; in Payload ce ne sono 13. Qual e' l'albo della stagione in corso, e i tecnici vogliono comparire con cognome?
4. **La kickboxing e il full contact esistono ancora?** Non hanno corso ne' orario in nessuno dei 18 centri (id 618 e id 401 muoiono per questo), ma id 213 qualifica Omar Borghini come «Dir. Tecnico Capo Istruttore Full Contact» e «Kick Boxing», e le news raccontano stage «Calci e Pugni» fino a aprile 2024. O sono attivita' che esistono ma non compaiono negli orari, o sono qualifiche storiche. Se esistono, sono un corso in `Corsi`, non una pagina.
5. **Il 5 x 1000 va ancora chiesto?** Id 7164 e' del 2022 ed e' l'unica richiesta economica del sito. Se resta, e' una riga nel piede col codice fiscale, non una pagina.
6. **Quali pagine legali servono davvero?** La mappa tiene aperto tutto cio' che va oltre l'informativa privacy. Dalla fonte: la cookie policy (id 3758) descrive cookie di terze parti che il nuovo sito non avra'; il legal disclaimer (id 421) e' un modulo del 2008 su wallpaper e screensaver che contraddice la privacy policy; il codice etico (id 353) contiene invece sostanza vera, ma e' prova, non pagina legale. La domanda per il cliente e' se qualche vincolo associativo o federale imponga di pubblicare un codice etico come documento a se'.
7. **News ed eventi: chi li scrive?** Non e' una domanda di design ma di redazione, e i numeri della fonte dicono che la cadenza si e' fermata: 29 post nel 2020, 16 nel 2021, 13 nel 2022, poi **2 nel 2023, 3 nel 2024, zero nel 2025 e uno nel 2026** (12 gennaio). Se questa e' la cadenza reale, un blocco «News» in home mostra soprattutto quanto tempo e' passato dall'ultima: l'anti-reference n. 2 che rientra dalla finestra. La decisione resta alla mappa.
