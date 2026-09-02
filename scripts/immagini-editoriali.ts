/**
 * Le fotografie editoriali del sito: le genera se mancano, le carica in Media e
 * le assegna agli slot che le usano.
 *
 *   GEMINI_API_KEY=... pnpm immagini:editoriali
 *
 * AKM non ha un archivio fotografico utilizzabile: le immagini del vecchio sito
 * sono compresse, a colori e con i volti riconoscibili di persone che non hanno
 * firmato nulla. Finche' il cliente non fa un servizio in sala, queste sono
 * fotografie generate, e il fatto che siano generate sta scritto qui e nel testo
 * alternativo di ciascuna, non nascosto.
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

const CARTELLA = path.resolve(process.cwd(), 'data/immagini')
const MODELLO = process.env.NANOBANANA_MODEL || 'gemini-2.5-flash-image'

/* Il registro visivo, uguale per tutte: e' il trattamento di DESIGN.md portato
   in fotografia. Nessun colore, nessuna posa, nessuna vignettatura finta. */
const REGISTRO =
  'Documentary black and white reportage photograph, grainy 35mm film look, high contrast, deep blacks, cold fluorescent light, plain Italian municipal gymnasium with wooden parquet, wall bars and crash mats. People in plain black t-shirts and dark trousers. Natural and unposed. Full-frame edge to edge exposure with no vignette, no dark border, no rounded corners. No colour, no logos, no text, no watermark.'

type Scatto = {
  /** Il nome del file in data/immagini e in Media. */
  nome: string
  formato: '16:9' | '21:9'
  /** L'eroe tiene il titolo a sinistra: la foto va specchiata. */
  specchia?: boolean
  alt: string
  soggetto: string
}

const SCATTI: Scatto[] = [
  {
    nome: 'akm-eroe-sala',
    formato: '16:9',
    specchia: true,
    alt: 'Un gruppo di adulti in maglietta nera durante una lezione di Krav Maga in una palestra comunale, la sera',
    soggetto:
      "Wide shot from the side of a small group of adults practising a partner drill, one instructor in the foreground correcting a grip. Composition deliberately weighted to one side: the people occupy one third of the frame, the rest is empty wall and floor.",
  },
  {
    nome: 'akm-banda-ingresso',
    formato: '21:9',
    alt: 'La classe in cerchio a inizio lezione, l’istruttore al centro che parla',
    soggetto:
      'Wide panoramic frame: a class standing in a loose circle at the start of the session, listening to the instructor who stands with his back half turned to camera. Empty floor in the foreground.',
  },
  {
    nome: 'akm-banda-centri',
    formato: '21:9',
    alt: 'Una classe schierata su due file che ripete la stessa guardia, vista frontalmente',
    soggetto:
      'Wide panoramic frame of the gym floor seen almost frontally, a class lined up in two rows practising the same guard position, shot from a low angle so the parquet fills the bottom third.',
  },
  {
    nome: 'akm-banda-corsi',
    formato: '21:9',
    alt: 'Tre coppie di adulti che provano una difesa da pugno diretto, a meta’ movimento',
    soggetto:
      'Wide panoramic frame: three pairs of adults spread across the hall drilling a partner defence against a straight punch, mid movement, arms and forearms in contact. Even light across the whole frame.',
  },
  {
    nome: 'akm-banda-istruttori',
    formato: '21:9',
    alt: 'Un istruttore mostra una leva a un allievo, gli altri guardano in semicerchio',
    soggetto:
      'Wide panoramic frame: one instructor in his fifties, grey hair, demonstrating a wrist lock on a younger student in the middle of the hall; five students stand watching in a loose semicircle to the left and right, seen from the side at eye level.',
  },
  {
    nome: 'akm-banda-eventi',
    formato: '21:9',
    alt: 'Una sala piena per uno stage: l’istruttore in piedi che spiega, gli allievi seduti a terra in ascolto',
    soggetto:
      'Wide panoramic frame of a crowded seminar: about thirty adults of mixed ages sitting on the parquet in loose rows, seen from behind and slightly above, all facing one instructor standing at the far end of the hall mid explanation. Sports bags along the wall.',
  },
]

async function esiste(file: string) {
  try {
    await access(file)
    return true
  } catch {
    return false
  }
}

async function genera(scatto: Scatto) {
  const destinazione = path.join(CARTELLA, `${scatto.nome}.jpg`)
  if (await esiste(destinazione)) return destinazione

  const chiave = process.env.GEMINI_API_KEY
  if (!chiave) throw new Error('Manca GEMINI_API_KEY: serve solo la prima volta, per generare.')

  const risposta = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODELLO}:generateContent`,
    {
      method: 'POST',
      headers: { 'x-goog-api-key': chiave, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${REGISTRO} ${scatto.soggetto}` }] }],
        generationConfig: {
          responseModalities: ['IMAGE'],
          imageConfig: { aspectRatio: scatto.formato },
        },
      }),
    },
  )

  const corpo = await risposta.json()
  const parte = corpo?.candidates?.[0]?.content?.parts?.find(
    (p: { inlineData?: unknown }) => p.inlineData,
  )
  if (!parte) throw new Error(`Generazione fallita per ${scatto.nome}: ${JSON.stringify(corpo).slice(0, 400)}`)

  /* 2400px di lato lungo: sopra la misura `hero` di Media (1600) con margine,
     sotto il peso di un PNG da due megabyte per immagine. */
  const immagine = sharp(Buffer.from(parte.inlineData.data, 'base64'))
  await (scatto.specchia ? immagine.flop() : immagine)
    .resize({ width: 2400 })
    .jpeg({ quality: 88 })
    .toFile(destinazione)

  return destinazione
}

const payload = await getPayload({ config })

await mkdir(CARTELLA, { recursive: true })

const idPerNome = new Map<string, number>()

for (const scatto of SCATTI) {
  const file = await genera(scatto)
  const filename = `${scatto.nome}.jpg`

  const gia = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  })

  if (gia.docs[0]) {
    idPerNome.set(scatto.nome, gia.docs[0].id)
    console.log(`= ${filename} gia' in Media`)
    continue
  }

  const creato = await payload.create({
    collection: 'media',
    data: { alt: scatto.alt },
    filePath: file,
  })
  idPerNome.set(scatto.nome, creato.id)
  console.log(`+ ${filename}`)
}

const id = (nome: string) => idPerNome.get(nome) ?? null

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
const contatti = await payload.find({
  collection: 'media',
  where: { filename: { equals: 'akm-contatti.jpg' } },
  limit: 1,
  depth: 0,
})
if (contatti.docs[0]) {
  try {
    await payload.updateGlobal({
      slug: 'contatti',
      data: { immagineContatti: contatti.docs[0].id },
    })
    console.log('= Contatti: foto assegnata')
  } catch (errore) {
    /* Il global Contatti ha `email` obbligatoria e finche' e' vuota nessuna
       scrittura passa, nemmeno questa che l'email non la tocca. Non e' un
       errore di questo script: e' un campo che il cliente non ha ancora
       compilato, e lo si dice invece di fermare tutto. */
    console.log(
      `! Contatti: foto non assegnata (${errore instanceof Error ? errore.message : errore}).`,
    )
    console.log('  Compila Email in Impostazioni > Contatti dall\'admin e rilancia lo script.')
  }
}

process.exit(0)
