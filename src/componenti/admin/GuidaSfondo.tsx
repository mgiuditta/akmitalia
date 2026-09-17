import React from 'react'

import { MB_MASSIMI_VIDEO } from '@/collections/Media'

/**
 * La guida allo sfondo della home, dentro l'admin, sopra i due campi che
 * riguarda. Chi la legge e' il cliente o il suo videomaker, non uno sviluppatore:
 * dice cosa caricare e perche', e tiene pronti da copiare il brief, il comando
 * di esportazione e il prompt per un generatore.
 *
 * ponytail: nessun bottone «copia». `user-select: all` seleziona il blocco
 * intero al primo click, e il resto lo fa Cmd+C.
 */

const BRIEF = `Clip per lo sfondo della homepage di AKM Italia.
Serve il girato pulito, non lo spot: niente loghi, scritte, bande, sigle, tendine o transizioni grafiche.
Minimo 1920x1080 (meglio 4K, lo riduciamo noi), 25 fotogrammi al secondo, 10-15 secondi, senza audio.
Da una a tre inquadrature lunghe, camera ferma o carrello lentissimo. Niente tagli rapidi, niente camera a mano, niente lampi di luce.
Il soggetto (due istruttori che eseguono una tecnica controllata, il gruppo sfocato dietro) sta nel terzo destro dell'inquadratura: la meta sinistra e la fascia in basso restano calme, perche' li' va il titolo.
Il sito lo mostra in bianco e nero sotto un velo scuro: conta il contrasto di luce, non il colore.
Primo e ultimo fotogramma simili, cosi' il loop non si vede.`

const FFMPEG = `ffmpeg -i master.mov -t 15 -vf "scale=1920:-2,fps=25" -an \\
  -c:v libx264 -profile:v high -preset slow -crf 24 -pix_fmt yuv420p \\
  -movflags +faststart hero.mp4

# la foto di copertina e' il primo fotogramma: quando il video parte non c'e' salto
ffmpeg -i hero.mp4 -frames:v 1 -q:v 2 hero-copertina.jpg`

const PROMPT = `Cinematic slow-motion footage, locked-off camera with a very slow dolly-in, inside a large indoor sports hall with a wooden floor and blue padded walls. Two instructors in plain black t-shirts and black trousers practise a controlled Krav Maga defence drill: forearm block and step off the line. Grounded, realistic, not choreographed. Subjects on the right third of the frame; left half and lower third calm and uncluttered, negative space for a headline. Even overhead gym lighting, strong light-dark contrast, shallow depth of field, a group of students softly blurred in the background. 16:9, 1920x1080, 24fps, 12 seconds, seamless loop, first and last frame match.

Negative: text, logos, watermarks, captions, graphics, lens flares, flashing lights, fast cuts, handheld shake, slow-motion blur artifacts, extra limbs.`

const blocco: React.CSSProperties = {
  margin: 'calc(var(--base) / 2) 0 0',
  padding: 'calc(var(--base) * 0.75)',
  background: 'var(--theme-elevation-50)',
  border: '1px solid var(--theme-elevation-150)',
  whiteSpace: 'pre-wrap',
  fontSize: '13px',
  lineHeight: 1.5,
  userSelect: 'all',
}

const voce: React.CSSProperties = { marginTop: 'calc(var(--base) / 2)' }
const riassunto: React.CSSProperties = { cursor: 'pointer', fontWeight: 600 }

export function GuidaSfondo() {
  return (
    <div style={{ marginBottom: 'var(--base)', maxWidth: '72ch', lineHeight: 1.5 }}>
      <p style={{ margin: 0 }}>
        Puoi mettere <strong>una foto, un video o entrambi</strong>. Con entrambi parte il video e
        la foto fa da copertina: si vede mentre il video si carica, e resta l&apos;unica cosa
        visibile a chi ha ridotto le animazioni sul proprio dispositivo o risparmia dati. Foto e video vengono mostrati in bianco e nero,
        sotto un velo scuro che tiene leggibile il titolo.
      </p>

      <ul style={{ margin: 'calc(var(--base) / 2) 0 0', paddingLeft: '1.2em' }}>
        <li>
          <strong>Foto:</strong> orizzontale, almeno 1920x1080, soggetto a destra.
        </li>
        <li>
          <strong>Video:</strong> MP4, 1920x1080, 10-15 secondi, senza audio, al massimo{' '}
          {MB_MASSIMI_VIDEO} MB (meglio sotto 8). Niente scritte, loghi, bande o sigle: il titolo
          del sito ci va sopra. Inquadrature lunghe e lente, niente lampi.
        </li>
        <li>
          Uno spot gia montato con grafica sopra <strong>non va bene</strong>: serve il girato
          pulito.
        </li>
      </ul>

      <details style={voce}>
        <summary style={riassunto}>Brief da mandare al videomaker</summary>
        <pre style={blocco}>{BRIEF}</pre>
      </details>

      <details style={voce}>
        <summary style={riassunto}>Esportare il file giusto (ffmpeg)</summary>
        <pre style={blocco}>{FFMPEG}</pre>
      </details>

      <details style={voce}>
        <summary style={riassunto}>Prompt per un generatore video (Veo, Kling, Runway)</summary>
        <p style={{ margin: 'calc(var(--base) / 2) 0 0' }}>
          Le persone generate non sono istruttori AKM: usalo come segnaposto finche non arriva il
          girato vero.
        </p>
        <pre style={blocco}>{PROMPT}</pre>
      </details>
    </div>
  )
}
