'use client'

import Link from 'next/link'
import React, { useCallback, useMemo, useState, useSyncExternalStore } from 'react'

import { distanceKm, readableDistance, type Coordinate } from './data'
import { NetworkMap } from './NetworkMap'
import type { SignCenter } from './signage'

/**
 * Prototipo C, «La segnaletica» (#66): la prima domanda della home, «dove
 * sei?», con la sua risposta. Lo schema della rete a destra, i cartelli dei
 * centri sotto, e in mezzo un solo gesto: «Usa la mia posizione».
 *
 * La posizione si chiede al click e mai al caricamento (docs/adr/0010). Qui la
 * home non rimanda a /centri?vicino=1: la domanda e la risposta stanno nella
 * stessa pagina. E' uno scarto dal testo dell'ADR, non dal suo principio, ed
 * e' scritto nel NOTE.md del prototipo. La posizione resta nel browser, nella
 * stessa chiave di sessione che usa /centri, e non arriva al server.
 *
 * Senza posizione l'ordine e' alfabetico per comune (docs/adr/0001); con la
 * posizione e' per distanza, e i centri senza coordinate si accodano invece
 * di sparire (docs/adr/0002).
 */

/* La sessionStorage non avvisa nessuno quando cambia nella stessa scheda:
   basta leggerla, e la si rilegge a ogni render. */
const subscribeNothing = () => () => {}

function readSaved() {
  try {
    return sessionStorage.getItem(KEY)
  } catch {
    // Navigazione privata: si resta sull'ordine alfabetico.
    return null
  }
}

function parseCoordinate(raw: string | null): Coordinate | null {
  if (!raw) return null
  try {
    const value = JSON.parse(raw) as Coordinate
    return typeof value?.lat === 'number' && typeof value?.lng === 'number' ? value : null
  } catch {
    return null
  }
}

type LocationState = 'idle' | 'pending' | 'granted' | 'denied' | 'unavailable'

const KEY = 'akm:posizione'

const NOTICES: Partial<Record<LocationState, string>> = {
  pending: 'Sto chiedendo la posizione al browser.',
  denied:
    'Il browser non ci ha dato la posizione. Puoi consentirla dalle impostazioni del sito, oppure cercare il tuo comune nei cartelli qui sotto: sono in ordine alfabetico.',
  unavailable:
    'La posizione non è disponibile su questo dispositivo. I cartelli qui sotto sono in ordine alfabetico per comune.',
}

export function CenterNetwork({
  centers,
  children,
}: {
  centers: SignCenter[]
  /** L'intestazione dell'eroe, resa dal server: titolo e riga del global Impostazioni. */
  children: React.ReactNode
}) {
  // Rileggere la posizione data in questa sessione non e' chiederla: il
  // permesso l'ha gia' dato un click, qui o su /centri. Sul server e al primo
  // render non c'e', quindi l'idratazione combacia.
  const saved = useSyncExternalStore(subscribeNothing, readSaved, () => null)
  const stored = useMemo(() => parseCoordinate(saved), [saved])
  const [asked, setAsked] = useState<Coordinate | null>(null)
  const [state, setState] = useState<LocationState>('idle')
  const position = asked ?? stored

  const ask = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setState('unavailable')
      return
    }
    setState('pending')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const found = { lat: coords.latitude, lng: coords.longitude }
        setAsked(found)
        setState('granted')
        try {
          sessionStorage.setItem(KEY, JSON.stringify(found))
        } catch {
          // Si riprova al prossimo click.
        }
      },
      (error) => setState(error.code === error.PERMISSION_DENIED ? 'denied' : 'unavailable'),
      { timeout: 10000, maximumAge: 5 * 60 * 1000 },
    )
  }, [])

  const { ordered, distances, nearest } = useMemo(() => {
    if (!position) return { ordered: centers, distances: {} as Record<number, string>, nearest: null }
    const km = new Map<number, number>()
    for (const c of centers) {
      if (typeof c.lat === 'number' && typeof c.lng === 'number') {
        km.set(c.id, distanceKm(position, { lat: c.lat, lng: c.lng }))
      }
    }
    const ordered = [...centers].sort((a, b) => {
      const da = km.get(a.id)
      const db = km.get(b.id)
      if (da === undefined) return db === undefined ? 0 : 1
      if (db === undefined) return -1
      return da - db
    })
    const distances: Record<number, string> = {}
    for (const [id, d] of km) distances[id] = readableDistance(d)
    return { ordered, distances, nearest: km.has(ordered[0]?.id) ? ordered[0].id : null }
  }, [centers, position])

  const nearestCenter = ordered.find((c) => c.id === nearest) ?? null
  const unmapped = centers.filter((c) => typeof c.lat !== 'number' || typeof c.lng !== 'number')

  return (
    <>
      <div className="container where">
        <div className="where__ask">
          {children}

          <div className="where__step">
            <p className="where__question">
              <span className="where__index" aria-hidden="true">
                1
              </span>
              <span className="display display--sm">Dove sei?</span>
            </p>

            {nearestCenter ? (
              <Link className="where__nearest" href={`/centri/${nearestCenter.slug}`}>
                <span className="status">Il più vicino a te · {distances[nearestCenter.id]}</span>
                <span className="display display--md where__nearest-name">
                  {nearestCenter.sign}
                </span>
                <span className="where__nearest-host">{nearestCenter.host ?? nearestCenter.city}</span>
                <span className="arrow" aria-hidden="true" />
              </Link>
            ) : null}

            <p className="where__actions">
              <button
                type="button"
                className="button button--secondary where__locate"
                onClick={ask}
                disabled={state === 'pending'}
              >
                {state === 'pending'
                  ? 'Cerco la posizione'
                  : position
                    ? 'Aggiorna la posizione'
                    : 'Usa la mia posizione'}
              </button>
              <a className="breadcrumb" href="#cartelli">
                Oppure cerca il tuo comune
              </a>
            </p>
            <p className="detail where__notice" role="status" aria-live="polite">
              {NOTICES[state] ?? ''}
            </p>
            <p className="detail where__privacy">
              La posizione resta nel tuo browser: serve a ordinare i centri, non ci viene inviata.
            </p>
          </div>
        </div>

        <div className="where__map">
          <NetworkMap
            centers={ordered}
            label="Schema dei centri tecnici AKM Italia"
            nearest={nearest}
            distances={distances}
            me={position}
          />
          {unmapped.length > 0 ? (
            <p className="detail where__unmapped">
              Non ancora sullo schema: {unmapped.map((c) => c.sign).join(', ')}. È nei cartelli qui
              sotto, con indirizzo e orari.
            </p>
          ) : null}
        </div>
      </div>

      <div className="container">
        <h2 className="board__title" id="cartelli">
          {position ? 'Dal più vicino al più lontano' : 'I centri, in ordine alfabetico'}
        </h2>
        <ol className="board" aria-labelledby="cartelli">
          {ordered.map((center) => (
            <Sign
              key={center.id}
              center={center}
              distance={distances[center.id] ?? null}
              nearest={center.id === nearest}
            />
          ))}
        </ol>
      </div>
    </>
  )
}

/**
 * Il cartello di un centro: il nome del posto grande, sopra, come alla
 * stazione; la linea delle zone che serve; sotto, su un pannello chiaro,
 * quello che si legge da vicino: indirizzo e orari.
 */
export function Sign({
  center,
  distance = null,
  nearest = false,
}: {
  center: SignCenter
  distance?: string | null
  nearest?: boolean
}) {
  return (
    <li className={`sign${nearest ? ' sign--nearest' : ''}`}>
      <Link className="sign__head" href={`/centri/${center.slug}`}>
        {center.province ? (
          <span className="sign__province" aria-label={`Provincia ${center.province}`}>
            {center.province}
          </span>
        ) : null}
        <span className="sign__names">
          <span className="display sign__town">{center.sign}</span>
          {center.host ? <span className="sign__host">{center.host}</span> : null}
        </span>
        <span className="arrow" aria-hidden="true" />
      </Link>

      {nearest || distance ? (
        <p className="sign__distance">
          {nearest ? <span className="status">Il più vicino a te</span> : null}
          {distance ? <span>a {distance} da te, in linea d’aria</span> : null}
        </p>
      ) : null}

      {center.zones.length > 0 ? <Stops zones={center.zones} /> : null}

      <div className="sign__table">
        <p className="sign__address">{center.address}</p>
        {center.slots.length > 0 ? (
          <ul className="sign__slots">
            {center.slots.map((slot) => (
              <li key={slot.id}>
                <span className="sign__day">{slot.days}</span>
                <span className="sign__time">{slot.time}</span>
                {slot.course ? <span className="sign__course">{slot.course}</span> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="detail">Orari in aggiornamento per la stagione.</p>
        )}
      </div>
    </li>
  )
}

/** Le zone servite come le fermate di una linea: una riga bianca, un quadrato per fermata. */
export function Stops({ zones, label = 'Serve anche' }: { zones: string[]; label?: string }) {
  return (
    <div className="stops">
      <p className="stops__label">{label}</p>
      <ol className="stops__line">
        {zones.map((zone) => (
          <li key={zone} className="stops__stop">
            {zone}
          </li>
        ))}
      </ol>
    </div>
  )
}
