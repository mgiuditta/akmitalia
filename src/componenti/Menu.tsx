'use client'

import Link, { useLinkStatus } from 'next/link'
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

/* La CTA porta a una rotta sola: quando ci siamo gia', il bottone deve dire
   un'altra cosa. Il confronto normalizza lo slash finale, che il global puo'
   avere e il pathname no. */
const senzaCoda = (p: string) => p.replace(/\/$/, '') || '/'

/*
 * Il riscontro al tocco. Le rotte dinamiche - la scheda di un centro, quella di
 * un evento - si rendono a richiesta: chi tocca una voce restava a guardare la
 * pagina vecchia, ferma, senza sapere se il tocco fosse arrivato.
 *
 * Una parola scritta e non uno spinner: il repertorio del movimento e' chiuso e
 * un cerchio che gira e' un loop, che non ci sta dentro. `useLinkStatus` da' lo
 * stato vero del <Link> che la contiene, non un finto avanzamento a tempo.
 *
 * Perche' qui e non in un `loading.tsx` di rotta, che sarebbe la via di serie:
 * un confine di Suspense sopra le pagine fa partire lo streaming della
 * risposta, e una risposta gia' iniziata non puo' piu' cambiare stato HTTP -
 * ogni URL inesistente uscirebbe 200 invece di 404. Il 404 vero vale piu' di
 * uno scheletro grigio, e c'e' un test che lo tiene fermo.
 */
function Attesa() {
  const { pending } = useLinkStatus()
  if (!pending) return null
  return <span className="menu__wait">Apro…</span>
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
  const suPagina = senzaCoda(percorso ?? '') === senzaCoda(cta.href)

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
      const fondi = gsap.utils.toArray<HTMLElement>('.menu__backdrop')
      const testi = gsap.utils.toArray<HTMLElement>('.menu__text')
      const spalle = gsap.utils.toArray<HTMLElement>('.menu__ordinal, .menu__detail')
      const filetto = '.menu__rule'

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
          /* Solo la traslazione: la rotazione di 6 gradi che i titoli avevano
             non si spiegava in una frase - non e' gerarchia, non e' sequenza,
             non e' riscontro a un gesto - e la Regola dell'Indice non la fa
             entrare. Quello che resta scandisce l'apertura: le voci arrivano
             una dopo l'altra da sotto la propria maschera. */
          .fromTo(
            testi,
            { yPercent: 120 },
            { yPercent: 0, duration: 0.7, stagger: 0.05, ease: 'expo.out' },
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
      document.querySelector<HTMLElement>('.skip'),
    ]
    for (const el of fondale) if (el) el.inert = aperto
    document.documentElement.classList.toggle('menu-open', aperto)

    if (aperto) {
      nodo.dataset.menu = 'open'
      coreografia(true)
      /* Il resto della pagina e' inerte, quindi il pannello si comporta da
         finestra: il fuoco ci entra, altrimenti il primo Tab dopo l'apertura
         porterebbe fuori dal menu appena aperto. */
      nodo.querySelector('a')?.focus({ preventScroll: true })
      return
    }

    if (nodo.dataset.menu !== 'open') return

    const chiudi = () => {
      nodo.dataset.menu = 'closed'
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
      document.documentElement.classList.remove('menu-open')
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
        className="menu__scrim"
        data-menu={aperto ? 'open' : 'closed'}
        aria-hidden="true"
        onClick={() => {
          setAperto(false)
          bottone.current?.focus()
        }}
      />

      <nav
        ref={radice}
        id="main-menu"
        className="menu"
        aria-label="Principale"
        data-menu="closed"
      >
        <span className="menu__rule" aria-hidden="true" />

        <div className="menu__backdrops" aria-hidden="true">
          <div className="menu__backdrop menu__backdrop--paper" />
          <div className="menu__backdrop menu__backdrop--black" />
          <div className="menu__backdrop menu__backdrop--charcoal" />
        </div>

        {/* Toccare la voce della pagina in cui si e' gia' non cambia il
            pathname: senza questo il pannello resterebbe aperto sul nulla. */}
        <ul className="menu__list" onClick={() => setAperto(false)}>
          {voci.map((voce, i) => (
            <li className="menu__item" key={voce.href}>
              <span className="menu__ordinal" aria-hidden="true">
                {ordinale(i)}
              </span>
              <Link className="menu__link" href={voce.href}>
                <span className="menu__mask">
                  <span className="menu__text">{voce.testo}</span>
                </span>
                <Attesa />
              </Link>
              {voce.dato ? (
                <span className={voce.vivo ? 'menu__detail status' : 'menu__detail'}>
                  {voce.dato}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>

      {/* Sulla pagina che la CTA indica, «Richiedi informazioni» ripeteva parola
          per parola l'H1 sotto e portava dove si era gia'. Non si nasconde -
          docs/adr/0008 dice che la CTA resta a ogni larghezza - ma cambia
          destinazione e parola: porta al modulo, che e' l'unica cosa che su
          quella pagina resta da fare. */}
      <Link
        className="button button--primary header__cta"
        href={suPagina ? '#modulo' : cta.href}
      >
        {suPagina ? 'Vai al modulo' : cta.testo}
      </Link>

      <button
        ref={bottone}
        type="button"
        className="menu__button"
        aria-expanded={aperto}
        aria-controls="main-menu"
        onClick={() => setAperto((v) => !v)}
      >
        <span className="menu__label">
          <span className="menu__label-row" data-state="closed">
            Menu
          </span>
          <span className="menu__label-row" data-state="open" aria-hidden="true">
            Chiudi
          </span>
        </span>
        <span className="menu__icon" aria-hidden="true">
          <span className="menu__bar" />
          <span className="menu__bar" />
        </span>
      </button>

    </>
  )
}
