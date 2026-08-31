# Corpus di riferimento documentale: il registro pubblico ben tenuto

Ricerca per la issue [#2](https://github.com/mgiuditta/akmitalia/issues/2) (parte di #1).

**Domanda.** Quali artefatti reali del registro pubblico ben tenuto definiscono la griglia, la densità e il ritmo tipografico che «L'Albo» (`DESIGN.md`) dichiara ma non quantifica?

**Perché serve.** `DESIGN.md` dice «documentale prima che promozionale», «elenchi con righe a 1px», «massimo 65-75ch», «il salto Display/Headline è almeno 1.25», e poi lascia `[valori esatti da definire in implementazione]`. Senza corpus, davanti a un catalogo di componenti si sceglie quello che sembra più bello, cioè il default SaaS. Con corpus, si sceglie quello che assomiglia a un registro, e si può discutere sui numeri invece che sui gusti.

**Criterio di inclusione.** Solo artefatti civici o istituzionali che quantificano: sistemi di design di Stato con codice pubblico, manuali di segnaletica, specifiche di stampa istituzionale, tipografia progettata per elenchi densi. Escluse gallerie di ispirazione, template, siti di categoria.

**Metodo.** Ogni numero qui sotto viene dalla fonte che lo possiede: pagina di documentazione ufficiale, CSS compilato del sistema (l'artefatto, non il racconto dell'artefatto), o PDF dello standard. Dove ho estratto testo da un PDF via `pdftotext` lo dichiaro.

---

## 1. GOV.UK Design System (Government Digital Service, UK)

Il registro digitale di Stato più copiato al mondo. È esattamente il caso d'uso di AKM: pagine che elencano fatti (indirizzi, date, importi, qualifiche) per un pubblico che non ha scelto di essere lì.

**Cosa fa bene, in numeri:**

- **Misura della colonna.** Larghezza massima di pagina di default **1020px**; per la maggior parte delle pagine è raccomandato un impianto a **due terzi** o **due terzi + un terzo**, «per evitare che le righe di testo diventino così lunghe da rendere la pagina difficile da leggere su desktop. Questo di solito significa **non più di 75 caratteri per riga**». La misura non è imposta dal `max-width` del testo ma dalla griglia: la colonna larga esiste, il testo non ci entra dentro.
- **Rapporto riga/interlinea.** Scala tipografica a 7 punti; corpo del testo **19px/25px** (1.32) su schermi ≥640px, titoli **36px/40px** (1.11) e **48px/50px** (1.04). Regola dichiarata: **ogni punto della scala usa un'interlinea multipla di 5px**, per mantenere un ritmo verticale costante. Su schermi piccoli i titoli scendono (48→32, 36→27) ma **il corpo resta 19px**: il dato non si rimpicciolisce col telefono.
- **Scala di spaziatura.** 9 gradini, responsive: 0, 5, 10, 15, 20, 25, 30, 40, 50, 60px su schermo grande; i gradini da 4 in su si comprimono su schermo piccolo (20→15, 25→15, 30→20, 40→25, 50→30, 60→40). I gradini piccoli (5, 10, 15px) **non cambiano mai**: la spaziatura interna di una voce è stabile, quella tra blocchi respira.
- **Come separa le voci.** Il componente `summary-list` (la scheda dati di GOV.UK: chiave a sinistra, valore a destra) è una tabella con **righe da 1px `#b1b4b6`**, celle con **10px di padding sopra e sotto** e **20px a destra**, colonna chiave **30%** in **peso 700**, valore 50%, azioni 20%. Nessuna card, nessuna ombra, nessun fondo alternato.

**Fonti.** [Type scale](https://design-system.service.gov.uk/styles/type-scale/), [Layout](https://design-system.service.gov.uk/styles/layout/), [Spacing](https://design-system.service.gov.uk/styles/spacing/), sorgente [`_typography-responsive.scss`](https://github.com/alphagov/govuk-frontend/blob/main/packages/govuk-frontend/src/govuk/settings/_typography-responsive.scss); valori del `summary-list` letti nel CSS compilato `govuk-frontend@5.7.1` (`dist/govuk/govuk-frontend.min.css`, selettori `.govuk-summary-list__row`, `.govuk-summary-list__key`).

**Cosa ne prende il kit AKM.** La coppia «griglia larga, testo stretto»: la scheda sede può occupare tutta la pagina, il testo corrente no, e il limite dei 75 caratteri viene dalla colonna non dal `max-width` a spanna. Il ritmo verticale ancorato a un modulo unico (5px lì, 4px per noi, vedi §2) e l'interlinea che è sempre un multiplo di quel modulo. La `summary-list` è già il modello della scheda sede: indirizzo, orari, referente come righe chiave/valore a 1px, non come card.

---

## 2. Designers Italia / Bootstrap Italia (AGID, sistema di design della PA italiana)

È la norma di riferimento per gli elenchi pubblici italiani veri (albi pretori, elenchi di iscritti, portali di ordine professionale che si sono adeguati alle linee guida di design per i servizi digitali della PA). Rilevante due volte: quantifica, ed è la convenzione visiva che il pubblico italiano associa a «registro ufficiale».

**Cosa fa bene, in numeri:**

- **Misura della colonna.** Raccomandazione esplicita: «una lunghezza massima di **75 caratteri per riga**», e divieto altrettanto esplicito del testo giustificato senza sillabazione, «per l'incongrua spaziatura delle parole e la minore leggibilità».
- **Ritmo.** L'interlinea di titoli e corpo è calcolata sulla **griglia orizzontale** del sistema (la documentazione dei fondamenti cita una baseline a **4px**; l'interlinea del corpo è **1.5** con corpo base **16px**, cioè 24px, sei moduli).
- **Come separa le voci.** Il componente lista (`.it-list`) è la definizione operativa di «elenco a righe» nel contesto italiano: ogni voce ha **`border-bottom: 1px solid hsl(210,4%,78%)`** e **`margin-top: -1px`** (i bordi collassano, non raddoppiano), la zona di contenuto ha **`padding: 16px 0`**, l'ultima voce perde la riga.
- **Come tratta i metadati.** Dentro la stessa voce convivono tre livelli tipografici e nessuna card: titolo `.text` a **1rem/600** (1.125rem al breakpoint maggiore), descrizione secondaria a **0.875rem/400** in grigio `hsl(210,17%,44%)`, metadato `.metadata` a **0.75rem** con **`letter-spacing: 0.5px`** nello stesso grigio. La gerarchia interna alla voce è di **peso e di corpo**, con un solo salto di colore.

**Fonti.** [Designers Italia, Tipografia](https://designers.italia.it/design-system/fondamenti/tipografia/); [Linee guida di design per i servizi web della PA](https://docs.italia.it/italia/designers-italia/design-linee-guida-docs/it/stabile/doc/user-interface/design.html); valori letti nel CSS compilato `bootstrap-italia@2.16.0` (`dist/css/bootstrap-italia.min.css`, selettori `.it-list .list-item`, `.it-right-zone .text`, `.metadata`, variabili `--bs-body-font-size: 1rem`, `--bs-body-line-height: 1.5`).

**Cosa ne prende il kit AKM.** I tre livelli dentro una voce d'elenco (nome / descrizione / metadato) come **1 : 0.875 : 0.75 rem**, distinti da peso e grigio, mai da un riquadro. Il `margin-top: -1px` sulle voci: dettaglio banale che è la differenza tra un elenco e una pila di scatole. E il divieto di giustificato, che vale come regola scritta anche per noi.

*Limite dichiarato:* ho verificato la specifica del sistema, non la resa di uno specifico albo online (albo unico CNI, albi degli ordini provinciali). Quelli sono istanze, spesso applicazioni JavaScript, e misurarne una singola non dice nulla di più della norma che dovrebbero seguire.

---

## 3. U.S. Web Design System (USWDS, governo federale USA)

L'unico sistema civico che tratta la **misura della colonna come un token di design**, con nome e valore, invece che come un consiglio.

**Cosa fa bene, in numeri:**

- **Misura come token.** Sei valori, espressi in `ex` (altezza della x, quindi legati al carattere e non ai pixel): **44ex, 60ex, 64ex, 68ex, 72ex, 88ex**, più `none`. Si applicano come funzione (`measure(3)`), mixin, impostazione di tema o classe utility.
- **Regola dichiarata.** «La maggior parte delle righe di testo dovrebbe stare fra **45 e 90 caratteri**», con **66 come bersaglio** per la lettura estesa.
- **Interlinea come token.** Sei valori normalizzati: **1** (bottoni, navigazione, testo che non va a capo), **1.15** (titoli e occhielli, 1-2 frasi), **1.35** (testo breve, didascalie, misure molto corte o molto lunghe), **1.5** (1-2 paragrafi, soprattutto con misura corta), **1.62** («una buona scelta per la maggior parte del testo di lettura»), **1.75** (testo breve da distinguere dal resto, citazioni).
- **La regola di accoppiamento**, quella che quasi nessuno scrive: «**un testo con interlinea maggiore può avere una misura più lunga**», e viceversa «righe lunghe possono beneficiare di un'interlinea leggermente inferiore al solito» quando l'eccesso di piombo isola troppo le righe.

**Fonti.** [Measure tokens](https://designsystem.digital.gov/design-tokens/typesetting/measure/), [Line height tokens](https://designsystem.digital.gov/design-tokens/typesetting/line-height/), [Typography](https://designsystem.digital.gov/components/typography/).

**Cosa ne prende il kit AKM.** Misura e interlinea diventano **due token accoppiati**, non due valori scelti separatamente: `misura lunga → interlinea alta`, `misura corta → interlinea bassa`. E l'unità `ex`/`ch` invece dei pixel, così la misura resta corretta se cambia la grottesca.

---

## 4. NPS Unigrid (National Park Service, sistema Vignelli, 1977)

Il pieghevole informativo di un ente federale: stessa natura del nostro problema, cioè testo denso, elenchi, mappe, orari e didascalie che devono convivere in una superficie unica e restare leggibili a milioni di copie. È il documento che quantifica di più di tutto il corpus.

**Cosa fa bene, in numeri:**

- **Griglia.** Base derivata dal foglio B6 (**420 × 594 mm**), con **12 pannelli per lato**; **10 formati** in due serie, tutti segmenti dello stesso foglio. Il modulo piegato (formato tascabile, costante di tutto il sistema) è **99 × 210 mm**.
- **Modulo.** Modulo A: larghezza **6,5 pica**, altezza **80 punti**. Modulo B: larghezza **7 pica**, stessa altezza **80 punti**. **Spazi verticali fra moduli sempre 1 pica; spazi orizzontali sempre 10 punti.** Le misure orizzontali si esprimono in pica, le verticali in punti, i formati esterni in millimetri.
- **Misura della colonna.** Testo in **8/10 o 9/10 Helvetica** (corpo 8-9 pt su 10 pt di interlinea, cioè un rapporto di **1,11-1,25**) su misure di **14 o 21,5 pica** (serie A) e **15 o 23 pica** (serie B). A 8 pt su 14 pica si sta intorno ai **40-45 caratteri**: colonna stretta, non colonna comoda, perché sono colonne multiple.
- **Ritmo di separazione.** Sopra ogni blocco di testo un **fascione orizzontale costante di 40 punti**; sotto, un salto di **almeno 20 punti**. Rapporto **2:1** fra lo spazio che apre e quello che chiude. Le colonne sono giustificate, allineate in alto e in basso «per accentuare gli orizzontali»; **nessun rientro**, e lo stacco fra paragrafi è **una riga bianca**.
- **Gerarchia e metadati.** Titolo del parco **60 pt Helvetica Medium** maiuscolo/minuscolo se sotto 12 lettere, **42 pt** se più lungo; designazione del sito e località **12/14 o 8/9**; display maggiore **12, 18 o 24 pt** posizionato **10 punti sopra** il testo che introduce; didascalie **7/7, 7/8 o 8/9** su misure di **6,5-7 o 14-15 pica**, allineate a bandiera (rag right) mentre il testo è giustificato: **la didascalia si distingue dal testo per allineamento, non per un box**. Tutto il tipo è appeso **10 punti sotto il taglio superiore**.
- **Le barre.** Barra nera di testata da **100 punti**, barre di piede e di divisione da **25 punti**: «questi elementi orizzontali definiscono i limiti della presentazione grafica» e «rendono più facile localizzare le informazioni».

**Fonte.** *Unigrid Design Specifications*, National Park Service, Informational Folder Program (documento originale del programma, testo estratto con `pdftotext -layout` da <https://npshistory.com/brochures/unigrid.pdf>).

**Cosa ne prende il kit AKM.** Tre cose. (a) Il **rapporto 2:1 fra spazio sopra e spazio sotto** un blocco: è la regola che fa leggere un elenco come una serie di voci invece che come una poltiglia, e vale 1:1 con i nostri gruppi di elenco. (b) La **didascalia distinta per allineamento e corpo, non per contenitore**: i nostri metadati di sede si distinguono così. (c) La **barra nera come indice**: la nostra riga a 1px fa lo stesso lavoro con meno inchiostro, ma va usata con la stessa disciplina, cioè sempre nello stesso posto, sempre della stessa dimensione, mai decorativa.

---

## 5. TfL Text Legibility Standard, Issue 3 (Transport for London)

Uno standard operativo, scritto con il Royal National Institute of Blind People, che vincola tutta la comunicazione testuale di un ente di trasporto: cartelli, poster, pannelli, documenti A4. È la fonte più vicina al nostro problema «testo civico che deve funzionare per tutti, di sera, di fretta».

**Cosa fa bene, in numeri:**

- **Misura della colonna.** «Le righe **non devono mai superare i 70 caratteri**.» Vincolo, non consiglio.
- **Corpo minimo legato alla distanza di lettura.** «Il corpo minimo di una pubblicazione è determinato dalla distanza da cui ci si aspetta che venga letta.» Per un **A4 il corpo minimo è 12 pt** (≈3 mm di altezza maiuscola); un pannello di fondo carrozza letto a **1,5 m** vuole **27 pt / 6 mm**; un poster letto a **3 m** vuole **86 pt / 20 mm**; a **26 m** si arriva a **370 pt / 87 mm**.
- **Peso invece di corsivo.** «Non usare corsivi. **Per enfatizzare una parola, usa un peso diverso.**»
- **Mai maiuscolo pieno.** «Il testo va sempre composto in maiuscolo e minuscolo (mai tutto maiuscolo, **nemmeno nei titoli**).»
- **Allineamento e interlinea.** Sempre a bandiera sinistra, mai giustificato né a bandiera destra; centrato solo su poster e solo se il testo non supera **tre righe**. «**Non ridurre l'interlinea.**» «**Usa interlinea aggiuntiva per ottenere una separazione chiara fra i paragrafi.**» Nessun rientro di prima riga. Nessuna modifica alla spaziatura fra caratteri.
- **Contrasto.** Rapporto richiesto **4,5:1** per il testo normale e **3:1** per il testo grande, con «testo grande» definito come **≥18 pt** (WCAG AA).
- **Peso in funzione del corpo.** Johnston 100 Light per il corpo **fino a 12 pt**, Regular **sopra i 12 pt**: il peso compensa il corpo, non lo segue.

**Fonte.** *TfL text legibility standard, Issue 3*, Transport for London, <https://content.tfl.gov.uk/tfl-text-legibility-standard-issue03.pdf> (testo estratto con `pdftotext -layout`).

**Cosa ne prende il kit AKM.** Il tetto duro dei **70 caratteri** (più severo del 75 di GOV.UK e AGID: adottiamo 70 come limite e 66 come bersaglio). La regola «**enfasi = peso**», che sostituisce corsivo e colore e che è la versione tipografica della nostra Regola dell'Etichetta. La regola «**separazione = interlinea aggiuntiva**», che sostituisce il divisore quando lo stacco è dentro un blocco di testo. E un avvertimento diretto al nostro livello Label: `DESIGN.md` chiede «maiuscoletto» per qualifiche e sigle, ma qui il maiuscolo pieno è vietato persino nei titoli. Compromesso quantificato: maiuscoletto **solo per token brevi** (≤ 24 caratteri, tipo `CSEN-CONI`, `MILANO`, `ISTRUTTORE`), **mai** per frasi, titoli o testo di lettura.

---

## 6. MUTCD, 11ª edizione, §2A.08 «Word Messages» (Federal Highway Administration, USA)

La norma federale che regola ogni cartello stradale degli Stati Uniti. Interessa non per la segnaletica in sé, ma perché è il posto dove il rapporto **dimensione ↔ distanza ↔ quantità di parole** è scritto come regola verificabile.

**Cosa fa bene, in numeri:**

- **Indice di leggibilità.** «I messaggi devono essere **il più brevi possibile**, e le lettere abbastanza grandi da fornire la distanza di leggibilità necessaria. Si dovrebbe usare un rapporto minimo di **1 pollice di altezza della lettera per ogni 30 piedi di distanza di leggibilità**» (§2A.08 ¶08). Cioè circa **1 mm di altezza ogni 34 cm di distanza**.
- **Maiuscolo/minuscolo obbligatorio per i nomi propri.** «Le lettere per **nomi di luoghi, strade e itinerari** devono essere composte in **minuscolo con iniziale maiuscola**; gli altri messaggi in maiuscolo» (¶04). I nomi propri sono il caso in cui la forma della parola aiuta il riconoscimento.
- **Rapporto occhio/maiuscola dichiarato.** «Quando si usa una composizione mista, l'altezza dell'occhio delle minuscole deve essere **¾ dell'altezza della maiuscola iniziale**» (¶05).
- **Punteggiatura vietata.** Niente punti, apostrofi, punti interrogativi, e commerciali «o altri caratteri che non siano lettere, numeri o trattini, se non necessari a evitare confusione» (¶10). Abbreviazioni ridotte al minimo (¶09).
- **Le forme non si toccano.** «Le forme delle lettere di ciascuna serie **non devono essere allungate, compresse, deformate** o altrimenti manipolate» (¶06).

**Fonte.** *Manual on Uniform Traffic Control Devices, 11th Edition (December 2023), Chapter 2A*, FHWA, <https://mutcd.fhwa.dot.gov/pdfs/11th_Edition/Chapter2a.pdf> (testo estratto con `pdftotext -layout`; §2A.08 ai paragrafi 04, 05, 06, 08, 09, 10).

**Cosa ne prende il kit AKM.** Il principio che **la dimensione discende dalla distanza di lettura, non dall'importanza percepita**: sul telefono, tenuto a 30-40 cm, il corpo minimo del dato nudo si calcola, non si negozia (vedi §Vincoli). Il **nome proprio in maiuscolo/minuscolo** sempre, che è la nostra Regola del Nome Proprio con una motivazione tecnica invece che retorica. Il **divieto di deformare il carattere** (niente `font-stretch`, niente scale non uniformi, niente finte grottesche condensate). E il rapporto ¾ occhio/maiuscola come criterio di scelta della grottesca: una famiglia con occhio grande regge corpi piccoli, ed è quello che ci serve per gli orari.

---

## 7. Bell Centennial e l'elenco telefonico AT&T (Matthew Carter, 1975-1978)

L'annuario per antonomasia: milioni di voci, ognuna composta da nome, indirizzo e numero, su carta scadente, a corpo minimo. Il problema di gerarchia che AKM ha nella pagina «albo istruttori», moltiplicato per mille.

**Cosa fa bene, in numeri:**

- **Un solo corpo, quattro pesi funzionali.** La famiglia non ha «Regular / Bold / Italic»: ha quattro stili **nominati per la funzione che svolgono nella voce d'elenco**: **Name & Number**, **Address**, **Bold Listing**, **Sub-Caption**. Il nome dell'abbonato, il suo indirizzo e le inserzioni si distinguono **per peso e larghezza dentro lo stesso corpo**, non per corpo diverso e non per rientri.
- **Corpo di esercizio.** Progettato per essere composto e stampato a **6 pt** su carta da quotidiano ad alta velocità.
- **Vincoli fisici quantificati.** Specifica di commessa: «qualunque minuscola usata per Name & Number deve avere un'asta verticale non inferiore a **0,008 pollici**» (≈0,2 mm); la resa CRT avveniva a circa **850 linee per pollice**, con le aste più leggere risolte da **4-6 linee di scansione**; la tolleranza di riproduzione era di **±0,0015 pollici**. Le **ink trap** profonde servivano a compensare l'allargamento dell'inchiostro mantenendo aperte le contrograzie.
- **Obiettivo di progetto misurabile.** Far stare **più caratteri per riga senza perdere leggibilità**, per ridurre abbreviazioni e voci a due righe: la densità come risparmio di carta, non come vezzo.

**Fonti.** Nick Sherman, [«Bell Centennial»](https://nicksherman.com/articles/bellCentennial.html) (ricostruzione con citazioni dalla specifica AT&T); [Bell Centennial, Wikipedia](https://en.wikipedia.org/wiki/Bell_Centennial); scheda [MoMA, Matthew Carter, Bell Centennial, 1976-1978](https://www.moma.org/collection/works/139307).

**Cosa ne prende il kit AKM.** Il modello di gerarchia che `DESIGN.md` cerca quando dice «una sola grottesca, forte contrasto di peso»: **quattro ruoli nominati per funzione** invece di una scala di corpi. Nome dell'istruttore / nome della sede = peso alto; indirizzo e orario = peso normale; qualifica e sigla = peso etichetta; e nient'altro. In un elenco lungo, **cambiare peso costa meno spazio verticale che cambiare corpo**, ed è per questo che gli annuari lo fanno.

---

## 8. SBB Lyne Design System (Ferrovie Federali Svizzere)

L'orario di trasporto, versione digitale, di un'azienda pubblica il cui mestiere è pubblicare tabelle. Utile perché smentisce un pregiudizio: il sistema che tratta più dati al metro quadro **apre** l'interlinea invece di stringerla.

**Cosa fa bene, in numeri:**

- **Scala tipografica.** Dodici gradini ancorati al corpo base 16px: **12, 13, 14, 16, 18, 20, 24, 32, 40, 48, 56, 64 px**. Tre gradini sotto il corpo base servono a etichette e metadati: la parte densa della scala è dove stanno i dati, non dove stanno i titoli.
- **Interlinea.** **1.75 per il testo**, **1.4 per i titoli**. Il rapporto è invertito rispetto all'intuizione: più il testo è di servizio, più aria prende fra le righe.
- **Spaziatura fra caratteri.** **0.03em sul testo**, **0 sui titoli**: la spaziatura leggermente aperta è riservata al testo piccolo e denso, dove le lettere tendono a chiudersi.

**Fonte.** [SBB Lyne, Design Tokens: Typography](https://digital.sbb.ch/en/design-system/lyne/design-tokens/typography/).

**Cosa ne prende il kit AKM.** L'inversione: **l'interlinea dei dati è più alta di quella dei titoli**, non più bassa. Un blocco di orari a 1.4 sembra ordinato al designer e diventa illeggibile al genitore che cerca il martedì. E la spaziatura di **+0.03em riservata ai corpi piccoli** (etichette, sigle, province), che è esattamente il `letter-spacing: 0.5px` su 12px del sistema italiano (§2): due enti pubblici indipendenti che convergono sullo stesso numero.

---

## 9. Robert Bringhurst, *The Elements of Typographic Style*, §2.1.2

La fonte primaria della letteratura, citata qui solo dove quantifica.

**Cosa fa bene, in numeri:**

- «**Qualunque valore fra 45 e 75 caratteri** è considerato una lunghezza di riga soddisfacente per una pagina a colonna singola composta in un carattere con grazie a corpo di testo», e «la riga da **66 caratteri** (contando lettere e spazi) è largamente considerata **ideale**».
- Per la **composizione a più colonne**, la media migliore scende a **40-50 caratteri**.

**Fonte.** Robert Bringhurst, *The Elements of Typographic Style*, §2.1.2 «Choose a comfortable measure» (3ª/4ª ed., Hartley & Marks).

**Cosa ne prende il kit AKM.** Il **secondo numero**, quello che di solito si dimentica: quando la scheda sede mette indirizzo e orari **in due colonne affiancate**, la misura giusta non è 66 caratteri ma **40-50**. È la differenza fra una scheda che si legge e una che costringe a saltare da un lato all'altro.

*Nota di onestà:* ho verificato la citazione sulla misura, che è quantificata e ampiamente riportata. Non ho incluso le regole di interlinea di Bringhurst né *Detail in Typography* di Hochuli perché non sono riuscito a verificarne i valori numerici su una fonte che li citasse testualmente; il posto dell'interlinea quantificata in questo corpus è preso da USWDS (§3), che la dichiara come token.

---

## Vincoli quantificati per L'Albo

Traduzione del corpus in numeri utilizzabili. Ogni riga ha la sua fonte fra parentesi. Sono vincoli, non token definitivi: la scelta finale della grottesca può spostare la misura in `ch`, non le regole.

### 9.1 Misura della colonna

| Contesto | Vincolo | Fonte |
|---|---|---|
| Testo corrente (descrizione percorso, note) | **bersaglio 66 caratteri, tetto duro 70** | Bringhurst §2.1.2; USWDS (66); TfL (mai oltre 70) |
| Tetto assoluto in qualunque contesto | **75 caratteri** | GOV.UK; Designers Italia |
| Colonne affiancate (indirizzo + orari, chiave/valore) | **40-50 caratteri per colonna** | Bringhurst §2.1.2 (multicolonna); Unigrid (14 pica a 8pt ≈ 40-45) |
| Unità di implementazione | **`ch`/`ex`, non `px`**: la misura è una proprietà del carattere | USWDS (token `measure` in `ex`) |
| Da dove viene il limite | dalla **griglia** (colonna a due terzi), non da un `max-width` isolato | GOV.UK |

### 9.2 Scala tipografica e interlinea

Modulo di ritmo verticale: **4px** (Designers Italia; GOV.UK usa 5px con la stessa logica). **Ogni interlinea è un multiplo intero del modulo.**

| Livello | Corpo → interlinea (desktop) | Rapporto | Fonte del rapporto |
|---|---|---|---|
| Display | 56 → 60 | 1.07 | GOV.UK 48/50 = 1.04; USWDS lh-1/2 |
| Headline | 36 → 40 | 1.11 | GOV.UK 36/40 |
| Title (nome sede, nome istruttore) | 22 → 28 | 1.27 | GOV.UK 24/30; SBB titoli 1.4 come tetto |
| Body (misura ≤ 55ch) | 18 → 28 | 1.56 | USWDS lh-4 (1.5) / lh-5 (1.62) |
| Body (misura 55-70ch) | 18 → 30 | 1.67 | USWDS: «misura più lunga → interlinea maggiore» |
| Dato nudo (indirizzo, orario, telefono) | 16 → 28 | 1.75 | SBB (testo 1.75) |
| Meta (provincia, referente, note di sede) | 14 → 20 | 1.43 | Designers Italia `.875rem`; Unigrid didascalie 8/9 |
| Label (qualifiche, sigle) | 12 → 16, tracking **+0.03em** | 1.33 | SBB 0.03em; Designers Italia 0.5px su 12px |

Regole che accompagnano la tabella:

- **Salto Display → Headline ≥ 1.25** (già in `DESIGN.md`; qui è 1.56). GOV.UK sta a 1.33 fra 48 e 36.
- **Su schermo piccolo scendono i titoli, non il corpo.** GOV.UK porta il Display da 48 a 32 e lascia il corpo a 19px. Per noi: Display 56→36, Headline 36→26, Title 22→20, **Body e Dato nudo invariati**.
- **Corpo minimo del dato nudo: 16px.** Derivazione: TfL fissa 12 pt (≈4,2 mm di altezza maiuscola) come minimo per un A4 letto a distanza di braccio; MUTCD dà 1 mm di altezza ogni ~34 cm. A 35 cm dal telefono servono ≈1 mm di maiuscola, e un carattere da 16px con occhio normale sta sopra quella soglia con margine. **Sotto i 16px non scendono indirizzi, orari e telefoni**; 14px è il pavimento per i metadati di contorno; 12px esiste solo per le etichette in maiuscoletto.
- **Interlinea dei dati > interlinea dei titoli** (SBB). Un blocco di orari non si stringe per farlo sembrare compatto.
- **Mai ridurre l'interlinea sotto il valore di tabella** e **mai comprimere o allungare il carattere** (TfL; MUTCD §2A.08 ¶06).

### 9.3 Separazione delle voci

- **Riga a 1px, non card, non ombra, non fondo alternato.** Ogni voce: `border-bottom: 1px solid var(--riga)` con **`margin-top: -1px`** per collassare i bordi; l'ultima voce perde la riga (Bootstrap Italia `.it-list`).
- **Padding verticale della voce: 16px** su mobile, **20px** su desktop (Bootstrap Italia 16px; GOV.UK `summary-list` 10px in righe più dense). Questo padding **non è responsive**: i gradini piccoli della scala di spaziatura restano costanti (GOV.UK).
- **Fra gruppi di voci (sezioni di elenco): 40px sopra il titolo di gruppo, 20px sotto.** Rapporto **2:1**, preso dal fascione Unigrid (40 pt sopra, ≥20 pt sotto). È il rapporto che fa leggere l'elenco come una serie di gruppi.
- **Scala di spaziatura**, allineata al modulo da 4px e alla logica GOV.UK (i gradini ≥20px si comprimono su mobile): `4, 8, 12, 16, 20, 24, 32, 40, 48, 64`; su mobile `20→16`, `24→16`, `32→24`, `40→24`, `48→32`, `64→40`.
- **Quando la separazione è dentro un blocco di testo, si usa l'interlinea aggiuntiva, non un divisore** (TfL). Fra paragrafi: **nessun rientro**, stacco pari a una riga piena (Unigrid: «paragraph spaces are one open line»).
- **Il divisore è sempre lo stesso.** Stessa altezza, stessa posizione, stesso colore, in tutto il sito (Unigrid: barre a 100 pt e 25 pt, mai altri valori).

### 9.4 Trattamento dei metadati

- **Tre livelli dentro la voce, rapporto 1 : 0.875 : 0.75 rem** (nome / dato / etichetta), distinti da **peso** e da **un solo grigio**, mai da un contenitore (Bootstrap Italia).
- **Il metadato si distingue per allineamento e corpo, non per box** (Unigrid: didascalie a bandiera contro testo giustificato; per noi tutto a bandiera, quindi la distinzione è corpo + grigio + eventuale incolonnamento).
- **Grigio dei metadati ≥ 4.5:1** sul fondo Carta (TfL/WCAG AA; `DESIGN.md` lo chiede già per Grafite).
- **Scheda sede come tabella chiave/valore**, non come prosa: colonna chiave **30%** in **peso 700**, valore **50%**, azioni **20%**, righe a 1px, celle con 10px di padding verticale (GOV.UK `summary-list`).
- **Orari con cifre tabulari** (`font-variant-numeric: tabular-nums`): in un elenco di orari le colonne di cifre devono incolonnarsi. È la traduzione digitale del principio Unigrid «tutte le voci tabulari sono composte con lo stesso carattere e allineate».
- **Nomi propri sempre in maiuscolo/minuscolo**, mai in maiuscoletto (MUTCD §2A.08 ¶04): «Rozzano, Centro Aisha», non «ROZZANO, CENTRO AISHA».
- **Maiuscoletto solo per token brevi**: qualifiche, sigle, province, etichette di campo, **≤ 24 caratteri**. Mai su titoli, mai su frasi (TfL/RNIB: mai tutto maiuscolo, nemmeno nei titoli).

### 9.5 Regole di composizione (vincoli secchi)

- **Sempre a bandiera sinistra. Mai giustificato, mai a bandiera destra** (TfL; Designers Italia).
- **Enfasi = cambio di peso. Mai corsivo, mai solo colore** (TfL; e `DESIGN.md`, Regola dell'Etichetta).
- **Un solo carattere, quattro ruoli nominati per funzione**: Nome, Dato, Etichetta, Evidenza: come i quattro stili di Bell Centennial, che sono nominati per il lavoro che fanno nella voce e non per il loro peso astratto.
- **Nessun rientro di prima riga** (Unigrid; TfL).
- **Niente punteggiatura decorativa nelle etichette** e abbreviazioni ridotte al minimo (MUTCD §2A.08 ¶09-10): «Lun-Ven 20:00-21:30», non «Lun./Ven. dalle 20 alle 21.30 c.a.».
- **Testo centrato: solo se non supera tre righe, e solo su elementi isolati** (TfL). In pratica, mai in un elenco.

### 9.6 Test di conformità (da usare in review)

1. Prendi la riga di testo più lunga della pagina: **supera i 70 caratteri?** Allora la griglia è sbagliata, non il `max-width`.
2. Prendi l'indirizzo più piccolo della pagina: **è sotto 16px?** Allora la Regola del Dato Nudo è tradita.
3. Togli il colore alla pagina: **le voci dell'elenco si distinguono ancora?** Devono farlo per riga, peso e spazio.
4. Misura lo spazio sopra e sotto un titolo di gruppo: **è 2:1?**
5. Cerca un'ombra: **sta rispondendo a un'azione dell'utente?** Se no, cancellala e usa una riga.
6. Cerca un corsivo o un `border-left` colorato: **sostituiscili con un cambio di peso.**
7. Somma i corpi usati nella pagina: **sono più di sei?** La scala è §9.2, e ha sei livelli più il Display.

---

## Fonti (elenco completo)

- GOV.UK Design System: [Type scale](https://design-system.service.gov.uk/styles/type-scale/), [Layout](https://design-system.service.gov.uk/styles/layout/), [Spacing](https://design-system.service.gov.uk/styles/spacing/); sorgente [`govuk-frontend`](https://github.com/alphagov/govuk-frontend), CSS compilato v5.7.1.
- Designers Italia / AGID: [Tipografia](https://designers.italia.it/design-system/fondamenti/tipografia/), [Linee guida di design per i servizi web della PA](https://docs.italia.it/italia/designers-italia/design-linee-guida-docs/it/stabile/doc/user-interface/design.html); CSS compilato `bootstrap-italia@2.16.0`.
- U.S. Web Design System: [Measure](https://designsystem.digital.gov/design-tokens/typesetting/measure/), [Line height](https://designsystem.digital.gov/design-tokens/typesetting/line-height/), [Typography](https://designsystem.digital.gov/components/typography/).
- National Park Service: *Unigrid Design Specifications*, Informational Folder Program, <https://npshistory.com/brochures/unigrid.pdf>.
- Transport for London: *TfL text legibility standard, Issue 3*, <https://content.tfl.gov.uk/tfl-text-legibility-standard-issue03.pdf>.
- Federal Highway Administration: *MUTCD 11th Edition (Dec 2023), Chapter 2A*, <https://mutcd.fhwa.dot.gov/pdfs/11th_Edition/Chapter2a.pdf>.
- Nick Sherman, [«Bell Centennial»](https://nicksherman.com/articles/bellCentennial.html); [Bell Centennial (Wikipedia)](https://en.wikipedia.org/wiki/Bell_Centennial); [MoMA collection](https://www.moma.org/collection/works/139307).
- SBB: [Lyne Design System, Typography tokens](https://digital.sbb.ch/en/design-system/lyne/design-tokens/typography/).
- Robert Bringhurst, *The Elements of Typographic Style*, §2.1.2.

**Non verificato / escluso:** NHS Digital Service Manual (dominio irraggiungibile durante la ricerca); Jost Hochuli, *Detail in Typography* (nessuna fonte consultabile ne citava i valori numerici); NASA e EPA Graphic Standards Manual (scansioni non recuperabili in forma testuale).
