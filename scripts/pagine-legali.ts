/**
 * Crea (o riallinea) le due pagine legali: /privacy e /cookie.
 *
 *   pnpm pagine:legali
 *
 * Il testo descrive cosa il sito fa davvero: i campi di `richieste`, il consenso
 * con marca temporale messa dal server, l'avviso SMTP a `emailRichieste`, i
 * cookie tecnici dell'admin Payload, le tile OpenStreetMap e la geolocalizzazione
 * che resta nel browser. Se il sito cambia comportamento, questo testo va
 * cambiato: e' una dichiarazione, non un modulo di cortesia.
 *
 * Da qui in poi la fonte di verita' e' Payload: il cliente li riscrive
 * dall'admin. Lo script e' il punto di partenza e si puo' rilanciare, ma
 * riscrive quello che l'admin ha modificato.
 *
 * DA CONFERMARE AL CLIENTE (restano scritti in chiaro nel testo, non inventati):
 * denominazione e indirizzo del titolare, PEC, eventuale responsabile della
 * protezione dei dati, tempi di conservazione delle richieste.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

import { p, ricco, ul } from './lexical'

const TITOLARE =
  'Titolare del trattamento: AKM Italia. [DA CONFERMARE: denominazione completa, sede legale, codice fiscale, PEC.] I recapiti aggiornati sono nella pagina Richiedi informazioni.'

const privacy = {
  titolo: 'Privacy',
  slug: 'privacy',
  occhiello: 'Trattamento dei dati personali',
  sommario:
    'Cosa raccogliamo quando scrivi dal sito, perché lo facciamo, per quanto lo teniamo e come lo cancelli. Regolamento UE 2016/679.',
  sezioni: [
    {
      titolo: 'Chi tratta i dati',
      testo: ricco([p(TITOLARE)]),
    },
    {
      titolo: 'Quali dati raccogliamo',
      testo: ricco([
        p(
          'Il sito ha un solo modulo, quello di Richiedi informazioni. Quando lo invii ci arrivano i dati che hai scritto:',
        ),
        ul([
          'cognome e nome',
          'email e telefono',
          'data di nascita',
          'il centro tecnico che hai scelto e, se lo indichi, il percorso di interesse',
          'il messaggio, se lo scrivi',
          'la data e l’ora in cui hai dato il consenso, registrate dal nostro server',
        ]),
        p(
          'Non chiediamo nient’altro e non compriamo elenchi. Il sito non ha area riservata, non profila e non fa pubblicità mirata.',
        ),
      ]),
    },
    {
      titolo: 'Perché li trattiamo',
      testo: ricco([
        p(
          'Per ricontattarti e rispondere alla tua richiesta di informazioni su corsi e centri. La base giuridica è il tuo consenso, che dai spuntando la casella nel modulo (art. 6.1.a del Regolamento). Puoi revocarlo in qualsiasi momento: la revoca non tocca quello che è già stato fatto prima.',
        ),
        p(
          'La data di nascita serve a sapere se il percorso che ti interessa è aperto alla tua età e, per i minori, a chiedere il consenso di chi ne ha la responsabilità genitoriale.',
        ),
      ]),
    },
    {
      titolo: 'Chi li vede',
      testo: ricco([
        p(
          'La richiesta arriva per email alla segreteria di AKM Italia e viene inoltrata all’istruttore che tiene le lezioni nel centro che hai scelto: è la persona che ti richiama. Non escono da lì e non vengono ceduti a terzi per finalità commerciali.',
        ),
        p(
          'I dati sono conservati sul database del sito e transitano dal servizio di posta del dominio, che agisce come responsabile del trattamento.',
        ),
      ]),
    },
    {
      titolo: 'Per quanto li teniamo',
      testo: ricco([
        p(
          '[DA CONFERMARE con il titolare: indicare i mesi o gli anni.] Se non dai seguito alla richiesta e non ti iscrivi, i dati vengono cancellati alla scadenza indicata. Se ti iscrivi, il trattamento prosegue sulla base del rapporto associativo e delle norme sportive e fiscali, che hanno tempi propri.',
        ),
      ]),
    },
    {
      titolo: 'I tuoi diritti',
      testo: ricco([
        p(
          'Puoi chiedere in qualsiasi momento di accedere ai tuoi dati, correggerli, cancellarli, limitarne il trattamento, riceverne una copia o opporti al trattamento (artt. 15-22 del Regolamento). Scrivi all’indirizzo email che trovi nella pagina Richiedi informazioni: rispondiamo entro un mese.',
        ),
        p(
          'Se ritieni che il trattamento non sia corretto puoi rivolgerti al Garante per la protezione dei dati personali (garanteprivacy.it).',
        ),
      ]),
    },
    {
      titolo: 'Minori',
      testo: ricco([
        p(
          'I percorsi per bambini e ragazzi si richiedono attraverso un genitore o chi ne fa le veci. Se hai meno di 14 anni non inviare il modulo da solo: fallo compilare a chi ha la responsabilità genitoriale.',
        ),
      ]),
    },
    {
      titolo: 'La mappa e la posizione',
      testo: ricco([
        p(
          'Le mappe del sito usano le tile di OpenStreetMap. Caricandole il tuo browser contatta i server di openstreetmap.org, che vedono il tuo indirizzo IP: è il funzionamento normale di qualsiasi immagine caricata da un altro dominio, e non installa cookie.',
        ),
        p(
          'Il bottone «Trova il centro più vicino» chiede al browser la tua posizione, e solo dopo che lo hai premuto: il sito non la chiede all’apertura. La posizione serve a ordinare l’elenco dei centri e resta nel tuo browser. Non ci arriva, non la salviamo e non la mandiamo a nessuno.',
        ),
      ]),
    },
  ],
}

const cookie = {
  titolo: 'Cookie',
  slug: 'cookie',
  occhiello: 'Cosa il sito salva nel tuo browser',
  sommario:
    'Il sito non usa cookie di profilazione e non ha banner perché non ha niente da farti accettare.',
  sezioni: [
    {
      titolo: 'Nessun cookie di profilazione',
      testo: ricco([
        p(
          'Il sito pubblico non usa cookie di profilazione, non ha statistiche di terze parti, non ha pixel di social network e non condivide dati con circuiti pubblicitari. Per questo non trovi un banner: non c’è niente da accettare.',
        ),
      ]),
    },
    {
      titolo: 'Cosa viene salvato davvero',
      testo: ricco([
        ul([
          'Un cookie tecnico di sessione per chi entra nel pannello di amministrazione: serve a tenere l’accesso e riguarda solo lo staff.',
          'Nella memoria di sessione del browser, l’esito della richiesta di posizione, per non richiedertela a ogni pagina. Si cancella quando chiudi la scheda e non lascia il tuo dispositivo.',
        ]),
      ]),
    },
    {
      titolo: 'Contenuti caricati da altri domini',
      testo: ricco([
        p(
          'Le mappe usano le tile di OpenStreetMap: il browser le scarica da openstreetmap.org, che vede il tuo indirizzo IP ma non installa cookie. I caratteri tipografici e le immagini sono ospitati sul nostro dominio.',
        ),
      ]),
    },
    {
      titolo: 'Come li cancelli',
      testo: ricco([
        p(
          'Dalle impostazioni del tuo browser, alla voce dati dei siti. Non serve fare nient’altro: il sito pubblico funziona identico senza.',
        ),
      ]),
    },
  ],
}

const payload = await getPayload({ config })

for (const pagina of [privacy, cookie]) {
  const { docs } = await payload.find({
    collection: 'pagine',
    where: { slug: { equals: pagina.slug } },
    limit: 1,
    depth: 0,
    draft: true,
    overrideAccess: true,
  })

  /* `generateSlug: false` spegne l'hook che riscriverebbe lo slug dal titolo.
     `parent` resta vuoto: sono pagine di primo livello, quindi l'hook di
     Pagine.ts calcola path = /privacy e /cookie. */
  const data = { ...pagina, generateSlug: false, _status: 'published' } as never

  const salvata = docs[0]
    ? await payload.update({ collection: 'pagine', id: docs[0].id, data, overrideAccess: true })
    : await payload.create({ collection: 'pagine', data, overrideAccess: true })

  payload.logger.info(`${docs[0] ? 'Aggiornata' : 'Creata'} ${salvata.path}`)
}

/* Il consenso del modulo deve poter puntare all'informativa: se nessuno ha
   ancora scelto la pagina a mano, la si aggancia qui. Una scelta gia' fatta
   dall'admin non si tocca. */
const contatti = await payload.findGlobal({ slug: 'contatti', depth: 0, overrideAccess: true })
if (!contatti.modulo?.paginaPrivacy) {
  const { docs } = await payload.find({
    collection: 'pagine',
    where: { slug: { equals: 'privacy' } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (docs[0]) {
    try {
      /* updateGlobal sostituisce il documento, non lo fonde: senza lo spread
         `email`, che e' obbligatoria, sparirebbe e la validazione fallirebbe. */
      await payload.updateGlobal({
        slug: 'contatti',
        data: { ...contatti, modulo: { ...contatti.modulo, paginaPrivacy: docs[0].id } } as never,
        overrideAccess: true,
      })
      payload.logger.info('Informativa agganciata al consenso del modulo.')
    } catch {
      /* Il global Contatti ha campi obbligatori (l'Email) che nessuno ha ancora
         compilato: non si puo' salvare da qui. Non e' un errore di questo
         script, e' un dato che manca. */
      payload.logger.warn(
        'Contatti non ancora compilato: apri Sistema > Contatti, scrivi l’Email e scegli /privacy come «Pagina dell informativa».',
      )
    }
  }
}

payload.logger.info('Fatto. Titolare, tempi di conservazione e PEC restano da confermare.')
process.exit(0)
