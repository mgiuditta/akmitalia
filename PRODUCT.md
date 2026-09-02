# Product

## Register

brand

## Users

Il visitatore primario è un **adulto che cerca sicurezza quotidiana**: non vuole diventare un atleta, vuole sapere che se succede qualcosa sa cosa fare. Arriva quasi sempre dopo un episodio (una brutta sera, una notizia, un trasferimento in una zona nuova), spesso da mobile, spesso di sera. Non conosce il Krav Maga se non per sentito dire, e ha un dubbio doppio: «funziona davvero?» e «sono fuori posto in una palestra così?».

Il lavoro da fare: capire in pochi minuti quale percorso è il suo e dove praticarlo vicino a casa, poi mandare una richiesta senza sentirsi impegnato a nulla.

Pubblici secondari, serviti dagli stessi percorsi ma con bisogni diversi:

- **Genitori** che valutano Krav Maga Kids: cercano crescita e ambiente sicuro, non combattimento.
- **Donne** interessate al percorso antiaggressione: spesso primo contatto assoluto con uno sport da combattimento.
- **Aspiranti istruttori** e tecnici: cercano qualifiche, riconoscimenti e serietà dell'ente, non motivazione.

Tutti condividono un contesto: cercano **una sede raggiungibile**, non un marchio nazionale.

## Product Purpose

Sito pubblico di AKM Italia: orienta chi cerca difesa personale verso il percorso giusto e verso il centro tecnico più adatto, e raccoglie la richiesta di contatto instradata a quella sede.

Non è un catalogo corsi né una vetrina istituzionale. È uno strumento di orientamento con un unico esito misurabile.

**Successo**: richiesta inviata dal form con sede e percorso selezionati, che arriva al responsabile di quel centro. Tutto il resto (albo istruttori, news, eventi, pagine corso) esiste per rendere quella richiesta credibile e informata.

Il contenuto è gestito interamente da Payload CMS (Sedi, Corsi, Istruttori, Eventi, News, Pagine, Richieste), in italiano, locale unico. Le sedi sono decine e cambiano di stagione: il design deve reggere un elenco che cresce e si aggiorna senza intervento sul codice.

## Brand Personality

**Concreto, competente, vicino.**

- **Voce**: parla come un istruttore che spiega, non come un brand che vende. Frasi brevi, seconda persona, zero superlativi. Dice cosa succede alla prima lezione, non cosa diventerai.
- **Tono**: calmo e adulto. Il tema è la paura, quindi il sito non la usa come leva: la disinnesca. Chi arriva è già a disagio all'idea di entrare in palestra. Il registro visivo è duro, il copy no: è il testo che tiene la soglia bassa mentre la tipografia alza la voce.
- **Emozione target**: sollievo competente. «Questi sanno quello che fanno e non mi faranno sentire fuori posto.»
- **Prova**: nomi, indirizzi, orari, volti di istruttori con qualifiche verificabili (CSEN-CONI, F.E.K.D.A., P.T.D.). La credibilità viene dai dati, non dagli aggettivi.

Vincolo di marca dato dal cliente: il wordmark **AKM ITALIA in verde, bianco e rosso** (tricolore). È un dato di partenza, non una scelta aperta. `DESIGN.md` lo confina al solo wordmark: il sistema visivo è monocromo e non porta alcun accento cromatico, quindi il tricolore non si estende a percorsi, sezioni o componenti.

## Anti-references

Tre trappole, tutte da evitare:

1. **Sito federale anni 2000**: homepage a news, PDF, tabelle, loghi di enti accatastati in footer. Serio ma illeggibile, e su mobile inutilizzabile.
2. **SaaS template**: hero con gradiente, tre card identiche icona + titolo + testo, bottone «Scopri di più». Poteva essere qualunque cosa: non dice niente su AKM.
3. **Fitness/wellness patinato**: stock photo di gente che sorride, palette da centro benessere, linguaggio da percorso di benessere. Non credibile su un tema di sicurezza personale.

Divieto trasversale: **niente foto stock**. Meglio nessuna immagine che una comprata.

**Il registro visivo da palestra da combattimento è una scelta, non un incidente.** Era la prima anti-reference di questo documento fino al 2026-09-01: nero, altissimo contrasto, display condensato sovradimensionato. Il sistema di `DESIGN.md` adotta quel registro deliberatamente, ripulito dai suoi cliché: niente camo, niente teschi, niente rosso sangue, niente foto di pugni in controluce, nessun accento cromatico di alcun tipo. La durezza sta nella scala tipografica e nel contrasto di superficie, non nell'iconografia. Il costo è dichiarato in `docs/adr/0004`: questo registro parla forte all'adulto che cerca sicurezza quotidiana e chiede più lavoro di copy per non tagliare fuori genitori e prime praticanti.

## Design Principles

1. **Presenza prima del marchio.** AKM è centri, docenti e corsi distribuiti sul territorio, non un marchio astratto ventennale. Ogni sezione dovrebbe poter nominare un luogo o una persona. Se una pagina non ne nomina nessuno, sta vendendo un'astrazione.

2. **Prima orientare, poi convertire.** Il visitatore non sa cosa gli serve. La prima decisione che il sito gli chiede non è «iscriviti», è «qual è il tuo momento»: sicurezza quotidiana, crescita dei ragazzi, antiaggressione, formazione tecnica. Nessuna richiesta di contatto prima che quel bivio sia risolto.

3. **Ogni percorso finisce in una sede.** La sede è la conversione. Cliccare un centro deve dare tutto: indirizzo, orari, referente, come arrivarci, cosa ci si pratica. Un elenco di città senza dati è una barriera travestita da funzionalità.

4. **Le credenziali sono prove, non decorazioni.** Qualifiche, albo istruttori e riconoscimenti servono a rispondere a «funziona davvero?». Vanno dove quella domanda nasce, non ammassate in una pagina «chi siamo» o in una fila di loghi.

5. **Togliere paura, non aggiungerla.** Nessuna leva sull'insicurezza. L'estetica è severa per scelta, il messaggio no: nessuna minaccia, nessuna promessa di violenza, nessuna iconografia da scontro. Il sito abbassa la soglia d'ingresso con le parole e con il dato, cosa portare, cosa succede la prima volta, che non serve essere allenati, mentre la forma resta asciutta e ad alto contrasto.

## Accessibility & Inclusion

**WCAG 2.2 AA** come baseline non negoziabile:

- Contrasto AA su tutto il testo e sui componenti interattivi. Il sistema è monocromo ad altissimo contrasto, quindi il daltonismo non è un rischio e il grosso del testo passa AAA. I due punti da guardare sono altri: il testo de-enfatizzato `#333333` non regge su superficie scura e vive solo su fondo chiaro, e il testo a 14px su nero puro va verificato per il tremolio da contrasto eccessivo. Nessuna informazione è veicolata dal solo valore di superficie: ogni categoria porta sempre il nome scritto.
- Focus visibile e ordine di tabulazione coerente su tutta la navigazione e sul form richiesta.
- Form etichettato in modo esplicito, errori descritti a parole e associati al campo, campi obbligatori dichiarati nel testo oltre che con l'asterisco.
- `prefers-reduced-motion` rispettato.
- Il controllo anti-bot deve essere accessibile: preferire un metodo senza puzzle visivo (honeypot, time-trap, o captcha accessibile) piuttosto che un test di riconoscimento immagini.
- Mobile-first reale: gran parte del traffico arriva da telefono, di sera.
