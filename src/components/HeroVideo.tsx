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
export function HeroVideo({ src }: { src: string }) {
  const video = useRef<HTMLVideoElement>(null)
  const [inProgress, setInProgress] = useState(false)
  // Una volta partito resta visibile anche fermo: la pausa tiene il fotogramma.
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const minus = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dataSaver = (navigator as { connection?: { saveData?: boolean } }).connection?.saveData
    if (minus || dataSaver) return
    // Un autoplay rifiutato dal browser non e' un errore: resta la foto.
    video.current?.play().catch(() => {})
  }, [])

  return (
    <>
      <video
        ref={video}
        className="hero__photo hero__video"
        src={src}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        data-visible={started || undefined}
        onPlaying={() => {
          setInProgress(true)
          setStarted(true)
        }}
        onPause={() => setInProgress(false)}
      />
      <button
        type="button"
        className="button button--secondary hero__pause"
        onClick={() => {
          const v = video.current
          if (!v) return
          if (v.paused) v.play().catch(() => {})
          else v.pause()
        }}
      >
        {inProgress ? 'Ferma il video' : 'Avvia il video'}
      </button>
    </>
  )
}
