# Context

Glossario del dominio AKM Italia. Solo termini, nessuna decisione di implementazione.

## Centro tecnico

Il luogo dove si pratica, e l'unita' di conversione del sito: ogni percorso finisce in un centro tecnico. Nel codice e nella URL pubblica e' `sedi`; nel parlato di AKM e' «centro tecnico». I due nomi indicano la stessa cosa.

Un centro tecnico e' identificato dal nome, che nella pratica unisce comune e struttura ospitante: «Abbiategrasso - Dynamic Dance School».

Non e' la **palestra**: la palestra e' la struttura fisica che ospita il centro, puo' avere un nome proprio commerciale e non appartiene ad AKM.

Un centro **attivo** e' diverso da un centro **pubblicato**. Pubblicato riguarda l'annuncio: una sede non ancora annunciata e' una bozza. Attivo riguarda la stagione: una sede chiusa per la stagione resta pubblicata e sparisce dagli elenchi.

Non e' un **luogo evento**. L'Albo elenca i centri tecnici, non ogni indirizzo che abbia mai ospitato AKM.

## Luogo evento

L'indirizzo dove si e' tenuto o si terra' un evento: una presentazione, uno stage, un seminario. Un luogo evento puo' coincidere con un centro tecnico, ma la maggior parte non lo e': sono sedi occasionali, spesso di una stagione sola, e non hanno orari ne' docenti.

Un luogo evento non entra nell'elenco dei centri. Un centro chiuso non diventa un luogo evento: resta un centro non attivo se qualcuno pensa di riaprirlo, altrimenti sparisce.

## Orario

Una riga di programmazione settimanale di un centro tecnico: una disciplina, i giorni in cui si tiene, l'ora di inizio e di fine, e il **docente** che la tiene. Un centro ha piu' orari; un orario appartiene a un solo centro.

Non e' un evento: l'evento e' datato e straordinario (uno stage, un seminario), l'orario e' ricorrente e ordinario.

## Docente

L'istruttore che tiene un dato **orario**. E' un ruolo, non una qualifica: la qualifica (istruttore, trainer, maestro, direttore tecnico, presidente) descrive la persona e non cambia da un centro all'altro, il ruolo di docente descrive chi insegna quella riga di quel centro. Un orario puo' averne piu' di uno; una persona puo' essere docente in piu' centri.

Il docente e' il **referente** della sede per il visitatore: e' la persona nominata sulla scheda. Non e' un recapito. AKM non pubblica telefono ne' email per centro: il contatto passa dal form, che instrada alla sede scelta.

## Corso

Cio' che si pratica: la disciplina a cui punta la riga di un **orario**, e insieme la sua pagina pubblica. Un corso ha un nome proprio («Krav Maga - Antiaggressione femminile»), dei **destinatari** e un **ruolo di colore**.

I **destinatari** dicono a chi si rivolge il corso (adulti, ragazzi, bambini, donne, istruttori, aziende e forze dell'ordine). Non sono un percorso: un corso solo puo' rivolgersi a piu' di un pubblico, e infatti quasi tutti gli orari del corso regolare dicono «Adulti e Ragazzi».

Il **ruolo di colore** e' uno dei quattro di `DESIGN.md` (Verde AKM, Rosso Mattone, Carta, Inchiostro). E' un ruolo, non un colore: si assegna scegliendo fra i quattro, non si sceglie una tinta.

## Percorso

Il corso visto dal primo bivio. **Non e' una seconda entita'**: un percorso e' un corso marcato come voce di orientamento, con la sua **domanda** scritta in prima persona («Voglio sapermi difendere ogni giorno»).

Il bivio e' la prima decisione che il sito chiede, e la domanda che risolve e' «qual e' il mio momento», non «quale disciplina». Per questo il percorso si sceglie per **chi domanda**, mai per eta': «crescita dei ragazzi» e' la voce del genitore e copre ogni corso che riguardi un minore; l'eta' sta nella scheda del corso e nella nota dell'orario, dove e' gia' scritta.

Un corso nuovo **non** e' un percorso finche' qualcuno non lo marca. Il bivio resta corto per scelta editoriale, non per vincolo tecnico.

Un percorso puo' non avere nessun **centro tecnico** attivo che lo tenga: il bivio dichiara che quel corso esiste, non che parte lunedi'. La marcatura e' editoriale e non si spegne da sola quando gli **orari** finiscono.

## Richiesta

Il messaggio che il visitatore manda dal form pubblico per essere ricontattato da un **centro tecnico**. E' l'esito che il sito misura, e l'unico modo di contattare AKM: non ci sono recapiti per centro.

Una richiesta dice «voglio sapere», non «tenetemi il posto». Non e' un'**iscrizione**: l'iscrizione avviene fuori dal sito, con la documentazione che AKM manda dopo, e chiede dati che la richiesta non chiede. Per la stessa ragione non e' una **preiscrizione**: la parola promette un posto trattenuto, e nessun posto viene trattenuto.

Una richiesta nomina un **centro tecnico** e puo' nominare un **corso**, e nessuno dei due e' garantito: chi non ha ancora risolto il primo bivio non sa il corso, e chi arriva da un corso che nessun centro attivo tiene non ha un centro da nominare. In entrambi i casi la non-scelta e' una risposta dichiarata, non un campo lasciato vuoto, e la richiesta resta valida.

## Sezione

Una parte fissa del sito: esiste perche' qualcuno l'ha scritta nel codice, e il cliente non la puo' creare ne' togliere. Sono sezioni la home, l'elenco dei **centri tecnici**, la scheda di un centro, la pagina di un **corso**, l'albo degli istruttori, la **richiesta** e l'informativa privacy.

Il test e' la cancellazione: se togliendola si rompe un collegamento scritto nel codice, e' una sezione. Il cliente ne governa il contenuto (i centri, i corsi, gli orari), mai l'esistenza.

Non e' una voce di menu: la testata ne nomina due, e le sezioni sono di piu'. Una sezione puo' non stare in nessun menu e restare raggiungibile.

## Pagina

Un documento di testo scritto dal cliente, che una **sezione** dedicata rende. Sono pagine le legali: l'informativa privacy e le poche che le somiglieranno.

La differenza con la sezione e' chi la puo' creare: una pagina nasce nell'admin, una sezione nasce in un commit. Il cliente scrive le parole di una pagina, non la sua composizione: la disposizione la decide il codice, sempre.

Il sito vecchio ne aveva trentanove, quasi tutte convertite in campi di un **corso** o di un **centro tecnico**. Una pagina e' cio' che resta quando nessun campo la puo' ospitare.
