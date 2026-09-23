/**
 * Le fotografie editoriali del sito: le genera se mancano, le carica in Media e
 * le assegna agli slot che le usano.
 *
 *   GEMINI_API_KEY=... pnpm images:editorial
 *
 * AKM non ha un archivio fotografico utilizzabile: le immagini del vecchio sito
 * sono compresse, a colori e con i volti riconoscibili di persone che non hanno
 * firmato nulla. Finche' il cliente non fa un servizio in sala, queste sono
 * fotografie generate, e il fatto che siano generate sta scritto qui, nella
 * didascalia di ciascuna - che il sito stampa sopra la foto, visibile - e nel
 * testo alternativo. Non nascosto, e non solo per chi non vede.
 *
 * I prompt stanno nel codice per due motivi: sono il solo modo di rifare la
 * stessa immagine, e dicono che cosa la fotografia deve mostrare - una palestra
 * comunale vera, luce al neon, magliette nere, niente posa - che e' una
 * decisione editoriale, non un parametro tecnico.
 *
 * Rieseguibile: un file gia' presente non viene rigenerato, un media gia'
 * caricato non viene duplicato. Le assegnazioni invece si riscrivono: se il
 * cliente ha messo la sua foto dall'admin, questo script gliela sostituisce.
 */
import { mkdir, access } from 'node:fs/promises'
import path from 'node:path'

import { getPayload } from 'payload'
import config from '@payload-config'
import sharp from 'sharp'

const FOLDER = path.resolve(process.cwd(), 'data/immagini')

/* Detto sulla foto, non solo nel testo alternativo: chi guarda una sala piena di
   gente sotto «Le qualifiche si contano» deve sapere che quelle persone non sono
   state in nessuna sala. Sparisce da sola il giorno che il cliente carica le sue
   fotografie, perche' la didascalia e' un campo del file, non del posto. */
const CAPTION = 'Immagine generata: non ritrae una lezione o persone reali.'
const MODEL = process.env.NANOBANANA_MODEL || 'gemini-2.5-flash-image'

/* Il registro visivo, uguale per tutte: e' il trattamento di DESIGN.md portato
   in fotografia. Nessun colore, nessuna posa, nessuna vignettatura finta. */
const REGISTRY =
  'Documentary black and white reportage photograph, grainy 35mm film look, high contrast, deep blacks, cold fluorescent light, plain Italian municipal gymnasium with wooden parquet, wall bars and crash mats. People in plain black t-shirts and dark trousers. Natural and unposed. Full-frame edge to edge exposure with no vignette, no dark border, no rounded corners. No colour, no logos, no text, no watermark.'

type Shot = {
  /** Il nome del file in data/immagini e in Media. */
  nome: string
  format: '16:9' | '21:9'
  /** L'eroe tiene il titolo a sinistra: la foto va specchiata. */
  mirror?: boolean
  alt: string
  subject: string
}

const SHOTS: Shot[] = [
  {
    nome: 'akm-eroe-sala',
    format: '16:9',
    mirror: true,
    alt: 'Un gruppo di adulti in maglietta nera durante una lezione di Krav Maga in una palestra comunale, la sera',
    subject:
      "Wide shot from the side of a small group of adults practising a partner drill, one instructor in the foreground correcting a grip. Composition deliberately weighted to one side: the people occupy one third of the frame, the rest is empty wall and floor.",
  },
  {
    nome: 'akm-banda-ingresso',
    format: '21:9',
    alt: 'La classe in cerchio a inizio lezione, l’istruttore al centro che parla',
    subject:
      'Wide panoramic frame: a class standing in a loose circle at the start of the session, listening to the instructor who stands with his back half turned to camera. Empty floor in the foreground.',
  },
  {
    nome: 'akm-banda-centri',
    format: '21:9',
    alt: 'Una classe schierata su due file che ripete la stessa guardia, vista frontalmente',
    subject:
      'Wide panoramic frame of the gym floor seen almost frontally, a class lined up in two rows practising the same guard position, shot from a low angle so the parquet fills the bottom third.',
  },
  {
    nome: 'akm-banda-corsi',
    format: '21:9',
    alt: 'Tre coppie di adulti che provano una difesa da pugno diretto, a meta’ movimento',
    subject:
      'Wide panoramic frame: three pairs of adults spread across the hall drilling a partner defence against a straight punch, mid movement, arms and forearms in contact. Even light across the whole frame.',
  },
  {
    nome: 'akm-banda-istruttori',
    format: '21:9',
    alt: 'Un istruttore mostra una leva a un allievo, gli altri guardano in semicerchio',
    subject:
      'Wide panoramic frame: one instructor in his fifties, grey hair, demonstrating a wrist lock on a younger student in the middle of the hall; five students stand watching in a loose semicircle to the left and right, seen from the side at eye level.',
  },
  {
    nome: 'akm-banda-eventi',
    format: '21:9',
    alt: 'Una sala piena per uno stage: l’istruttore in piedi che spiega, gli allievi seduti a terra in ascolto',
    subject:
      'Wide panoramic frame of a crowded seminar: about thirty adults of mixed ages sitting on the parquet in loose rows, seen from behind and slightly above, all facing one instructor standing at the far end of the hall mid explanation. Sports bags along the wall.',
  },
]

async function exists(file: string) {
  try {
    await access(file)
    return true
  } catch {
    return false
  }
}

async function generate(shot: Shot) {
  const destination = path.join(FOLDER, `${shot.nome}.jpg`)
  if (await exists(destination)) return destination

  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('Manca GEMINI_API_KEY: serve solo la prima volta, per generare.')

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: 'POST',
      headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${REGISTRY} ${shot.subject}` }] }],
        generationConfig: {
          responseModalities: ['IMAGE'],
          imageConfig: { aspectRatio: shot.format },
        },
      }),
    },
  )

  const body = await response.json()
  const part = body?.candidates?.[0]?.content?.parts?.find(
    (p: { inlineData?: unknown }) => p.inlineData,
  )
  if (!part) throw new Error(`Generazione fallita per ${shot.nome}: ${JSON.stringify(body).slice(0, 400)}`)

  /* 2400px di lato lungo: sopra la misura `hero` di Media (1600) con margine,
     sotto il peso di un PNG da due megabyte per immagine. */
  const image = sharp(Buffer.from(part.inlineData.data, 'base64'))
  await (shot.mirror ? image.flop() : image)
    .resize({ width: 2400 })
    .jpeg({ quality: 88 })
    .toFile(destination)

  return destination
}

const payload = await getPayload({ config })

await mkdir(FOLDER, { recursive: true })

const idByName = new Map<string, number>()

for (const shot of SHOTS) {
  const file = await generate(shot)
  const filename = `${shot.nome}.jpg`

  const already = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  })

  if (already.docs[0]) {
    idByName.set(shot.nome, already.docs[0].id)
    /* La didascalia si riscrive anche su un media gia' caricato: e' la
       dichiarazione che la foto e' generata, e le immagini caricate prima che
       il campo esistesse non ce l'hanno. */
    if (already.docs[0].didascalia !== CAPTION) {
      await payload.update({
        collection: 'media',
        id: already.docs[0].id,
        data: { didascalia: CAPTION },
      })
      console.log(`~ ${filename} gia' in Media, didascalia aggiornata`)
    } else {
      console.log(`= ${filename} gia' in Media`)
    }
    continue
  }

  const created = await payload.create({
    collection: 'media',
    data: { alt: shot.alt, didascalia: CAPTION },
    filePath: file,
  })
  idByName.set(shot.nome, created.id)
  console.log(`+ ${filename}`)
}

const id = (name: string) => idByName.get(name) ?? null

await payload.updateGlobal({
  slug: 'impostazioni',
  data: {
    immagineHero: id('akm-eroe-sala'),
    /* L'immagine di condivisione resta vuota di proposito: senza file il sito ne
       compone una da solo con il titolo e lo stemma, che dice piu' di una foto
       muta in una scheda di WhatsApp. Vedi opengraph-image.tsx. */
    ogImage: null,
    home: { immagineIngresso: id('akm-banda-ingresso') },
    fotoPagine: {
      centri: id('akm-banda-centri'),
      corsi: id('akm-banda-corsi'),
      istruttori: id('akm-banda-istruttori'),
      eventi: id('akm-banda-eventi'),
    },
  },
})
console.log('= Impostazioni aggiornate')

/* La foto della pagina contatti c'era gia' in libreria e non era assegnata a
   niente: e' l'unica vera del gruppo, un istruttore che corregge un allievo. */
const contacts = await payload.find({
  collection: 'media',
  where: { filename: { equals: 'akm-contatti.jpg' } },
  limit: 1,
  depth: 0,
})
if (contacts.docs[0]) {
  try {
    await payload.updateGlobal({
      slug: 'contatti',
      data: { immagineContatti: contacts.docs[0].id },
    })
    console.log('= Contatti: foto assegnata')
  } catch (error) {
    /* Il global Contatti ha `email` obbligatoria e finche' e' vuota nessuna
       scrittura passa, nemmeno questa che l'email non la tocca. Non e' un
       errore di questo script: e' un campo che il cliente non ha ancora
       compilato, e lo si dice invece di fermare tutto. */
    console.log(
      `! Contatti: foto non assegnata (${error instanceof Error ? error.message : error}).`,
    )
    console.log('  Compila Email in Impostazioni > Contatti dall\'admin e rilancia lo script.')
  }
}

process.exit(0)
