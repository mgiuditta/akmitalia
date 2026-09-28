# Riferimenti: siti di settore, spunti UI e prompt per Claude Design

Ricerca per la issue [#64](https://github.com/mgiuditta/akmitalia/issues/64), figlia della mappa [#62](https://github.com/mgiuditta/akmitalia/issues/62) («Un sito più bello, scelto guardando»). Serve a [#66](https://github.com/mgiuditta/akmitalia/issues/66).

Data: 2026-09-28.

**Domanda.** Da dove prendere spunto per una direzione visiva nuova che parli anche a genitori, donne e over 40 senza sembrare una palestra MMA tattica, con la palette che resta la nostra?

**Cosa c'è qui.**

1. Siti di settore (Krav Maga e difesa personale, Italia ed Europa), più alcuni fuori settore e Fenriz come paragone.
2. Fonti di spunti UI per hero, elenco sedi e mappa, schede, calendario eventi, form di contatto e navigazione.
3. Tre prompt per Claude Design, uno per ciascuna direzione candidata, pronti da incollare.

**Metodo.** Ogni URL è stato aperto durante la ricerca (WebFetch o risposta HTTP) e porta la marcatura `[verificato]` o `[non verificato]`. Il giudizio «cosa funziona» riguarda la forma: struttura, gerarchia, composizione, tono del copy. Il colore dei siti citati non conta, perché la palette resta quella di ADR-0005 (punto fisso di #62). Gli screenshot chiesti dal ticket non sono in questo file: le righe descrivono cosa guardare, e le catture si fanno in #66 sulle direzioni scelte.

**Da dove viene il contenuto AKM nei prompt.** Solo da fonti del repo o dal sito del cliente:

- corsi, centri, orari, docenti e credenziali: `data/centri-tecnici.json`;
- testo dei percorsi (prima lezione, a chi è adatto): `scripts/course-content.ts`, che è una bozza da rileggere col cliente;
- voci di navigazione e bottone principale: i `defaultValue` di `src/globals/Navigation.ts`;
- campi del form: `src/collections/Requests.ts`;
- eventi di settembre 2026: API del calendario di akm-italia.it (`/wp-json/tribe/events/v1/events`), letta il 2026-09-28;
- province attive (LO, MI, MB, VA) e affermazioni tolte («Canton Ticino», «quattro anni di percorso», «formazione tecnica»): `docs/antislop/audit-001-2026-09-16.md`, voci 8, 9, 10.

---

## 1. Siti di settore

Legenda: `[verificato]` = contenuto letto e corrispondente alla riga; `[risponde]` = HTTP 200 e titolo coerente, ma contenuto non leggibile (anti-bot o JS); `[non verificato]` = non raggiunto.

### Krav Maga e difesa personale, Italia ed Europa

| # | Sito | Paese | URL | Cosa funziona (la forma) |
|---|---|---|---|---|
| 1 | Krav Maga Self Protect Association Schweiz | CH | https://kravmaga-schweiz.ch/schulen `[verificato]` | L'elenco sedi migliore trovato: ricerca per CAP o città, filtri per pubblico (18+, 14+, donne), scheda con età, indirizzo e mappa in miniatura, messaggio «nessun risultato» scritto con garbo. È `/centri` filtrabile per città e per chi domanda. |
| 2 | IKMF Krav Maga Schweiz | CH | https://www.kravmaga.ch/de/kontakt/ `[verificato]` | Il form di prova migliore: quattro accessi diretti separati per pubblico e sede (adulti Berna, adulti Zurigo, kids 4-8, juniors 9+) sopra un form con menu «interesse» e «sede». Il genitore arriva alla prova del figlio senza passare dal form generico. |
| 3 | Kravparis | FR | https://kravparis.fr/ `[verificato]` | Brutto ma con la matrice giusta: ogni pubblico (adulti/senior, bambini 7-10, ragazzi 11-15, donne) legato a una sede e a un orario. Lessico «bienveillant», «pédagogie progressive». Uno dei pochi che nomina i senior. |
| 4 | Krav Maga FFK (Fédération Française de Karaté) | FR | https://kravmaga-ffk.fr/ `[verificato]` | Tono istituzionale senza aria federale anni 2000: «aucun prérequis sportif», assicurazione e istruttori qualificati come rassicurazione, bottone «Trouver mon club», sezione bambini su fiducia, rispetto e gestione delle emozioni. |
| 5 | Glasgow United Krav Maga | UK | https://www.glasgow-krav-maga.co.uk/ `[verificato]` | Quattro schede corso per pubblico e livello (principianti, solo donne 6 settimane, kids/teen, intermedio) e orario completo lunedì-sabato con le fasce d'età. Grafica datata, schede fatte bene. |
| 6 | Spartans Academy (Krav Maga Global) | UK | https://kravmaga-academy.co.uk/ `[verificato]` | Sei città, una pagina per sede con sala e orari: lo stesso modello di AKM. Hero «real-world self-defence skills in a safe, supportive environment», CTA «Find Your Nearest Class». |
| 7 | Krav Maga Global UK, club finder | UK | https://www.kravmaga.co.uk/pages/clubs `[verificato]` | Solo per la funzione: vista lista/mappa, «Find My Location», raggio regolabile, filtro per tag. |
| 8 | Krav Maga Noord-Holland | NL | https://www.kravmaga-noordholland.nl/ `[verificato]` | Hero «Praktische zelfverdediging lessen. Voor iedereen» con due CTA (prova, trova sede); 18 sedi in ordine alfabetico anche nel piè di pagina (come ADR-0001). Contro: «Geen regels, alleen effectiviteit» è il tono da evitare. |
| 9 | IKMN, Institute Krav Maga Netherlands | NL | https://institute-kravmaga.nl/ `[verificato]` | Navigazione di quattro voci con la prova al secondo posto; corsi nominati per pubblico (Kidz, Teen, Girls); claim non militare «Weerbaar & Fit». |
| 10 | Kida Krav Maga | DE | https://www.kida-kravmaga.de/ `[verificato]` | Fasce d'età scritte (7-10, 11-16, 16+), scheda sede con il suo bottone di prova, orari e prezzi in chiaro. Contro: hero a carosello. |
| 11 | Krav Maga Taunus | DE | https://krav-maga-taunus.de/ `[verificato]` | Cinque sedi in schede con la foto della struttura vera (una scuola, un centro sportivo) al posto delle foto di combattimento. Idea buona per AKM, i cui centri stanno in scuole di danza e istituti comprensivi. |
| 12 | Streetwise Academy, Berlino | DE | https://streetwise.academy/ `[verificato]` | Nel complesso no (mescola corsi per polizia), ma due cose sì: la prova come tre passaggi «kein Vertrag, kein Risiko» e «von 8 bis 70 Jahren», l'unico segnale over 40 esplicito trovato. |
| 13 | Krav Maga La Rioja, Logroño | ES | https://www.kravmagalarioja.com/ `[verificato]` | Titolo «para adultos, mujeres y niños» e «Empieza desde cero» in apertura: la soglia bassa detta nella prima riga. |
| 14 | Krav360, Barcellona | ES | https://krav360.com/ `[verificato]` | Due sedi, «un solo abbonamento»; claim che parla di proteggere «lo que más te importa» invece che di combattere. |

**Italia.** Nessun sito italiano di Krav Maga trovato regge come modello. La Scuola Italiana Krav Maga (https://www.kravmaga.it/sedi-e-corsi `[risponde]`) è generata in JS e non si legge senza browser: va aperta a mano in #66.

**Over 40: lacuna.** Nessun sito del settore ha una sezione over 40 fatta bene; due candidati tedeschi non rispondono (https://www.kravmaga50plus.de/ DNS assente, una pagina «Seniorenselbstverteidigung» di kravmaga-lev.de in 404, entrambi `[non verificato]`). I segnali migliori restano «von 8 bis 70 Jahren» (Streetwise) e «adultes/seniors» (Kravparis). Per AKM vale lo stesso principio: l'over 40 non ha una sezione sua, si riconosce nel copy della prima lezione («non chiede di essere allenati per cominciare», «chi ha smesso di allenarsi da anni»).

### Fuori settore: sport serio, soglia bassa

| Sito | Cosa | URL | Cosa funziona |
|---|---|---|---|
| Arkose | Arrampicata, 25+ sedi FR/ES/BE | https://arkose.com/ `[verificato]` | L'hero è un'offerta d'ingresso concreta («Ta première entrée à 10 €») e «1ère fois» è una voce di navigazione. Sedi raggruppate per area. |
| The Climbing Hangar | Arrampicata, 9 sedi UK | https://www.theclimbinghangar.com/ `[verificato]` | «There's space on the wall for you» e il blocco «First time climbing?»: «you don't need to be superhuman». È il tono esatto di «non chiede di essere allenati». |
| Boulderwelt | Boulder, 8 sedi DE | https://www.boulderwelt.de/ `[verificato]` | Mappa più schede sede con carattere del luogo, indirizzo e orari; copy «egal, ob Du zum ersten Mal…», aree bambini e famiglie. |
| British Fencing | Federazione di scherma UK | https://www.britishfencing.com/ `[verificato]`, percorso d'ingresso https://www.britishfencing.com/make-your-move/ `[risponde]` | Una federazione che ha un percorso dichiarato per chi comincia, con membership introduttiva gratuita. Mostra che «ente serio» e «soglia bassa» stanno insieme. |

### Fenriz, il paragone

https://www.fenriz-gym.com/ `[verificato]`: palestra multi-disciplina a Berlino Kreuzberg (MMA, Muay Thai, BJJ, boxe), la fonte di ADR-0004.

- **Struttura.** Nav piatta (Kurse, Events, Preise, Kursplan, Über uns) con «Probetraining» fisso; hero «Martial arts. From Kreuzberg. With Love.»; sei schede corso per disciplina con «Mehr erfahren»; sezione prova; chi siamo con partner; tre eventi; FAQ; shop; piè di pagina con indirizzo e orari.
- **Cosa funziona.** Il claim ironico e caldo smonta l'aria da gabbia. La prova è sempre in vista. La pagina https://www.fenriz-gym.com/probetraining `[verificato]` apre su «curioso degli sport da combattimento ma non sai da dove cominciare?» e offre due strade, compreso un corso Intro: è la soglia bassa fatta bene, e AKM l'ha presa nella forma ma non nel copy.
- **Cosa sa di template.** È Webflow con la nomenclatura Client-First, e ogni blocco ripete «titolo maiuscolo + paragrafo + griglia di schede + Mehr erfahren» (lo stesso difetto che l'audit antislop 001 segnala alle voci 25 e 26).
- **Cosa è cupo.** Fondo `#1C1C1C`, condensato Kenyan Coffee maiuscolo, foto delle schede in bianco e nero che si colorano all'hover.
- **Cosa alza la soglia.** Gli eventi in home sono sparring e open mat per esperti; le schede sono per disciplina e non per persona; lo shop pesa più del primo passo.

Per AKM: da tenere la prova sempre in vista e il tono caldo del claim; da correggere le schede per disciplina (AKM le ha già per chi domanda, il bivio) e la sequenza di blocchi identici. È il punto di partenza del prompt A.

---

## 2. Spunti UI per elemento

Si guarda la forma, non il colore. Molte gallerie sono orientate al SaaS: vanno usate per la composizione, filtrando via tutto quello che assomiglia all'anti-reference 2 di `PRODUCT.md`.

### Gallerie, con link alle sezioni utili

| Galleria | Link | Per cosa |
|---|---|---|
| Awwwards | https://www.awwwards.com/websites/navigation/ · https://www.awwwards.com/websites/menu-horizontal/ `[verificato]` | Navigazione, nav in riga desktop |
| | https://www.awwwards.com/websites/contact-page/ · https://www.awwwards.com/websites/forms-and-input/ `[verificato]` | Form di contatto |
| | https://www.awwwards.com/websites/events/ · https://www.awwwards.com/websites/sports/ `[verificato]` | Calendari e schede evento; tipografia sportiva (quasi solo brand, niente club) |
| One Page Love | https://onepagelove.com/section/cta-hero `[verificato]` | Hero con CTA |
| | https://onepagelove.com/section/navigation · https://onepagelove.com/section/header-navigation `[verificato]` | Navigazione |
| | https://onepagelove.com/section/contact-form `[verificato]` | Form |
| | https://onepagelove.com/style/editorial `[verificato]` | Registro editoriale: spunti per la direzione B |
| | https://onepagelove.com/genre/sport · https://onepagelove.com/genre/event `[verificato]` | Sport, eventi |
| Httpster | https://httpster.net/type/education/ `[verificato]` | Scuole ed educazione, vicino al registro «corso» |
| | https://httpster.net/type/sport/ · https://httpster.net/type/health/ `[verificato]` | Sport, salute |
| Siteinspire | https://www.siteinspire.com/websites/category/sports `[verificato]` | Sport; c'è un club vero (Sóller Tennis Club) |
| Landingfolio | https://www.landingfolio.com/inspiration/section/hero · …/navbar · …/contact · …/feature `[verificato]` | Hero, barra, contatti, blocchi a schede. Molto SaaS. |
| Page Flows | https://pageflows.com/web/elements/card/ · https://pageflows.com/web/elements/date-time/ · https://pageflows.com/web/elements/navigation-flow/ `[verificato]` | Schede, data e ora (calendario), navigazione |
| | https://pageflows.com/web/flows/searching-finding/ · https://pageflows.com/web/flows/booking-reserving/ `[risponde]` | Trovare un centro, prenotare una prova |
| Mobbin (login) | https://mobbin.com/explore/web/screens/map · https://mobbin.com/explore/mobile/screens/map `[risponde]` | Schermate con mappa, web e mobile |
| | https://mobbin.com/explore/web/ui-elements/card · https://mobbin.com/explore/web/ui-elements/top-navigation-bar · https://mobbin.com/explore/web/screens/date-time `[risponde]` | Schede, barra, data e ora |
| Godly → Recent | https://recent.design/websites `[verificato]` | godly.website oggi reindirizza qui; nessun filtro per settore via URL |
| Refero | https://refero.design/ `[risponde]` | App in JS: cercare a mano «map», «locations», «schedule», «calendar», «contact form» |
| Land-book | https://land-book.com/?industry=Sport `[non verificato]` | 403 ad accesso automatico, da aprire nel browser |
| Lapa Ninja | https://www.lapa.ninja/category/health-fitness/ `[non verificato]` | 403 ad accesso automatico |
| Navbar Gallery | https://www.navbar.gallery/ `[verificato]` | Solo barre e menu, anche mobile |
| CTA Gallery | https://www.cta.gallery/ `[verificato]` | Blocchi CTA, per la richiesta e la prima lezione |
| Footer Design | https://www.footer.design/ `[verificato]` | Piè di pagina, anche come directory dei centri |

Categorie che **non** esistono, da non cercare: su Awwwards `/websites/maps/`, `/calendar/`, `/cards/` e `/header/` rispondono ma mostrano la pagina generica dei nominati.

### Siti esemplari per elemento

- **Hero a soglia bassa.** Arkose (offerta d'ingresso nell'hero), The Climbing Hangar (claim inclusivo più due CTA), Krav Maga La Rioja («Empieza desde cero»). Da Fenriz solo il tono del claim.
- **Elenco sedi e mappa.**
  - https://kravmaga-schweiz.ch/schulen `[verificato]`: ricerca per CAP e filtro per pubblico.
  - https://www.kravmaga.co.uk/pages/clubs `[verificato]`: lista/mappa, posizione a richiesta, raggio.
  - https://www.decathlon.it/store-locator `[verificato]`: elenco italiano leggibile con lo stato per riga («Chiuso, apre martedì alle 09:00»). Per AKM diventa «prossima lezione: giovedì 20:30».
  - https://www.swimming.org/poolfinder/ `[verificato, parziale]`: «Use my location» e filtri.
  - https://krav-maga-taunus.de/ `[verificato]`: scheda sede con la foto della struttura vera.
  - https://www.parkrun.org.uk/events/events/ `[risponde]`: la mappa classica di «sport gratuito vicino a te».
- **Schede corso per pubblico.** Glasgow United Krav Maga (quattro schede per pubblico e livello), Kida Krav Maga (fasce d'età).
- **Calendario eventi.** https://www.barbican.org.uk/whats-on `[verificato]`: filtri rapidi «oggi / prossimi 7 giorni / prossimi 30», intervallo di date, filtro per tipo, schede con categoria scritta. Da confrontare con la griglia del mese di ADR-0014.
- **Form di contatto e prova.** https://www.kravmaga.ch/de/kontakt/ `[verificato]` (accessi separati per pubblico e sede, poi il form), https://www.fenriz-gym.com/probetraining `[verificato]` (copy che normalizza l'incertezza).
- **Navigazione.** https://institute-kravmaga.nl/ `[verificato]` (quattro voci, prova al secondo posto), Fenriz (nav primaria e secondaria separate), https://www.gov.uk/ `[verificato]` per la sobrietà della nav mobile, non per lo stile.

---

## 3. Tre direzioni e i loro prompt

### Tre fatti che i prompt dichiarano, e perché

Leggendo i dati sono venute fuori tre cose che una direzione deve reggere e che il sito attuale non mette in evidenza:

- **Il percorso donne oggi non ha un centro attivo.** L'unico orario di «Difesa personale donna» sta a Muggio, che in `data/centri-tecnici.json` è `attivo: false`. La scheda del percorso deve reggere con zero centri: niente «0 attivi» (DESIGN.md, ADR-0013), un invito a lasciare comunque la richiesta.
- **Il Krav Maga kids si tiene in 4 centri su 15** (Binasco, Bresso, Milano Bisceglie, Paderno Dugnano). Il genitore deve capirlo prima di aprire quindici schede.
- **Quasi ogni centro ha una sera sola a settimana per gli adulti.** Due sere le hanno solo Paderno Dugnano (martedì e venerdì) e Pogliano Milanese (giovedì e sabato pomeriggio). La bozza in `scripts/course-content.ts` dice «nella maggior parte dei centri due sere a settimana», e i dati la smentiscono. È una domanda per il cliente: i prompt non la usano.

### Le tre direzioni in una riga

| | Direzione | Cosa cambia rispetto a oggi | Rischio da guardare |
|---|---|---|---|
| A | **Fenriz ripulito** | Stessa ossatura (barra nera, Anton, spigolo vivo, alternanza nero/chiaro). Meno nero, display più piccolo e usato una volta per pagina, il dato vero (luogo, giorno, ora, docente) già nella prima schermata. | Resta riconoscibile come Fenriz: se il cliente vuole «un'altra cosa», A non basta. |
| B | **La bacheca della sala** | Chiaro per prima cosa: carta, bianco, inchiostro. L'ordine lo dà l'orario settimanale, quello appeso in palestra: giorni, ore, centri, nomi. Anton scende ai numeri e ai giorni. | Può scivolare verso il «sito federale anni 2000» se la tabella vince sulla composizione. |
| C | **La segnaletica** | Si parte dal territorio: mappa e nomi dei comuni in grande, come i cartelli di una linea della metropolitana. Il verde presenza porta più peso, sempre accanto a una parola. | La mappa ha bisogno delle coordinate e su mobile pesa: va provata a 390px prima di tutto. |

Tutte e tre reggono senza fotografie (lezione di #34: «il sito deve reggere anche se le foto vere non arrivano mai»).

### Come usarli

Si incollano uno alla volta in Claude Design, in una conversazione nuova per ognuno, così le direzioni non si contaminano. Ogni prompt è autosufficiente: contiene la palette, i punti fissi, il contenuto vero e le anti-reference. Chiede home e scheda di un centro a 1440 e 390px, perché la mappa (#62, «Not yet specified») vuole la direzione provata anche sulle rotte dense.

### Prompt A: «Fenriz ripulito»

```text
Progetta la home e la scheda di un centro per il sito pubblico di AKM Italia, un'associazione di Krav Maga (difesa personale) con 15 centri tecnici fra Milano e provincia. Due tavole per pagina: desktop a 1440px e mobile a 390px. Lingua: italiano.

DIREZIONE: «FENRIZ RIPULITO»
Il sito attuale usa un registro da palestra da combattimento: barra nera fissa, titoli in un carattere condensato enorme e maiuscolo, blocchi neri alternati a blocchi chiari, angoli vivi, niente ornamento. Tieni l'ossatura e correggi tre difetti:
1. Sembra un template da palestra: hero nero con slogan gigante, poi sezioni tutte uguali. Ogni sezione deve avere una composizione sua, e ognuna deve nominare un luogo o una persona.
2. È cupo: troppo nero di fila. Le sezioni chiare (bianco e grigio carta) devono pesare almeno quanto quelle nere. Il nero resta per la barra, l'apertura e un solo altro blocco.
3. Ha la soglia alta: chi arriva ha paura di essere fuori posto. Il titolo display compare una volta sola per pagina, e già nella prima schermata ci sono un centro, un giorno, un'ora e il nome del docente veri. La tipografia può essere dura, il testo no.

PUBBLICO
Visitatore principale: un adulto che cerca sicurezza quotidiana e non vuole diventare un atleta. Arriva dopo un episodio, spesso dal telefono, spesso di sera. Ha due dubbi: «funziona davvero?» e «sono fuori posto in una palestra così?». Poi i genitori che valutano il corso per i figli (cercano crescita e un ambiente sicuro, non combattimento) e le donne al primo contatto con uno sport da combattimento.
Personalità: concreta, competente, vicina. Parla come un istruttore che spiega, non come un brand che vende: frasi brevi, seconda persona, zero superlativi. Il tema è la paura e il sito la disinnesca, non la usa. Emozione da ottenere: «questi sanno quello che fanno e non mi faranno sentire fuori posto».

PALETTE (fissa, non aggiungere tinte)
- Nero #000000: barra e superfici più autorevoli.
- Carbone #1C1C1C: testo su chiaro, schede, piè di pagina.
- Inchiostro secondario #333333: solo testo de-enfatizzato su fondo chiaro.
- Bianco #FFFFFF e Grigio carta #E8E8E8: sezioni chiare; #E8E8E8 anche per i filetti da 1px.
- Rosso azione #E30917 (premuto #B00711): solo il fondo del bottone primario, con etichetta bianca. Non indica errori, stati o selezioni.
- Verde presenza #00B44B su fondo scuro, #006B2C su fondo chiaro: solo un segno piccolo di dato vivo (centro attivo, marker di mappa, conteggio centri), sempre accanto a una parola.
- Tricolore #00973F / #FFFFFF / #E30917: solo il wordmark e un filetto da 3px che apre una sezione interna.
Niente gradienti, vetro, sfocature o ombre sul cromo.

TIPOGRAFIA
Anton (condensato, maiuscolo) per i titoli, Roboto 300/400/700 per tutto il resto. Anton non più di 96px su desktop e 56px su mobile, e mai per frasi più lunghe di sei parole. Orari, civici e CAP in cifre tabulari. Indirizzi e orari mai sotto i 14px.

PUNTI FISSI
- Wordmark: stemma tondo più «AKM» con le tre lettere in verde #00973F, bianco #FFFFFF e rosso #E30917, e «ITALIA» più piccolo sotto. La K è bianca, quindi il wordmark sta su nero o carbone.
- Navigazione: Percorsi · Centri · Istruttori · Eventi · Contatti, più il bottone «Richiedi informazioni» sempre visibile. Sotto i 1024px le voci vanno in un menu.
- Angoli a 0px ovunque.
- WCAG 2.2 AA: contrasto AA su tutto, bersagli di tocco da 44px, focus visibile, e nessuna informazione affidata al solo colore.
- Nessuna fotografia stock e nessuna foto di persone generata. Dove serve un'immagine, uno slot vuoto dichiarato (riquadro con didascalia «foto del centro in arrivo»). La pagina deve reggere anche se le foto non arrivano mai.

CONTENUTO VERO (usalo così: niente lorem, niente numeri o fatti inventati)
Bivio della home, tre percorsi, ognuno aperto da una domanda in prima persona:
1. «Voglio sapermi difendere ogni giorno» → Krav Maga adulti. Il corso regolare AKM: difesa personale a lezioni settimanali, aperto ad adulti e ragazzi. In tutti i 15 centri.
2. «Cerco qualcosa per mio figlio» → Krav Maga kids. Percorso antibullismo per bambini e ragazzi, dai 9 anni. In 4 centri: Binasco, Bresso, Milano Bisceglie, Paderno Dugnano.
3. «Voglio un corso per sole donne» → Difesa personale donna. Corso antiaggressione per sole donne. In questa stagione non ha un centro attivo: mostralo senza scrivere «0», e invita a lasciare comunque una richiesta.
Frasi sulla prima lezione, da usare alla lettera:
- «Non chiede di essere allenati per cominciare.»
- «La prima lezione si concorda con il docente del centro.»
- Per i ragazzi: «Un genitore può restare a guardarla.»
- «Si pratica in coppia, con l'intensità che il tuo compagno può reggere.»
Istruttori: Omar Borghini, Vice Presidente e Direttore Tecnico AKM Italia. Credenziali: Krav Maga Master CSEN-CONI; Krav Maga Master Docente Nazionale F.E.K.D.A.; Responsabile Formazione P.T.D. Police Training Division. Vittorio Porreca, maestro. Più 11 trainer indicati per nome: Alberto, Alessandro, Claudio, Emanuela, Luca, Luca M., Marco, Mirko, Monica, Paolo, Stefano.
Centri attivi (15, province MI, MB, LO, VA): Binasco - Palestra Santa Corinna; Bresso - Palestra Beauty Island; Brugherio - Centro DREAMFIT; Cinisello Balsamo - Centro Bene-Fit; Corsico - Scuola Omnicomprensivo; Milano Affori - Milano Sport; Milano 1 Stazione Centrale - Gonzaga Sport Club; Milano Bisceglie / Lorenteggio - Palestra Piscina Cardellino; Mulazzano - Istituto Comprensivo A. Gramsci; Paderno Dugnano - Energy Club; Pogliano Milanese - Centro Dance Time Studio; Pontesesto Rozzano - Centro Tecnico Aisha; San Giuliano Milanese - Accademia Arte Danza; Saronno - Danza con Veronica; Sesto San Giovanni - Energy Club.
Eventi di settembre 2026 (tipo «presentazione», cioè la lezione aperta di inizio stagione), per esempio: 28 settembre ore 20:30, Sesto San Giovanni - Energy Club; 29 settembre ore 20:15, San Giuliano Milanese; 30 settembre ore 18:30, Milano Bisceglie, presentazione Krav Maga antibullismo bambini (8-14 anni); 30 settembre ore 20:30, Pontesesto Rozzano - Centro Aisha.

SCHEDA DEL CENTRO (seconda pagina): Bresso - Palestra Beauty Island, Via Leopardi 5, 20091 Bresso (MI). Punto di riferimento anche per Sesto San Giovanni, Bruzzano e Bicocca. Orari: giovedì 18:30-19:30 Krav Maga kids (bambini), giovedì 20:30-22:00 Krav Maga adulti (adulti e ragazzi); docente di entrambi: Omar Borghini. Indirizzo, orari e docente leggibili subito, senza click. Un link «Apri in Maps» e il form di richiesta con il centro già selezionato. AKM non pubblica telefono né email per centro: il contatto passa dal form.
Form di richiesta: nome, cognome, email, telefono (facoltativo), data di nascita, centro tecnico, percorso di interesse, messaggio, consenso privacy. Obbligatori dichiarati a parole, errori scritti accanto al campo.

DA NON FARE (anti-reference)
- Sito federale anni 2000: home fatta di news, PDF come navigazione, tabelle di orari illeggibili, fila di loghi di enti nel piè di pagina.
- Template SaaS: hero con gradiente, tre card identiche icona + titolo + testo, bottone «Scopri di più».
- Fitness/wellness patinato: stock di gente che sorride, palette da centro benessere, linguaggio da percorso di benessere.
- Palestra MMA tattica: camo, teschi, rosso sangue, pugni in controluce, parole come «combatti», «distruggi», «letale».
- Niente minacce, niente leve sulla paura («e se succedesse a te?»), niente promesse di invincibilità.
```

### Prompt B: «La bacheca della sala»

```text
Progetta la home e la scheda di un centro per il sito pubblico di AKM Italia, un'associazione di Krav Maga (difesa personale) con 15 centri tecnici fra Milano e provincia. Due tavole per pagina: desktop a 1440px e mobile a 390px. Lingua: italiano.

DIREZIONE: «LA BACHECA DELLA SALA»
L'idea: il foglio dell'orario appeso all'ingresso di una palestra, fatto bene. Chiaro per prima cosa: fondo bianco e grigio carta, testo in inchiostro quasi nero, il nero pieno solo nella barra, in un blocco e nel piè di pagina. L'ordine della pagina lo dà la settimana: lunedì, martedì, mercoledì, giovedì, venerdì, sabato, con le lezioni vere sotto ogni giorno (centro, ora, corso, docente). Chi arriva deve pensare «il giovedì sera a Bresso c'è una lezione, alle 20:30, la tiene Omar» prima di pensare «Krav Maga».
Composizione editoriale e a griglia visibile: filetti da 1px, colonne, numeri grandi per i giorni e le ore, titoli in minuscolo normale e non tutto maiuscolo. Asciutta ma calda, come un buon orario dei treni o il programma di una stagione teatrale. Nessuna immagine necessaria. Dove ne serve una, uno slot vuoto dichiarato.
Rischio da evitare: la tabella fitta da sito federale. La griglia deve respirare, e su mobile la settimana diventa un elenco per giorno, mai una tabella da scorrere in orizzontale.

PUBBLICO
Visitatore principale: un adulto che cerca sicurezza quotidiana e non vuole diventare un atleta. Arriva dopo un episodio, spesso dal telefono, spesso di sera. Ha due dubbi: «funziona davvero?» e «sono fuori posto in una palestra così?». Poi i genitori che valutano il corso per i figli (cercano crescita e un ambiente sicuro, non combattimento) e le donne al primo contatto con uno sport da combattimento. Molti hanno più di 40 anni.
Personalità: concreta, competente, vicina. Parla come un istruttore che spiega, non come un brand che vende: frasi brevi, seconda persona, zero superlativi. Il tema è la paura e il sito la disinnesca, non la usa. Emozione da ottenere: «questi sanno quello che fanno e non mi faranno sentire fuori posto».

PALETTE (fissa, non aggiungere tinte; qui cambiano le proporzioni, non i colori)
- Bianco #FFFFFF e Grigio carta #E8E8E8: le superfici principali di questa direzione.
- Carbone #1C1C1C: il testo; #333333 solo per testo de-enfatizzato su fondo chiaro.
- Nero #000000: barra, un blocco (la prima lezione) e piè di pagina.
- Rosso azione #E30917 (premuto #B00711): solo il fondo del bottone primario, con etichetta bianca. Non indica errori, stati, giorni o selezioni.
- Verde presenza: #006B2C su fondo chiaro, #00B44B su fondo scuro. Solo un segno piccolo di dato vivo, sempre accanto a una parola (per esempio il centro attivo nella sua scheda).
- Tricolore #00973F / #FFFFFF / #E30917: solo il wordmark e un filetto da 3px.
- Filetti da 1px in #E8E8E8 su bianco, o in #1C1C1C su grigio carta.
Niente gradienti, vetro, sfocature o ombre decorative.

TIPOGRAFIA
Roboto (300/400/700) fa quasi tutto, anche i titoli, in maiuscolo e minuscolo normale. Anton (condensato) solo per numeri e sigle dei giorni: ore, giorni, ordinali, conteggi. Tutte le cifre tabulari, così gli orari si incolonnano. Indirizzi e orari mai sotto i 14px, corpo del testo 16-18px.

PUNTI FISSI
- Wordmark: stemma tondo più «AKM» con le tre lettere in verde #00973F, bianco #FFFFFF e rosso #E30917, e «ITALIA» più piccolo sotto. La K è bianca, quindi il wordmark sta su una barra nera o carbone anche in questa direzione chiara.
- Navigazione: Percorsi · Centri · Istruttori · Eventi · Contatti, più il bottone «Richiedi informazioni» sempre visibile. Sotto i 1024px le voci vanno in un menu.
- Angoli a 0px ovunque.
- WCAG 2.2 AA: contrasto AA su tutto, bersagli di tocco da 44px, focus visibile, e nessuna informazione affidata al solo colore.
- Nessuna fotografia stock e nessuna foto di persone generata.

CONTENUTO VERO (usalo così: niente lorem, niente numeri o fatti inventati)
Bivio della home, tre percorsi, ognuno aperto da una domanda in prima persona:
1. «Voglio sapermi difendere ogni giorno» → Krav Maga adulti. Il corso regolare AKM: difesa personale a lezioni settimanali, aperto ad adulti e ragazzi. In tutti i 15 centri.
2. «Cerco qualcosa per mio figlio» → Krav Maga kids. Percorso antibullismo per bambini e ragazzi, dai 9 anni. In 4 centri: Binasco, Bresso, Milano Bisceglie, Paderno Dugnano.
3. «Voglio un corso per sole donne» → Difesa personale donna. Corso antiaggressione per sole donne. In questa stagione non ha un centro attivo: mostralo senza scrivere «0», e invita a lasciare comunque una richiesta.
La settimana (orari veri, usane quanti ne servono):
- Lunedì: Cinisello Balsamo - Centro Bene-Fit, 20:15-21:45, adulti e ragazzi, Luca M. · Corsico - Scuola Omnicomprensivo, 20:00-21:30, Vittorio Porreca e Stefano · Saronno - Danza con Veronica, 20:30-22:00, Mirko.
- Martedì: Paderno Dugnano - Energy Club, 20:30-22:00, Omar Borghini · San Giuliano Milanese - Accademia Arte Danza, 20:15-21:45, Vittorio Porreca · Sesto San Giovanni - Energy Club, 20:30-22:00, Paolo.
- Mercoledì: Brugherio - Centro DREAMFIT, 20:25-21:55, Omar Borghini, Marco, Monica · Milano Bisceglie - Palestra Piscina Cardellino, 18:30-19:30 kids e 20:30-22:00 adulti, Vittorio Porreca · Mulazzano - Istituto Comprensivo A. Gramsci, 20:00-21:30, Claudio · Pontesesto Rozzano - Centro Tecnico Aisha, 20:30-22:00, Luca.
- Giovedì: Binasco - Palestra Santa Corinna, 18:30-19:30 kids (dai 9 anni) e 20:30-22:00 adulti, Vittorio Porreca · Bresso - Palestra Beauty Island, 18:30-19:30 kids e 20:30-22:00 adulti, Omar Borghini · Milano Affori - Milano Sport, 20:30-22:00, Alessandro · Pogliano Milanese - Centro Dance Time Studio, 20:30-22:00, Alberto.
- Venerdì: Milano 1 Stazione Centrale - Gonzaga Sport Club, 18:00-19:15 ragazzi e 19:30-21:00 adulti, Vittorio Porreca · Paderno Dugnano - Energy Club, 18:30-19:30 kids e 20:00-21:30 adulti, Omar Borghini.
- Sabato: Pogliano Milanese - Centro Dance Time Studio, 15:00-16:30, Vittorio Porreca ed Emanuela.
Frasi sulla prima lezione, da usare alla lettera: «Non chiede di essere allenati per cominciare.» · «La prima lezione si concorda con il docente del centro.» · per i ragazzi: «Un genitore può restare a guardarla.»
Istruttori: Omar Borghini, Vice Presidente e Direttore Tecnico AKM Italia (Krav Maga Master CSEN-CONI; Krav Maga Master Docente Nazionale F.E.K.D.A.; Responsabile Formazione P.T.D. Police Training Division). Vittorio Porreca, maestro. Gli altri trainer compaiono solo col nome.
Eventi: a fine settembre 2026 ogni centro tiene la «presentazione», la lezione aperta di inizio stagione. Per esempio 24 settembre, Binasco: 18:30 kids (8-14 anni) e 20:30 adulti.

SCHEDA DEL CENTRO (seconda pagina): Binasco - Palestra Santa Corinna, SP30, Binasco (MI). Orari: giovedì 18:30-19:30 Krav Maga kids (bambini dai 9 anni), giovedì 20:30-22:00 Krav Maga adulti (adulti e ragazzi); docente di entrambi: Vittorio Porreca, maestro. L'orario è il protagonista della pagina. Indirizzo e docente leggibili subito, senza click. Un link «Apri in Maps» e il form di richiesta con il centro già selezionato. AKM non pubblica telefono né email per centro: il contatto passa dal form.
Form di richiesta: nome, cognome, email, telefono (facoltativo), data di nascita, centro tecnico, percorso di interesse, messaggio, consenso privacy. Obbligatori dichiarati a parole, errori scritti accanto al campo.

DA NON FARE (anti-reference)
- Sito federale anni 2000: home fatta di news, PDF come navigazione, tabelle di orari illeggibili, fila di loghi di enti nel piè di pagina. È il rischio principale di questa direzione.
- Template SaaS: hero con gradiente, tre card identiche icona + titolo + testo, bottone «Scopri di più».
- Fitness/wellness patinato: stock di gente che sorride, palette da centro benessere, linguaggio da percorso di benessere.
- Palestra MMA tattica: camo, teschi, rosso sangue, pugni in controluce.
- Niente minacce, niente leve sulla paura, niente promesse di invincibilità.
```

### Prompt C: «La segnaletica»

```text
Progetta la home e la scheda di un centro per il sito pubblico di AKM Italia, un'associazione di Krav Maga (difesa personale) con 15 centri tecnici fra Milano e provincia. Due tavole per pagina: desktop a 1440px e mobile a 390px. Lingua: italiano.

DIREZIONE: «LA SEGNALETICA»
L'idea: il sito come la segnaletica di una rete di trasporti, non come la vetrina di un marchio. AKM è fatta di posti: 15 centri in 4 province. La prima cosa che il sito chiede è «dove sei?», la seconda «qual è il tuo momento?». I nomi dei comuni sono i titoli: grandi, maiuscoli, condensati, come i cartelli di stazione. La mappa dell'area milanese (anche stilizzata, a linee e punti, senza i riquadri di Google) è l'eroe della home. Ogni centro è un punto con il nome scritto accanto, e i comuni che serve sono elencati come le fermate di una linea (i dati sotto dicono per quali zone ogni centro è punto di riferimento).
Sistema a pittogrammi e frecce semplici, fondo prevalentemente scuro con pannelli chiari per le informazioni lette da vicino (orari, indirizzo), come un cartello con la tabella degli orari sotto. Chiaro, funzionale, rassicurante: chi è in una città nuova e ha paura la sera deve sentire che c'è un posto vicino e che è facile arrivarci.
Rischio da evitare: una mappa che su mobile non si usa. A 390px la mappa è un'anteprima e l'elenco dei centri per vicinanza è il contenuto principale.

PUBBLICO
Visitatore principale: un adulto che cerca sicurezza quotidiana e non vuole diventare un atleta. Arriva dopo un episodio (spesso un trasferimento in una zona nuova), dal telefono, di sera. Ha due dubbi: «funziona davvero?» e «sono fuori posto in una palestra così?». Poi i genitori che valutano il corso per i figli e le donne al primo contatto con uno sport da combattimento. Tutti cercano una sede raggiungibile, non un marchio nazionale.
Personalità: concreta, competente, vicina. Parla come un istruttore che spiega, non come un brand che vende: frasi brevi, seconda persona, zero superlativi. Il tema è la paura e il sito la disinnesca, non la usa. Emozione da ottenere: «questi sanno quello che fanno e non mi faranno sentire fuori posto».

PALETTE (fissa, non aggiungere tinte)
- Nero #000000 e Carbone #1C1C1C: i pannelli della segnaletica, la barra, la mappa.
- Bianco #FFFFFF e Grigio carta #E8E8E8: i pannelli di dettaglio (orari, indirizzo, form); #333333 solo per testo de-enfatizzato su chiaro.
- Verde presenza #00B44B su scuro, #006B2C su chiaro: in questa direzione porta più peso, perché segna i centri sulla mappa e il centro più vicino. È sempre accompagnato dal nome scritto, mai da solo. Non colora mai una superficie intera.
- Rosso azione #E30917 (premuto #B00711): solo il fondo del bottone primario, con etichetta bianca. Non indica errori, stati o linee.
- Tricolore #00973F / #FFFFFF / #E30917: solo il wordmark e un filetto da 3px.
Niente gradienti, vetro, sfocature o ombre decorative. Niente linee colorate alla metropolitana: le «linee» sono bianche o carbone.

TIPOGRAFIA
Anton (condensato, maiuscolo) per i nomi dei comuni e i numeri grandi, come nei cartelli. Roboto 300/400/700 per tutto il resto. Cifre tabulari su orari e civici. Indirizzi e orari mai sotto i 14px.

PUNTI FISSI
- Wordmark: stemma tondo più «AKM» con le tre lettere in verde #00973F, bianco #FFFFFF e rosso #E30917, e «ITALIA» più piccolo sotto. La K è bianca, quindi il wordmark sta su nero o carbone.
- Navigazione: Percorsi · Centri · Istruttori · Eventi · Contatti, più il bottone «Richiedi informazioni» sempre visibile. Sotto i 1024px le voci vanno in un menu.
- Angoli a 0px ovunque, anche i marker della mappa (targhette quadrate, non pin tondi).
- La posizione dell'utente si chiede con un click esplicito («Usa la mia posizione»), mai all'apertura della pagina.
- WCAG 2.2 AA: contrasto AA su tutto, bersagli di tocco da 44px (anche i marker), focus visibile, mappa usabile da tastiera, e nessuna informazione affidata al solo colore.
- Nessuna fotografia stock e nessuna foto di persone generata.

CONTENUTO VERO (usalo così: niente lorem, niente numeri o fatti inventati)
Centri attivi, con le zone di cui sono punto di riferimento dove note:
- Milano 1 Stazione Centrale - Gonzaga Sport Club, Via Settembrini 17/A: Repubblica, Duomo, Porta Venezia, Porta Garibaldi, Loreto, Buenos Aires, Città Studi, Lambrate, City Life.
- Milano Affori - Milano Sport, Via Iseo 6: Niguarda, Bovisasca, Bruzzano, Bicocca, Parco Nord.
- Milano Bisceglie / Lorenteggio - Palestra Piscina Cardellino, Via Cardellino 3: Bande Nere, Lorenteggio, Navigli, Baggio, Corsico, Cesano Boscone, Trezzano s/N, Settimo Milanese.
- Bresso - Palestra Beauty Island, Via Leopardi 5: Sesto San Giovanni, Bruzzano, Bicocca.
- Brugherio - Centro DREAMFIT, Via Enrico Fermi 8: Monza, San Damiano, Carugate, Cologno Monzese, Agrate Brianza.
- Cinisello Balsamo - Centro Bene-Fit, Via De Amicis 67: Sesto San Giovanni, Monza, Desio, Lissone, Cesano Maderno, Seregno, Limbiate, Nova Milanese, Muggiò.
- Paderno Dugnano - Energy Club, Viale dell'Industria 57: Garbagnate, Bollate, Sesto San Giovanni, Limbiate.
- Pogliano Milanese - Centro Dance Time Studio, Via Piave 18/20: Vanzago, Nerviano, Rho, Pero, Fiera Milano, Cornaredo, Arluno, Corbetta.
- Pontesesto Rozzano - Centro Tecnico Aisha, Via Ariosto 14: Fizzonasco, Quinto Stampi, Noverasco, Opera, Pieve Emanuele, Zibido San Giacomo.
- San Giuliano Milanese - Accademia Arte Danza, Via Carducci 5: Linate, Mezzate, Chiaravalle, Poasco, San Donato Milanese, Mediglia, Peschiera Borromeo.
- Mulazzano (LO) - Istituto Comprensivo A. Gramsci, Via Ada Negri 44: Melegnano, San Zenone al Lambro, Tavazzano, Vizzolo Predabissi, Lodi.
- Binasco - Palestra Santa Corinna, SP30.
- Corsico - Scuola Omnicomprensivo, Viale Italia 22/24.
- Saronno (VA) - Danza con Veronica, Via Radice 12.
- Sesto San Giovanni - Energy Club, Via Magenta 200.
Tre percorsi, ognuno aperto da una domanda in prima persona:
1. «Voglio sapermi difendere ogni giorno» → Krav Maga adulti, in tutti i 15 centri.
2. «Cerco qualcosa per mio figlio» → Krav Maga kids, antibullismo dai 9 anni, in 4 centri: Binasco, Bresso, Milano Bisceglie, Paderno Dugnano.
3. «Voglio un corso per sole donne» → Difesa personale donna. In questa stagione non ha un centro attivo: mostralo senza scrivere «0», e invita a lasciare comunque una richiesta.
Frasi sulla prima lezione, da usare alla lettera: «Non chiede di essere allenati per cominciare.» · «La prima lezione si concorda con il docente del centro.»
Istruttori: Omar Borghini, Vice Presidente e Direttore Tecnico AKM Italia (Krav Maga Master CSEN-CONI; Krav Maga Master Docente Nazionale F.E.K.D.A.; Responsabile Formazione P.T.D. Police Training Division). Vittorio Porreca, maestro.
Eventi: a fine settembre 2026 i centri tengono la «presentazione», la lezione aperta di inizio stagione; per esempio 30 settembre ore 20:00 Mulazzano, 30 settembre ore 20:25 Brugherio, 30 settembre ore 20:30 Pontesesto Rozzano.

SCHEDA DEL CENTRO (seconda pagina): Pontesesto Rozzano - Centro Tecnico Aisha, Via Ludovico Ariosto 14, Rozzano (MI). Punto di riferimento per Fizzonasco, Quinto Stampi, Noverasco, Opera, Pieve Emanuele e Zibido San Giacomo. Orario: mercoledì 20:30-22:00, Krav Maga adulti (adulti e ragazzi), docente Luca. Mappa di dettaglio, «Apri in Maps», e il form di richiesta con il centro già selezionato. AKM non pubblica telefono né email per centro: il contatto passa dal form.
Form di richiesta: nome, cognome, email, telefono (facoltativo), data di nascita, centro tecnico, percorso di interesse, messaggio, consenso privacy. Obbligatori dichiarati a parole, errori scritti accanto al campo.

DA NON FARE (anti-reference)
- Sito federale anni 2000: home fatta di news, PDF come navigazione, tabelle di orari illeggibili, fila di loghi di enti nel piè di pagina.
- Template SaaS: hero con gradiente, tre card identiche icona + titolo + testo, bottone «Scopri di più».
- Fitness/wellness patinato: stock di gente che sorride, palette da centro benessere, linguaggio da percorso di benessere.
- Palestra MMA tattica, e in questa direzione anche l'estetica militare da mappa operativa: niente mirini, griglie radar, coordinate da HUD o camo.
- Niente minacce, niente leve sulla paura, niente promesse di invincibilità.
```

### Dopo Claude Design

Le tavole che escono vanno lette con `antislop:antislop-ui` prima di mostrarle al cliente, e i prototipi stanno su branch `prototipo/registro-*` (#62). Se una direzione cambia la tipografia (B toglie Anton dai titoli), la voce «Tipografia» della mappa si apre lì: licenza, file variabili, livelli da rimisurare.

## Domande per il cliente emerse qui

- **Corso donne.** L'unico centro che lo teneva (Muggio) risulta non attivo. Riapre, si sposta, o il percorso esce dal bivio per questa stagione?
- **Quante sere a settimana.** La bozza dei percorsi dice «due sere» nella maggior parte dei centri; i dati ne mostrano una sola in 13 centri su 15.
- **«Lotta Metodo Krav Maga».** È il nome con cui il calendario del sito attuale titola le presentazioni. Il sito nuovo dice «Krav Maga adulti»: va chiesto se «Lotta Metodo» è un nome da tenere.
