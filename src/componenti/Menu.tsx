'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'

/**
 * La navigazione principale. Una sola <nav>, un solo comportamento a ogni
 * breakpoint: le voci stanno dietro il bottone e aprono un pannello. Cambia
 * solo la larghezza del pannello, tutto schermo su telefono e foglio da destra
 * sopra i 700px, ed e' una regola di CSS. Non esistono due elenchi di link,
 * quindi non esistono due landmark e nessuna voce e' letta due volte.
 *
 * Perche' un menu anche su desktop, dopo che DESIGN.md aveva scritto il
 * contrario e docs/adr/0006 lo aveva limitato al telefono: docs/adr/0007.
 *
 * ponytail: GSAP non e' importato in testa al file. Chi ha
 * prefers-reduced-motion e chi non apre mai il menu non lo scarica. Il primo
 * tap lo aspetta; se non e' ancora arrivato il menu si apre secco invece di
 * restare fermo. Un solo percorso di codice, nessun fallback CSS parallelo.
 *
 * Il fondo che entra e' uno stacco di valore, non di colore: grigio carta,
 * nero, carbone. La Regola del Valore vale anche in movimento. Si posa sul
 * carbone e non sul nero perche' sotto c'e' una pagina nera velata di nero:
 * il perche' per esteso sta in docs/adr/0007.
 */

type Gsap = typeof import('gsap').gsap

export type VoceMenu = {
  href: string
  testo: string
  /** Un dato vero sotto la voce: conteggi, non decorazione. Senza dato, niente riga. */
  dato?: string
  /** Solo per il dato vivo: il pallino verde porta sempre la parola scritta. */
  vivo?: boolean
}

const FERMO = '(prefers-reduced-motion: reduce)'
/* Sopra questa larghezza il pannello non esiste: le voci sono in riga nella
   barra (docs/adr/0008). Stesso valore del CSS. */
const LARGO = '(min-width: 1024px)'

function ordinale(n: number) {
  return String(n + 1).padStart(2, '0')
}

export function Menu({
  voci,
  cta,
}: {
  voci: VoceMenu[]
  cta: { href: string; testo: string }
}) {
  const [aperto, setAperto] = useState(false)
  const radice = useRef<HTMLElement>(null)
  const bottone = useRef<HTMLButtonElement>(null)
  const gsapRef = useRef<Gsap | null>(null)
  const contesto = useRef<ReturnType<Gsap['context']> | null>(null)
  const percorso = usePathname()

  /* Scaldato a vuoto: al primo tap GSAP e' gia' in cache. Chi ha chiesto meno
     movimento non lo scarica affatto, e per lui il menu resta istantaneo.
     Dal docs/adr/0007 lo scarica anche il desktop: e' il costo dichiarato. */
  useEffect(() => {
    if (window.matchMedia(FERMO).matches) return
    /* Sopra i 1024px il pannello non si apre mai: GSAP resterebbe un peso a vuoto. */
    if (window.matchMedia(LARGO).matches) return

    let annullato = false
    const scalda = () => {
      /* Non `import('gsap')`: quel barile si porta dietro ogni plugin.
         Il perche' del percorso preciso sta in src/tipi-gsap.d.ts. */
      void import('gsap/dist/gsap.min.js').then((m) => {
        if (!annullato) gsapRef.current = m.gsap
      })
    }

    /* requestIdleCallback non e' in Safari stabile, e questo sito lo aprono
       soprattutto da iPhone: senza ripiego il primo tap non animerebbe mai. */
    const ozioso = typeof window.requestIdleCallback === 'function'
    const id = ozioso
      ? window.requestIdleCallback(scalda, { timeout: 2000 })
      : window.setTimeout(scalda, 1200)

    return () => {
      annullato = true
      if (ozioso) window.cancelIdleCallback(id)
      else window.clearTimeout(id)
    }
  }, [])

  /* La coreografia. Torna false quando non c'e' nulla da animare: allora lo
     stato di apertura viene scritto secco e il contenuto e' subito completo. */
  const coreografia = useCallback((apre: boolean, alTermine?: () => void) => {
    const nodo = radice.current
    const gsap = gsapRef.current
    if (!nodo || !gsap) return false
    if (window.matchMedia(FERMO).matches) return false

    contesto.current?.revert()
    contesto.current = gsap.context(() => {
      const fondi = gsap.utils.toArray<HTMLElement>('.menu__fondo')
      const testi = gsap.utils.toArray<HTMLElement>('.menu__testo')
      const spalle = gsap.utils.toArray<HTMLElement>('.menu__ordinale, .menu__dato')
      const filetto = '.menu__filetto'

      const tl = gsap.timeline({ onComplete: alTermine })

      if (apre) {
        tl.fromTo(
          fondi,
          { xPercent: 101 },
          { xPercent: 0, duration: 0.58, stagger: 0.12, ease: 'expo.out' },
        )
          .fromTo(
            filetto,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.7, ease: 'expo.out' },
            '<',
          )
          .fromTo(
            testi,
            { yPercent: 120, rotate: 6 },
            { yPercent: 0, rotate: 0, duration: 0.7, stagger: 0.05, ease: 'expo.out' },
            '<+=0.35',
          )
          .fromTo(
            spalle,
            { autoAlpha: 0, yPercent: 45 },
            { autoAlpha: 1, yPercent: 0, duration: 0.5, stagger: 0.04, ease: 'expo.out' },
            '<+=0.12',
          )
      } else {
        /* L'uscita e' piu' corta dell'entrata: sotto la mano deve sembrare
           che il menu si tolga di mezzo, non che si congedi. */
        tl.to(spalle, { autoAlpha: 0, duration: 0.18, ease: 'power2.in' })
          .to(
            testi,
            { yPercent: -120, duration: 0.3, stagger: 0.03, ease: 'power2.in' },
            '<',
          )
          .to(filetto, { scaleX: 0, duration: 0.3, ease: 'power2.in' }, '<')
          .to(
            fondi,
            { xPercent: 101, duration: 0.42, stagger: 0.06, ease: 'expo.in' },
            '<+=0.1',
          )
      }
    }, nodo)

    return true
  }, [])

  /* Apertura e chiusura. L'attributo e' scritto a mano e non renderizzato da
     React: in chiusura deve cadere dopo l'animazione, non prima. */
  useEffect(() => {
    const nodo = radice.current
    if (!nodo) return

    nodo.inert = !aperto

    const fondale = [
      document.getElementById('contenuto'),
      document.getElementById('pie'),
      document.querySelector<HTMLElement>('.salta'),
    ]
    for (const el of fondale) if (el) el.inert = aperto
    document.documentElement.classList.toggle('menu-aperto', aperto)

    if (aperto) {
      nodo.dataset.menu = 'aperto'
      coreografia(true)
      /* Il resto della pagina e' inerte, quindi il pannello si comporta da
         finestra: il fuoco ci entra, altrimenti il primo Tab dopo l'apertura
         porterebbe fuori dal menu appena aperto. */
      nodo.querySelector('a')?.focus({ preventScroll: true })
      return
    }

    if (nodo.dataset.menu !== 'aperto') return

    const chiudi = () => {
      nodo.dataset.menu = 'chiuso'
    }
    if (!coreografia(false, chiudi)) chiudi()
  }, [aperto, coreografia])

  useEffect(() => {
    if (!aperto) return
    const tasto = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAperto(false)
        bottone.current?.focus()
      }
    }
    window.addEventListener('keydown', tasto)
    return () => window.removeEventListener('keydown', tasto)
  }, [aperto])

  /* Cambiata pagina, il menu non ha piu' niente da dire. */
  useEffect(() => {
    setAperto(false)
  }, [percorso])

  /* Aperto a 1000px e finestra allargata: il pannello sparisce col CSS ma il
     resto della pagina resterebbe `inert`. E' il listener che docs/adr/0007
     aveva tolto e che docs/adr/0008 rimette. */
  useEffect(() => {
    const largo = window.matchMedia(LARGO)
    const chiudi = (e: MediaQueryListEvent) => {
      if (e.matches) setAperto(false)
    }
    largo.addEventListener('change', chiudi)
    return () => largo.removeEventListener('change', chiudi)
  }, [])

  useEffect(() => {
    return () => {
      contesto.current?.revert()
      document.documentElement.classList.remove('menu-aperto')
    }
  }, [])

  return (
    <>
      {/* Il velo copre quel che il pannello non copre, cioe' solo sopra i
          700px. Non e' un secondo modo di chiudere: Escape e il bottone lo
          erano gia'. E' la conferma visiva che il resto della pagina e' fermo,
          e siccome quel resto e' `inert` il clic non lo raggiungerebbe
          comunque. Fuori dall'albero di accessibilita' per non aggiungere un
          bersaglio grande quanto lo schermo. */}
      <div
        className="menu__velo"
        data-menu={aperto ? 'aperto' : 'chiuso'}
        aria-hidden="true"
        onClick={() => {
          setAperto(false)
          bottone.current?.focus()
        }}
      />

      <nav
        ref={radice}
        id="menu-principale"
        className="menu"
        aria-label="Principale"
        data-menu="chiuso"
      >
        <span className="menu__filetto" aria-hidden="true" />

        <div className="menu__fondi" aria-hidden="true">
          <div className="menu__fondo menu__fondo--carta" />
          <div className="menu__fondo menu__fondo--nero" />
          <div className="menu__fondo menu__fondo--carbone" />
        </div>

        {/* Toccare la voce della pagina in cui si e' gia' non cambia il
            pathname: senza questo il pannello resterebbe aperto sul nulla. */}
        <ul className="menu__elenco" onClick={() => setAperto(false)}>
          {voci.map((voce, i) => (
            <li className="menu__voce" key={voce.href}>
              <span className="menu__ordinale" aria-hidden="true">
                {ordinale(i)}
              </span>
              <Link className="menu__link" href={voce.href}>
                <span className="menu__maschera">
                  <span className="menu__testo">{voce.testo}</span>
                </span>
              </Link>
              {voce.dato ? (
                <span className={voce.vivo ? 'menu__dato stato' : 'menu__dato'}>
                  {voce.dato}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>

      <Link className="bottone bottone--primario barra__cta" href={cta.href}>
        {cta.testo}
      </Link>

      <button
        ref={bottone}
        type="button"
        className="menu__bottone"
        aria-expanded={aperto}
        aria-controls="menu-principale"
        onClick={() => setAperto((v) => !v)}
      >
        <span className="menu__etichetta">
          <span className="menu__etichetta-riga" data-stato="chiuso">
            Menu
          </span>
          <span className="menu__etichetta-riga" data-stato="aperto" aria-hidden="true">
            Chiudi
          </span>
        </span>
        <span className="menu__icona" aria-hidden="true">
          <span className="menu__barretta" />
          <span className="menu__barretta" />
        </span>
      </button>

    </>
  )
}
