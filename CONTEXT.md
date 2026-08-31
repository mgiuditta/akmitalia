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

## Percorso

`[da risolvere in #12]` Il termine e' usato in tre modi incompatibili fra `PRODUCT.md`, `DESIGN.md` e l'enum `Corsi.target`. Finche' non e' risolto, non usarlo come se fosse definito.
