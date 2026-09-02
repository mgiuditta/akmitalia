import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { ImageResponse } from 'next/og'
import sharp from 'sharp'

import { pubblicato } from '@/componenti/dati'
import { apriPayload } from '@/componenti/payload'

/**
 * L'immagine di condivisione del sito. Sta qui e non in `generateMetadata`
 * perche' cosi' vale per ogni rotta: una scheda di centro condivisa su WhatsApp
 * portava un rettangolo grigio, visto che l'openGraph del layout veniva
 * sostituito per intero da quello della pagina figlia.
 *
 * Se in Impostazioni c'e' un'immagine caricata, e' quella: il cliente decide.
 * Altrimenti la si compone qui, sul sistema del sito - nero, Anton, filetto -
 * cosi' il rettangolo grigio non capita comunque mai.
 *
 * ponytail: nessuna variante per pagina. Un'immagine sola, cache-friendly, e
 * il titolo della scheda lo scrive gia' il social accanto all'anteprima.
 */

export const alt = 'AKM Italia, Krav Maga e difesa personale'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export const revalidate = 3600

/* Le istanze statiche e non il file variabile del sito: satori non sa leggere
   la tabella `fvar` e si ferma. Le scarica `pnpm font:scarica`. */
const anton = await readFile(path.join(process.cwd(), 'public/font/Anton-Regular.ttf'))
const roboto = await readFile(path.join(process.cwd(), 'public/font/Roboto-Regular.ttf'))
const robotoBold = await readFile(path.join(process.cwd(), 'public/font/Roboto-Bold.ttf'))

const cartellaMedia = process.env.MEDIA_DIR || path.resolve(process.cwd(), 'media')

export default async function Immagine() {
  const payload = await apriPayload()

  const [impostazioni, centri] = await Promise.all([
    payload.findGlobal({ slug: 'impostazioni', depth: 1 }),
    payload.count({
      collection: 'sedi',
      where: { and: [{ attivo: { equals: true } }, pubblicato] },
    }),
  ])

  /* L'immagine caricata dall'admin vince, e si legge dal disco: al build non
     c'e' un server da interrogare per il proprio stesso file. */
  const caricata = typeof impostazioni?.ogImage === 'object' ? impostazioni.ogImage : null
  if (caricata?.filename) {
    try {
      const file = await readFile(path.join(cartellaMedia, caricata.filename))
      return new Response(new Uint8Array(file), {
        headers: { 'Content-Type': caricata.mimeType || 'image/jpeg' },
      })
    } catch {
      // File sparito dal volume: si compone quella di serie invece di rompere.
    }
  }

  const stemma = typeof impostazioni?.logo === 'object' ? impostazioni.logo : null
  let stemmaDati: string | null = null
  if (stemma?.filename) {
    try {
      /* Il file passa da sharp anche quando e' gia' un PNG: il compositore di
         ImageResponse decodifica PNG e JPEG e basta, e in libreria lo stemma
         puo' essere un webp. Ricodificarlo costa poco e non fallisce. */
      const png = await sharp(await readFile(path.join(cartellaMedia, stemma.filename)))
        .resize(440)
        .png()
        .toBuffer()
      stemmaDati = `data:image/png;base64,${png.toString('base64')}`
    } catch {
      stemmaDati = null
    }
  }

  const quanti = centri.totalDocs

  const composta = new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#000000',
          color: '#ffffff',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '72px 80px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 720 }}>
            <div
              style={{
                fontFamily: 'Roboto',
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: 1,
                color: '#e8e8e8',
              }}
            >
              KRAV MAGA · MILANO E LOMBARDIA
            </div>
            <div
              style={{
                fontFamily: 'Anton',
                fontSize: 128,
                lineHeight: 1,
                textTransform: 'uppercase',
                paddingTop: 28,
              }}
            >
              Difendersi si impara
            </div>
            <div
              style={{
                fontFamily: 'Roboto',
                fontSize: 30,
                paddingTop: 32,
                color: '#e8e8e8',
              }}
            >
              {quanti > 0
                ? `${quanti} centri tecnici attivi, istruttori con nome e cognome.`
                : 'Centri tecnici, orari veri, istruttori con nome e cognome.'}
            </div>
          </div>

          {stemmaDati ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={stemmaDati} alt="" width={220} height={220} />
          ) : null}
        </div>

        {/* Il filetto chiude l'immagine come chiude la barra: e' una firma. */}
        <div style={{ display: 'flex', height: 12 }}>
          <div style={{ flex: 1, background: '#00973f' }} />
          <div style={{ flex: 1, background: '#ffffff' }} />
          <div style={{ flex: 1, background: '#e30917' }} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Anton', data: anton, style: 'normal', weight: 400 },
        { name: 'Roboto', data: roboto, style: 'normal', weight: 400 },
        { name: 'Roboto', data: robotoBold, style: 'normal', weight: 700 },
      ],
    },
  )

  /* Il risultato si legge tutto prima di rispondere. ImageResponse restituisce
     uno stream che compone mentre scorre, e un errore dentro la composizione
     arrivava a Next come «failed to pipe response», senza dire cosa fosse
     rotto. Un PNG da 1200x630 sta in memoria senza problemi. */
  return new Response(await composta.arrayBuffer(), {
    headers: { 'Content-Type': contentType },
  })
}
