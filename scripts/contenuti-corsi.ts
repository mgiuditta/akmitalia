/**
 * Riempie i tre percorsi esistenti: descrizione, focus, risultati, adatto a,
 * cadenza, ingresso.
 *
 *   pnpm contenuti:corsi
 *
 * Le pagine percorso erano gusci: `descrizione` nulla su tutti e tre e gli array
 * vuoti, quindi il layout non aveva niente da comporre. Questo e' il punto di
 * partenza, non la fonte di verita': da qui in poi il cliente riscrive
 * dall'admin. Rilanciarlo sovrascrive quello che l'admin ha cambiato.
 *
 * Voce di PRODUCT.md: seconda persona, frasi brevi, zero superlativi, nessuna
 * leva sull'insicurezza. Vale in particolare per l'antiaggressione femminile:
 * il principio 5 («togliere paura, non aggiungerla») e' un vincolo.
 *
 * Non tocca `nome`, `slug`, `superficie`, `inBivio`, `ordine` e `target`, che
 * sono struttura, ne' `prova` dove ce n'e' gia' una verificata.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

import { p, ricco } from './lexical'

const voci = (elenco: string[]) => elenco.map((voce) => ({ voce }))

const contenuti = {
  'krav-maga-self-defense-system': {
    cadenza: 'Nella maggior parte dei centri due sere a settimana, in giorni fissi.',
    ingresso:
      'Si entra durante la stagione, senza aspettare settembre. La prima lezione si concorda con il docente del centro.',
    descrizione: ricco([
      p(
        'Il Krav Maga nasce come sistema di difesa, non come disciplina sportiva: non ha gare, non ha categorie di peso e non chiede di essere allenati per cominciare. Si lavora su quello che succede davvero, che quasi sempre è una situazione confusa, vicina e breve.',
      ),
      p(
        'La lezione parte dal riscaldamento e arriva al lavoro in coppia. Si impara prima a leggere la distanza e a non farsi raggiungere, poi a rispondere se la distanza si è già persa. Le tecniche sono poche e si ripetono a lungo: quello che conta è che vengano fuori quando non hai tempo di pensarci.',
      ),
      p(
        'Si pratica in coppia, con l’intensità che il tuo compagno può reggere. Nessuno ti mette a confronto con chi pratica da anni, e il docente resta sulla sala per tutta l’ora.',
      ),
    ]),
    focus: voci([
      'Distanza e posizione',
      'Difesa da prese e strangolamenti',
      'Difesa da percosse',
      'Reazione a una sorpresa',
      'Difesa da terra',
      'Difesa da armi',
      'Più di un aggressore',
    ]),
    risultati: voci([
      'Riconosci prima una situazione che sta girando male, e nella maggior parte dei casi te ne esci senza toccare nessuno.',
      'Sai tenere la distanza e sai cosa fare quando la distanza non c’è più.',
      'Reagisci con qualche gesto essenziale invece di bloccarti a cercare la mossa giusta.',
      'Ti alleni con continuità: la difesa personale non è un seminario, è un’abitudine settimanale.',
    ]),
    adattoA: voci([
      'Chi non viene da uno sport da combattimento e non ha nessuna intenzione di gareggiare.',
      'Chi si è trasferito in una zona nuova e vuole sentirsi tranquillo la sera.',
      'Chi lavora a contatto con il pubblico e ha già avuto a che fare con qualcuno fuori controllo.',
      'Chi ha smesso di allenarsi da anni e vuole ricominciare dal proprio passo.',
    ]),
  },

  'krav-maga-antibullismo': {
    cadenza: 'Un’ora alla settimana, in giorno fisso.',
    ingresso:
      'Si entra durante l’anno. La prima lezione si concorda con il docente del centro, e un genitore può restare a guardarla.',
    descrizione: ricco([
      p(
        'Il corso per bambini e ragazzi non insegna a picchiare, e non serve a farsi rispettare con la forza. Serve a stare dritti in una situazione in cui qualcuno prova a togliere spazio, che è la forma che prende il bullismo quasi sempre: parole, spinte, esclusione, non una rissa.',
      ),
      p(
        'In sala si lavora con il gioco e con la ripetizione. Si impara a mantenere la distanza, a dire di no ad alta voce, a chiedere aiuto senza vergogna e a uscire da una presa. Il contatto c’è, ma è misurato e sempre guidato dal docente.',
      ),
      p(
        'Il risultato che i genitori notano per primo di solito non è tecnico: è che il ragazzo cammina in modo diverso e risponde in modo diverso.',
      ),
    ]),
    focus: voci([
      'Fiducia in sé',
      'Dire di no',
      'Tenere la distanza',
      'Chiedere aiuto',
      'Uscire da una presa',
      'Gestire la paura',
      'Rispetto delle regole della sala',
    ]),
    risultati: voci([
      'Riconosce quando una situazione sta diventando prevaricazione e la nomina, invece di subirla in silenzio.',
      'Sa dire di no con la voce e con il corpo, che è quello che ferma la maggior parte degli episodi.',
      'Sa a chi rivolgersi: chiedere aiuto a un adulto viene insegnato come una scelta, non come una resa.',
      'Si muove con più coordinazione e più sicurezza, dentro e fuori dalla sala.',
    ]),
    adattoA: voci([
      'Bambini e ragazzi che non hanno mai fatto uno sport da combattimento.',
      'Genitori che cercano un ambiente con regole chiare e un istruttore che si conosce per nome.',
      'Ragazzi timidi, che è il caso in cui questo percorso serve di più.',
      'Chi cerca un’attività settimanale che non sia una gara ogni domenica.',
    ]),
  },

  'krav-maga-antiaggressione-femminile': {
    sommario:
      'Corso di antiaggressione riservato alle donne, con lezioni settimanali. Si comincia senza esperienza, e la prima cosa che si impara non è colpire: è tenere la distanza.',
    cadenza: 'Una lezione alla settimana, in giorno fisso.',
    ingresso:
      'Si entra durante la stagione. La prima lezione si concorda con la o il docente del centro, e si può venire accompagnate.',
    prova:
      'I docenti sono diplomati dopo almeno quattro anni di percorso e un esame di abilitazione all’insegnamento, tesserati e assicurati CSEN.',
    descrizione: ricco([
      p(
        'Il corso è riservato alle donne perché il gruppo cambia la lezione: si fanno domande che davanti a una sala mista non si fanno, e si prova senza avere addosso lo sguardo di nessuno.',
      ),
      p(
        'Si parte dalle cose che funzionano prima del contatto: la distanza, la posizione, la voce. Poi si lavora sulle prese e sui blocchi, cioè su quello che capita più spesso, e si impara come ci si libera senza dover essere più forti di chi ti tiene. Le tecniche sono poche e pensate per essere fatte in fretta e male, perché è così che verranno fuori.',
      ),
      p(
        'Si pratica in coppia, con l’intensità che decidi tu. Nessun esercizio richiede di fare qualcosa che non ti va di fare, e si può fermare in qualsiasi momento senza spiegare perché.',
      ),
    ]),
    focus: voci([
      'Distanza di sicurezza',
      'Usare la voce',
      'Uscire da una presa',
      'Liberarsi da un blocco',
      'Difesa da dietro',
      'Situazioni in spazi stretti',
    ]),
    risultati: voci([
      'Sai tenere una distanza, e riconosci quando qualcuno te la sta togliendo.',
      'Sai liberarti da una presa senza dover essere più forte di chi ti tiene.',
      'Usi la voce come prima difesa, che è quella che fa desistere più spesso.',
      'Ti muovi con più sicurezza dove prima cambiavi strada.',
    ]),
    adattoA: voci([
      'Chi non ha mai fatto uno sport da combattimento e non pensa di essere il tipo.',
      'Chi vuole allenarsi in un gruppo di sole donne.',
      'Chi torna a casa tardi e vuole sapere cosa fare prima che serva.',
      'Chi ha già avuto un episodio e vuole rimettere piede fuori senza pensarci ogni volta.',
    ]),
  },
} as const

const payload = await getPayload({ config })

for (const [slug, dati] of Object.entries(contenuti)) {
  const { docs } = await payload.find({
    collection: 'corsi',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    draft: true,
    overrideAccess: true,
  })

  const corso = docs[0]
  if (!corso) {
    payload.logger.warn(`Corso ${slug} non trovato: saltato.`)
    continue
  }

  await payload.update({
    collection: 'corsi',
    id: corso.id,
    // `generateSlug: false`: slugify() mangia gli accenti e riscriverebbe lo slug.
    data: { ...dati, generateSlug: false, _status: 'published' } as never,
    overrideAccess: true,
  })

  payload.logger.info(`Aggiornato ${slug}`)
}

payload.logger.info('Fatto. Il testo dei percorsi va riletto dal cliente prima del rilascio.')
process.exit(0)
