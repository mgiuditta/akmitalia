# Candidate grottesche gratuite con cifre tabulari

Ricerca per la issue [#3](https://github.com/mgiuditta/akmitalia/issues/3), figlia di #1. Non è la scelta finale: quella si fa in #6 sui dati veri.

Data: 2026-08-31. Tutti i verdetti sotto vengono dall'ispezione dei file font scaricati, non dalle schede di Google Fonts.

---

## 1. Verdetto in breve

Quattro famiglie passano **tutti** i vincoli duri del ticket: **Source Sans 3**, **Fira Sans**, **Noto Sans**, **Work Sans**. Tutte e quattro hanno small caps vere disegnate (`smcp` + `c2sc`), cifre allineabili in colonna, il set latino italiano completo con maiuscoli accentati, e almeno quattro pesi non sintetizzati.

Due famiglie che sembrano il candidato naturale per un registro pubblico, **IBM Plex Sans** e **Public Sans**, sono **bocciate su un vincolo solo**, e va detto esplicitamente perché è un verdetto e non un dettaglio: **non hanno maiuscoletto vero**. Nessun glifo small cap, nessuna feature `smcp`, nessuna `c2sc`. Con `font-variant-caps: small-caps` il browser sintetizza maiuscole rimpicciolite: peso ottico sbagliato, aste troppo sottili, esattamente il difetto che il livello Label di `DESIGN.md` non può permettersi. Stessa bocciatura, per la stessa ragione, per **Inter**.

**Non esiste una candidata ovvia.** Esiste una rosa di due, con una terza di riserva:

- **Source Sans 3** è la più economica e la più prevedibile sui numeri (cifre tabulari **di default**, un solo file variabile da 50 KB per tutta la scala di pesi 200-900, small caps complete anche sugli accentati).
- **Fira Sans** ha le small caps meglio disegnate e la copertura di feature più ricca, ma costa il triplo in byte (nessun font variabile, statici da ~33 KB per peso) e il repo upstream è archiviato.
- **Noto Sans** è la riserva neutra: numeri tabulari di default come Source Sans, small caps vere, manutenzione attiva. Tono più anonimo.

La scelta fra queste non si decide su una tabella di feature: si decide su come si comportano sugli orari e sulle sigle vere delle sedi, che è appunto #6.

---

## 2. Metodo di verifica

Nessun dato di questo documento viene da una pagina di marketing. Procedura:

```bash
python3 -m venv venv && ./venv/bin/pip install fonttools brotli uharfbuzz
```

1. **Download dalla fonte primaria.** File `.ttf` presi dal repo `google/fonts` (`ofl/<famiglia>/`, che è il file effettivamente self-hostabile) via `raw.githubusercontent.com`, più i repo upstream (`adobe-fonts/source-sans`, `mozilla/Fira`, `IBM/plex`, `uswds/public-sans`, `weiweihuanghuang/Work-Sans`) per licenza, versione e stato di manutenzione.

2. **Feature OpenType reali**, lette dalla tabella GSUB con `fontTools.ttLib`, non dal nome del file:

   ```python
   from fontTools.ttLib import TTFont
   f = TTFont(path)
   tags = {fr.FeatureTag for fr in f["GSUB"].table.FeatureList.FeatureRecord}
   # e poi, per ogni tag, si estraggono le sostituzioni reali dalle Lookup
   ```

   La presenza del tag non basta: per ogni `tnum` si sono estratte le sostituzioni singole e si è verificato che i dieci glifi cifra finiscano davvero su glifi con la **stessa avanzata** in `hmtx`. Per ogni `smcp` si è verificato che i glifi di arrivo **abbiano contorni** (`BoundsPen`) e che la loro altezza stia **fra x-height e cap-height**, cioè che siano small caps disegnate e non maiuscole riciclate.

3. **Prova funzionale con HarfBuzz** (`uharfbuzz`), che è ciò che fa il browser: shaping di due orari di lunghezza uguale ma cifre diverse e confronto delle larghezze totali.

   ```python
   buf = hb.Buffer(); buf.add_str("09:30-11:00"); buf.guess_segment_properties()
   hb.shape(font, buf, {"tnum": True})
   sum(p.x_advance for p in buf.glyph_positions)
   ```

   Il test: `'09:30-11:00'` e `'18:45-20:15'` devono misurare **identico**, e `'1111111111'` deve misurare quanto `'0000000000'`.

4. **Maiuscoli accentati**: verifica in `cmap` di `À È É Ì Ò Ù à è é ì ò ù Ç ç`, più misura dell'estremo superiore del bounding box di `À` confrontato con `usWinAscent`, per stimare il rischio di taglio dell'accento con interlinee strette.

5. **Pesi reali**: per i variabili, conteggio delle posizioni di master sull'asse `wght` leggendo i picchi normalizzati in `gvar`; per gli statici, conteggio dei file disegnati.

6. **Dimensioni woff2**: subset fatto in casa con `fontTools.subset` (unicode-range `latin` di Google Fonts, `--layout-features='*'` per non buttare via `smcp`/`c2sc`/`tnum`), instanziazione dei pesi con `fontTools.varLib.instancer`, compressione woff2 con `brotli`. Sono quindi i byte che si servirebbero davvero da `/public/fonts`, non i byte del `.ttf` sorgente.

---

## 3. Tabella verdetto, vincolo per vincolo

| | Source Sans 3 | Fira Sans | Noto Sans | Work Sans | IBM Plex Sans | Public Sans |
|---|---|---|---|---|---|---|
| **Cifre tabulari** | **SÌ, di default** (tutte le cifre a 472/1000; `tnum` assente perché inutile) | **SÌ, con `tnum`** (proporzionali di default, `tnum` porta tutto a 560/1000) | **SÌ, di default** (572/1000) | **SÌ, con `tnum`** (604/1000) | **SÌ, sempre** (600/1000, `pnum` non esiste: impossibile sbagliare) | **SÌ, con `tnum`** (1400/2000) |
| prova HarfBuzz `09:30-11:00` vs `18:45-20:15` | 4486 = 4486 (default) | 5363 = 5363 (con `tnum`) | 5434 = 5434 (default) | 5946 = 5946 (con `tnum`) | 5783 = 5783 (qualsiasi feature) | 12648 = 12648 (con `tnum`) |
| **≥4 pesi reali** | **SÌ**, variabile `wght` 200-900, 3 posizioni di master (200 / ~620 / 900), 8 istanze nominate | **SÌ**, 9 statici disegnati (Thin→Black) | **SÌ**, variabile `wght` 100-900, 3 master, 9 istanze | **SÌ**, variabile `wght` 100-900, **5 master** (il migliore del gruppo) | **SÌ**, variabile `wght` 100-700, 2 master, 7 istanze | **SÌ** come istanze, **ma solo 2 master** su 100-900: tutto interpolato linearmente |
| **Small caps vere** | **SÌ**, 725 sost. `smcp` + 610 `c2sc`, altezza 510 fra x-height 478 e cap 660 | **SÌ**, 661 `smcp` + 638 `c2sc`, altezza 564 fra 527 e 689 | **SÌ**, 336 `smcp` + 303 `c2sc`, altezza 574 fra 536 e 717 | **SÌ**, 281 `smcp` + 256 `c2sc`, altezza 560 fra 500 e 660 | **NO. Feature assente, zero glifi small cap.** | **NO. Feature assente, zero glifi small cap.** |
| small caps sugli accentati italiani | **SÌ** (`Agrave.s`, `Egrave.s`, `Eacute.s`, `Igrave.s`, `Ograve.s`, `Ugrave.s`) | **SÌ** (`agrave.sc` ecc.) | **SÌ** | **SÌ** | no | no |
| **Maiuscoli accentati** `À È É Ì Ò Ù` | **SÌ** (top 830 vs winAscent 934) | **SÌ** (911 vs 935, il più stretto: attenzione a interlinee < 1.0) | **SÌ** (944 vs 1124) | **SÌ** (902 vs 1105) | **SÌ** (949 vs 1120) | **SÌ** (1858 vs 2315) |
| **Tono da manuale operativo** | sì, gotica americana sobria di scuola Franklin/News Gothic | sì con carattere, umanista, qualche idiosincrasia (`a`, `y`, `t`) | sì, neutra fino all'anonimo | parziale: forme larghe e un po' geometriche, pensata per corpi grandi | sì, la più "documentale" del gruppo | sì, letteralmente la font dello US Web Design System |
| **Licenza** | OFL 1.1 | OFL 1.1 | OFL 1.1 | OFL 1.1 | OFL 1.1 | OFL 1.1 |
| **VERDETTO** | **passa tutto** | **passa tutto** | **passa tutto** | **passa tutto** | **bocciata: niente maiuscoletto** | **bocciata: niente maiuscoletto** |

Legenda delle unità: tutte le misure sono in unità em del font (`upm` 1000 per Source Sans, Fira, Noto, Work Sans; 2000 per Public Sans; 2048 per Inter).

---

## 4. Schede

### 4.1 Source Sans 3

- **Versione ispezionata**: 3.052 (`google/fonts` `ofl/sourcesans3/SourceSans3[wght].ttf`), identica alla release upstream `3.052R`.
- **Licenza**: SIL Open Font License 1.1. Upstream `adobe-fonts/source-sans`, `LICENSE.md`, riconosciuta `OFL-1.1` dall'API GitHub. Autore Paul D. Hunt (Adobe).
- **Dove si scarica**:
  - variabile self-hostabile: `https://github.com/google/fonts/raw/main/ofl/sourcesans3/SourceSans3%5Bwght%5D.ttf`
  - release ufficiale con OTF, TTF, VF, WOFF2 già pronti: `https://github.com/adobe-fonts/source-sans/releases/tag/3.052R`
- **Pesi**: asse variabile `wght` 200-900 continuo, 8 istanze nominate (ExtraLight → Black). Tre posizioni di master sull'asse, e a monte Adobe disegna sei statici. Nessuna sintesi.
- **Numeri**: cifre **lining e tabulari di default**, 472/1000 tutte e dieci, quindi gli orari si incolonnano senza scrivere una riga di CSS. Altezza cifra 652 contro cap-height 660: le cifre stanno appena sotto le maiuscole, che è la scelta giusta in un elenco fitto perché non fa "saltare" la riga. `pnum` porta alle proporzionali (`zero.p` ecc.): **da non attivare mai**. `onum` dà oldstyle **anch'esse tabulari** (472), utile se in #6 si volesse provare l'oldstyle nel corpo del testo tenendo l'allineamento. **Zero barrato disponibile**: `zero` → `zero.0s`.
- **Small caps**: le più complete della rosa, 725 sostituzioni `smcp` e 610 `c2sc`, tutte con contorni reali e tutte **variabili lungo l'asse dei pesi** (447 glifi small cap su 447 hanno dati `gvar`): il maiuscoletto ingrassa insieme al resto, non resta bloccato al Regular.
- **woff2 (subset latin, tutte le feature conservate)**:
  | file | KB |
  |---|---|
  | variabile 200-900 completo | **49,9** |
  | variabile, feature ridotte all'essenziale (`kern liga calt ccmp locl mark mkmk smcp c2sc case zero`) | **36,1** |
  | statico 400 | 27,6 |
  | statico 700 | 27,5 |
  | variabile, subset latin + latin-ext | 98,1 |
- **Insidia da ricordare**: nel file variabile di Google Fonts l'asse parte da 200 e il valore **di default è 200**, tanto che il name ID 1 legge "Source Sans 3 ExtraLight". Nel `@font-face` va dichiarato `font-weight: 200 900`, altrimenti si rischia di servire ExtraLight dove serve Regular.

### 4.2 Fira Sans

- **Versione ispezionata**: 4.203 (`google/fonts` `ofl/firasans/`). Upstream `mozilla/Fira`, ultima release 4.202 del 2015, **repo archiviato** (ultimo push dicembre 2020).
- **Licenza**: SIL Open Font License 1.1, verificata leggendo `LICENSE` upstream ("Digitized data copyright (c) 2012-2015, The Mozilla Foundation and Telefonica S.A. This Font Software is licensed under the SIL Open Font License, Version 1.1"). L'API GitHub la classifica `NOASSERTION` solo perché il file non è nel formato canonico. Disegno: Carrois Apostrophe / Erik Spiekermann.
- **Dove si scarica**: `https://github.com/google/fonts/tree/main/ofl/firasans` (9 statici upright + 9 corsivi), oppure `https://github.com/mozilla/Fira`.
- **Pesi**: **nessun font variabile**. Nove statici disegnati: Thin, ExtraLight, Light, Regular, Medium, SemiBold, Bold, ExtraBold, Black. Tutti pesi reali, ma si paga a file.
- **Numeri**: cifre **proporzionali di default**, quindi `font-variant-numeric: tabular-nums` è **obbligatorio** su ogni orario, telefono e civico. Con `tnum` tutte le cifre vanno a 560/1000, e la prova HarfBuzz conferma l'allineamento perfetto. Attenzione: le tabulari sono **più larghe** delle proporzionali (l'orario passa da 4920 a 5363 unità), quindi le colonne vanno dimensionate sulla versione tabulare. Altezza cifra 679 contro cap 689. Set numerico il più ricco del gruppo: lining tabulari, lining proporzionali, oldstyle proporzionali (`.osf`), **oldstyle tabulari** (`.tosf`, con `onum` + `tnum`), e **zero barrato** (`zero` → `zero.zero`). `tnum` porta a larghezza fissa anche valute, segni matematici e trattino figura: utile per tabelle di orari con intervalli.
- **Small caps**: 661 `smcp` + 638 `c2sc`, altezza 564 fra x-height 527 e cap 689, accentati compresi. Ha anche `cpsp` in GPOS, cioè la spaziatura ottica delle maiuscole, che nessun'altra candidata tabulare-di-default offre.
- **woff2 (subset latin, tutte le feature)**: 300 → **31,8 KB**; 400 → **32,1**; 500 → **32,5**; 600 → **33,6**; 700 → **33,9**; 900 → **33,3**. Quattro pesi = **circa 132 KB**, contro i 50 KB del variabile di Source Sans. Con latin + latin-ext si sale a ~76-83 KB per peso.
- **Riserva**: upstream congelato dal 2015 e archiviato. Non è un rischio funzionale immediato (il file è quello che è, e OFL permette di ripubblicarlo), ma non arriveranno correzioni.

### 4.3 Noto Sans

- **Versione ispezionata**: 2.015 (`google/fonts` `ofl/notosans/NotoSans[wdth,wght].ttf`). Upstream `notofonts/latin-greek-cyrillic`, manutenzione attiva.
- **Licenza**: SIL Open Font License 1.1.
- **Dove si scarica**: `https://github.com/google/fonts/raw/main/ofl/notosans/NotoSans%5Bwdth,wght%5D.ttf` oppure `https://github.com/notofonts/latin-greek-cyrillic/releases`.
- **Pesi**: variabile a due assi, `wght` 100-900 e `wdth` 62.5-100, 9 istanze nominate, 3 posizioni di master su `wght`.
- **Numeri**: cifre **lining tabulari di default** (572/1000). `tnum` esiste ma **non tocca le cifre di default**: mappa solo le oldstyle proporzionali sulle oldstyle tabulari. Scriverlo in CSS è innocuo, non serve. `pnum` porta alle proporzionali, da evitare. `onum` dà oldstyle **tabulari** (547). **Zero barrato** disponibile (`zero` → `zero.slash`). Nota: l'altezza cifra è 725 contro cap-height 717, cioè le cifre sono **appena più alte delle maiuscole**: in un elenco di orari accanto a nomi propri in maiuscolo si nota, e va guardato dal vivo in #6.
- **Small caps**: vere, 336 `smcp` + 303 `c2sc`, altezza 574 fra x-height 536 e cap 717, accentati coperti, tutte con dati di variazione sul peso.
- **woff2 (subset latin)**: variabile con entrambi gli assi **92,3 KB**; variabile con `wdth` fissato a 100 **55,8 KB**; statico 400 **20,1 KB**; statico 700 **20,5 KB**. È la più piccola per peso statico dell'intera rosa. Se si prende il variabile, va **instanziato via `fontTools`** per togliere l'asse di larghezza che non serve.
- **Riserva**: tono. Noto Sans è progettata per essere il minimo comune denominatore tipografico del pianeta. Non ha difetti, ma non ha nemmeno una voce, e `PRODUCT.md` chiede che "il contenuto specifico è il design": una font che assomiglia a tutto rischia di sembrare l'impostazione predefinita più che una scelta.

### 4.4 Work Sans

- **Versione ispezionata**: 2.012 (`google/fonts` `ofl/worksans/WorkSans[wght].ttf`). Upstream `weiweihuanghuang/Work-Sans`, ultimo push 2024.
- **Licenza**: SIL Open Font License 1.1.
- **Dove si scarica**: `https://github.com/google/fonts/raw/main/ofl/worksans/WorkSans%5Bwght%5D.ttf`.
- **Pesi**: variabile `wght` 100-900 con **5 posizioni di master** (picchi `gvar` a -1, 0.38, 0.6, 1 più il default): la migliore qualità di interpolazione misurata nel gruppo.
- **Numeri**: proporzionali di default, `tnum` **obbligatorio** e funzionante (tutte a 604/1000, prova HarfBuzz superata). Oldstyle proporzionali e oldstyle tabulari disponibili. **Zero barrato** disponibile. Cifre a 670 contro cap 660: leggermente sopra le maiuscole.
- **Small caps**: vere, 281 `smcp` + 256 `c2sc`, altezza 560 fra 500 e 660, accentati coperti, variabili sul peso.
- **woff2 (subset latin)**: variabile **75,1 KB**; statico 400 **30,3 KB**; statico 700 **32,2 KB**.
- **Riserva**: è nata come font da titoli e testi a corpo medio-grande, con forme larghe. Su un elenco denso di indirizzi occupa più spazio orizzontale a parità di corpo. Da verificare in #6 su una lista di sedi vera.

### 4.5 IBM Plex Sans, bocciata sul maiuscoletto

- **Versione ispezionata**: 3.201 (`google/fonts`), upstream `IBM/plex` (`@ibm/plex-sans@1.1.0`, novembre 2024), OFL 1.1.
- **Perché sarebbe stata la candidata perfetta**: è la font più "documentale" della rosa, e sui numeri è **imbattibile**. Non ha affatto le cifre proporzionali: `pnum` non esiste nel font, tutte le cifre sono tabulari a 600/1000 **sempre**, con qualunque combinazione di feature. Non è possibile disallineare una colonna di orari nemmeno per errore. `onum` dà oldstyle a loro volta tabulari, e `zero` dà lo zero barrato (`zero.alt02`).
- **Perché è bocciata**: **nessuna small caps**. Zero glifi `.sc`, feature `smcp` e `c2sc` assenti sia nel build Google Fonts sia nel pacchetto IBM. Il livello Label di `DESIGN.md` ("qualifiche, province, sigle") resterebbe senza maiuscoletto reale, e la sola alternativa sarebbe la sintesi del browser o un `text-transform: uppercase` con letter-spacing, che è un'altra cosa.
- **Altro limite**: l'asse `wght` del variabile arriva **solo a 700**, con 2 sole posizioni di master. `DESIGN.md` costruisce il Display sul "peso pesante": non esistono ExtraBold o Black.
- **woff2 (subset latin)**: variabile 68,5 KB; statico 400 22,4 KB; statico 700 22,7 KB.

### 4.6 Public Sans, bocciata sul maiuscoletto

- **Versione ispezionata**: 2.001 (`google/fonts`), upstream `uswds/public-sans` (release `v2.001`, repo attivo).
- **Licenza**: SIL Open Font License 1.1. Il `LICENSE.md` upstream lo dice in modo articolato: il repo combina la Original Version di Libre Franklin (OFL) con modifiche della GSA che, essendo opera del governo degli Stati Uniti, non sono soggette a copyright. Il risultato è distribuito come Modified Version sotto OFL. L'API GitHub segna `NOASSERTION` solo per il formato del file.
- **Perché sarebbe stata la candidata perfetta**: è letteralmente la font di un sistema di design della pubblica amministrazione, cioè il riferimento civico che `DESIGN.md` dichiara come north star, ed è la più leggera di tutte (variabile latin **26,1 KB**, statico 400 **14,7 KB**). `tnum` c'è e funziona (1400/2000, prova HarfBuzz superata).
- **Perché è bocciata**: **nessuna small caps**, come IBM Plex. Nessun glifo, nessuna feature.
- **Altro limite**: il variabile dichiara 9 istanze su `wght` 100-900 ma ha **una sola posizione di master oltre il default**, cioè tutta la scala di pesi è un'interpolazione lineare fra due estremi. Non è sintesi del browser e formalmente il vincolo dei "4 pesi reali" regge, ma la qualità dei pesi intermedi è inferiore a quella di Work Sans o Fira. Manca anche lo zero barrato.

### 4.7 Inter, il controllo negativo

Vale la pena metterlo a verbale perché è la scelta di default di quasi ogni progetto e sembra soddisfare tutto.

- Versione 4.001 su Google Fonts, 4.1 upstream (`rsms/inter`), OFL 1.1.
- `tnum` c'è e funziona (1328/2048, prova HarfBuzz superata), `zero` barrato c'è, `case` c'è, i maiuscoli accentati ci sono.
- **`smcp` e `c2sc` sono assenti.** Inter non ha maiuscoletto vero, in nessuna versione. Verificato sul file 4.001 di Google Fonts: la stringa `Città Metropolitana MI` esce identica con e senza `smcp` attivo.
- Inoltre pesa: il variabile latin con l'asse `opsz` è **103,5 KB**.

### 4.8 Seconda fascia, verificate ma non approfondite

Tutte OFL 1.1, tutte con `smcp` + `c2sc` reali e `tnum` funzionante, tenute in panchina per ragioni di tono o di forma:

| famiglia | pesi | numeri | small caps | woff2 latin | perché in panchina |
|---|---|---|---|---|---|
| **Encode Sans** 3.002 | VF `wght` 100-900 + `wdth` 75-125, 1 master oltre il default | `tnum` → 1000/2000, ok | 283 `smcp` + 288 `c2sc`, reali | 56,8 KB (VF con entrambi gli assi) | 45 istanze nominate, asse di larghezza inutile qui; interpolazione a due master |
| **Barlow** 1.408 | 9 statici disegnati | `tnum` → 527/1000, ok | 108 `smcp` + 108 `c2sc`, reali ma copertura minima | 23,7 KB per peso | grottesca "low-contrast" di derivazione californiana, tono più sportivo che documentale; niente zero barrato né oldstyle |
| **Signika** | VF `wght` 300-700 | tabulari di default | `smcp` + `c2sc` presenti | non misurata | pensata per segnaletica, ha personalità marcata: contro il "nessun font di personalità" di `DESIGN.md` |

### 4.9 Escluse in partenza, con la prova

| famiglia | motivo |
|---|---|
| **Libre Franklin** 3.000 | Il build su Google Fonts **non ha nessuna feature numerica né di maiuscoletto**: GSUB contiene solo `aalt ccmp dnom frac kern liga locl mark mkmk numr ordn rvrn sinf subs sups`. Niente `tnum`, niente `smcp`, e le cifre di default sono proporzionali. Doppia bocciatura. |
| **Lato** | `tnum` presente e cifre tabulari di default, ma **nessuna `smcp`**. |
| **Open Sans** | `tnum` presente, cifre tabulari di default, **nessuna `smcp`**. |
| **Roboto Flex** | Cifre tabulari di default ma **nessuna `tnum`, `smcp`, `c2sc`, `onum`, `zero`**. |
| **Hanken Grotesk**, **Commissioner**, **Cabin** | Nessuna `tnum` e nessuna `smcp`. |
| **Instrument Sans**, **Red Hat Text**, **Manrope**, **Archivo** | `tnum` sì, `smcp` no. |
| **Alegreya Sans** | `tnum` e `smcp` ci sono, ma è una umanista calligrafica con forte personalità, contro il vincolo di tono. Esiste anche la famiglia separata Alegreya Sans SC, che però costringe a caricare un secondo file solo per il livello Label. |

---

## 5. Note trasversali che valgono per l'implementazione

**Le sigle richiedono `c2sc`, non `smcp`.** Il livello Label di `DESIGN.md` contiene "qualifiche, province, sigle di riconoscimento": CSEN-CONI, F.E.K.D.A., P.T.D., MI, BG. Sono già in maiuscolo, e `smcp` da solo **non le tocca**, perché trasforma solo le minuscole. Prova, shaping di `Città Metropolitana MI`:

```
default:  C i t t agrave space M e t r o p o l i t a n a space M I
smcp:     C i.sc t.sc t.sc agrave.sc space M e.sc ... space M I     <- "MI" invariato
smcp+c2sc: c.sc i.sc t.sc t.sc agrave.sc space m.sc ... space m.sc i.sc
```

In CSS significa `font-variant-caps: all-small-caps` (che attiva `smcp` **e** `c2sc`), non `small-caps`. Tutte e quattro le candidate promosse hanno `c2sc`.

**Il maiuscoletto sintetico è la trappola.** Se si sceglie una font senza `smcp`, `font-variant-caps: small-caps` non fallisce: il browser rimpicciolisce le maiuscole. Il risultato ha aste troppo sottili rispetto al testo attorno e stona esattamente nei punti dove `DESIGN.md` mette le prove (qualifiche accanto ai nomi degli istruttori). È il motivo per cui la bocciatura di IBM Plex e Public Sans è netta e non negoziabile.

**Due famiglie di comportamento sui numeri, due CSS diversi.**

- Tabulari di default (Source Sans 3, Noto Sans, IBM Plex Sans): non serve fare nulla, ma **non si deve mai attivare `pnum`** né `font-variant-numeric: proportional-nums`. Vale la pena scriverlo come regola nel design system, perché è un errore silenzioso: si nota solo guardando una colonna di orari storta.
- Proporzionali di default (Fira Sans, Work Sans, Public Sans, Inter): serve `font-variant-numeric: tabular-nums` su ogni elemento che porta un dato, e le colonne vanno dimensionate sulla cifra tabulare, che è più larga della proporzionale media.

**Font variabile e sintesi dei pesi.** Il vincolo "pesi reali, non sintetizzati" riguarda il faux bold del browser, non l'interpolazione: un asse `wght` con master reali produce disegni veri a ogni valore. Va comunque dichiarato `font-weight: <min> <max>` nel `@font-face`, e conviene `font-synthesis: none` per far emergere subito un peso mancante invece di lasciarlo ingrassare al browser.

**Accenti maiuscoli e interlinea.** Nessuna candidata ha l'accento di `À` sopra `usWinAscent`, quindi non c'è rischio di taglio nel caso normale. Il margine più stretto è quello di **Fira Sans**: `À` arriva a 911 su un `winAscent` di 935, cioè il 97%. Con `line-height` sotto 1.0 su un titolo tutto maiuscolo accentato va guardato.

**Nessuna candidata richiede latin-ext.** L'italiano sta interamente nel subset `latin` di Google Fonts (`U+0000-00FF` copre `àèéìòù` e i maiuscoli accentati). Servire anche latin-ext raddoppia circa il peso: 49,9 KB contro 98,1 KB sul variabile di Source Sans 3. Il subset va fatto **conservando le feature di layout**, altrimenti `pyftsubset` butta via i glifi small cap che non hanno un codepoint Unicode proprio.

---

## 6. Cosa resta aperto per #6

La tabella non decide. Quello che va provato sui dati veri:

1. Una colonna di **orari veri di più sedi** (righe a 1px come da `DESIGN.md`, non card), per vedere se la cifra tabulare stretta di Source Sans (472/1000) risulta troppo compressa o se quella larga di Fira (560/1000) mangia troppa riga.
2. Le **sigle vere** (CSEN-CONI, F.E.K.D.A., P.T.D.) a livello Label in `all-small-caps`, corpo piccolo e spaziatura aperta, per giudicare il disegno del maiuscoletto e non la sua sola esistenza.
3. Un **nome proprio di sede lungo** in Title accanto a un indirizzo, ad esempio "Rozzano, Centro Aisha", per il contrasto di peso fra Title e Body all'interno di una sola famiglia.
4. Il **budget di byte**: Source Sans 3 variabile completo costa 50 KB e copre tutta la scala; quattro statici di Fira ne costano 132. Se il progetto usa davvero cinque livelli di peso, il variabile vince; se ne usa tre, il divario si assottiglia.
5. Il **peso ottico del Display**. Nessuna delle promosse ha un Black particolarmente ricco di carattere: se il titolo di percorso a peso pesante risulta debole, la conclusione potrebbe essere che serve una seconda famiglia solo per il Display, che però `DESIGN.md` esclude ("una sola grottesca"). È una tensione da risolvere guardandola, non discutendola.
