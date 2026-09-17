'use client'

import React, { useEffect, useRef, useState } from 'react'

/**
 * Il video di sfondo dell'eroe. Sta sopra la foto, che resta sotto come
 * copertina e come elemento principale del caricamento.
 *
 * Non parte, e non si scarica, se il visitatore ha chiesto meno animazioni o
 * risparmia dati: in quel caso resta la foto e il bottone lo avvia a richiesta.
 * Il bottone c'e' sempre, perche' un fondo che si muove per piu' di cinque
 * secondi deve potersi fermare (WCAG 2.2.2). Vedi docs/adr/0015.
 */
export function VideoEroe({ src }: { src: string }) {
  const video = useRef<HTMLVideoElement>(null)
  const [inCorso, setInCorso] = useState(false)
  // Una volta partito resta visibile anche fermo: la pausa tiene il fotogramma.
  const [avviato, setAvviato] = useState(false)

  useEffect(() => {
    const meno = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const risparmio = (navigator as { connection?: { saveData?: boolean } }).connection?.saveData
    if (meno || risparmio) return
    // Un autoplay rifiutato dal browser non e' un errore: resta la foto.
    video.current?.play().catch(() => {})
  }, [])

  return (
    <>
      <video
        ref={video}
        className="eroe__foto eroe__video"
        src={src}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        data-visibile={avviato || undefined}
        onPlaying={() => {
          setInCorso(true)
          setAvviato(true)
        }}
        onPause={() => setInCorso(false)}
      />
      <button
        type="button"
        className="bottone bottone--secondario eroe__pausa"
        onClick={() => {
          const v = video.current
          if (!v) return
          if (v.paused) v.play().catch(() => {})
          else v.pause()
        }}
      >
        {inCorso ? 'Ferma il video' : 'Avvia il video'}
      </button>
    </>
  )
}
