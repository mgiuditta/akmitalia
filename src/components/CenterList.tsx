'use client'

import { useSearchParams } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'

import type { Sedi } from '@/payload-types'
import { distanceKm, readableDistance, provinceName, type Coordinate } from './data'
import { CenterMap, type MapPoint } from './CenterMap'
import { CenterCard } from './CenterCard'

/**
 * L'elenco dei centri con il filtro per provincia, senza ricaricare la pagina.
 *
 * La URL resta la fonte di verita': `?provincia=MI` si condivide, il tasto
 * indietro funziona e il server rende gia' l'elenco filtrato per quella URL,
 * quindi l'idratazione combacia. Il click sul filtro scrive la URL con
 * pushState e Next la rilegge da useSearchParams: nessun giro al server,
 * nessun flash. I filtri restano link veri: cmd-click apre una scheda.
 *
 * ponytail: nessuno stato React per la scelta. I 200 centri al massimo sono
 * gia' qui, il filtro e' un `filter` in memoria.
 *
 * La posizione si chiede a un click e mai al caricamento (docs/adr/0010).
 * `?vicino=1` la chiede all'arrivo, ma solo perche' ci si arriva premendo il
 * bottone in home: e' lo stesso gesto, su due pagine. L'ordine alfabetico
 * resta il default e resta raggiungibile (docs/adr/0001).
 */

type LocationState = 'idle' | 'pending' | 'granted' | 'denied' | 'unavailable'

const KEY = 'akm:posizione'

const NOTICES: Partial<Record<LocationState, string>> = {
  'pending': 'Sto chiedendo la posizione al browser.',
  denied:
    'Il browser non ci ha dato la posizione. Puoi consentirla dalle impostazioni del sito, oppure scorrere l’elenco qui sotto: è in ordine alfabetico per comune.',
  unavailable:
    'La posizione non è disponibile su questo dispositivo. L’elenco qui sotto è in ordine alfabetico per comune.',
}

export function CenterList({ centers, provinces }: { centers: Sedi[]; provinces: string[] }) {
  const query = useSearchParams()
  const asked = query.get('provincia')
  const choice = asked && provinces.includes(asked) ? asked : null
  const fromButton = query.get('vicino') === '1'

  const [position, setPosition] = useState<Coordinate | null>(null)
  const [state, setState] = useState<LocationState>('idle')

  const askLocation = React.useCallback(() => {
    if (!('geolocation' in navigator)) {
      setState('unavailable')
      return
    }

    setState('pending')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const found = { lat: coords.latitude, lng: coords.longitude }
        setPosition(found)
        setState('granted')
        /* Solo per la sessione e solo in questo browser: non esce di qui, non
           arriva al server. E' scritto anche nella pagina privacy. */
        try {
          sessionStorage.setItem(KEY, JSON.stringify(found))
        } catch {
          // Navigazione privata o storage pieno: si riprova al prossimo click.
        }
      },
      (error) => setState(error.code === error.PERMISSION_DENIED ? 'denied' : 'unavailable'),
      { timeout: 10000, maximumAge: 5 * 60 * 1000 },
    )
  }, [])

  useEffect(() => {
    let saved: Coordinate | null = null
    try {
      const raw = sessionStorage.getItem(KEY)
      saved = raw ? (JSON.parse(raw) as Coordinate) : null
    } catch {
      saved = null
    }

    if (saved && typeof saved.lat === 'number' && typeof saved.lng === 'number') {
      setPosition(saved)
      setState('granted')
      return
    }

    if (fromButton) askLocation()
  }, [fromButton, askLocation])

  const filtered = useMemo(
    () => (choice ? centers.filter((c) => c.indirizzo?.provincia === choice) : centers),
    [centers, choice],
  )

  /* Con la posizione l'elenco si riordina per distanza; senza resta alfabetico
     per comune, che e' l'ordine che arriva dal server. I centri senza
     coordinate non spariscono: si accodano, come vuole docs/adr/0002. */
  const { visibili: visible, distanze: distances, vicino: near } = useMemo(() => {
    const coordinates = (c: Sedi) =>
      typeof c.coordinate?.lat === 'number' && typeof c.coordinate?.lng === 'number'
        ? { lat: c.coordinate.lat, lng: c.coordinate.lng }
        : null

    if (!position) return { visibili: filtered, distanze: new Map<number, number>(), vicino: null }

    const distances = new Map<number, number>()
    for (const center of filtered) {
      const point = coordinates(center)
      if (point) distances.set(center.id, distanceKm(position, point))
    }

    const visible = [...filtered].sort((a, b) => {
      const from = distances.get(a.id)
      const db = distances.get(b.id)
      if (from === undefined) return db === undefined ? 0 : 1
      if (db === undefined) return -1
      return from - db
    })

    return { visibili: visible, distanze: distances, vicino: distances.has(visible[0]?.id) ? visible[0].id : null }
  }, [filtered, position])

  const points = useMemo<MapPoint[]>(
    () =>
      visible
        .filter(
          (c) => typeof c.coordinate?.lat === 'number' && typeof c.coordinate?.lng === 'number',
        )
        .map((c) => {
          const km = distances.get(c.id)
          return {
            id: c.id,
            nome: c.nome,
            citta: c.indirizzo?.citta ?? '',
            slug: c.slug,
            lat: c.coordinate!.lat as number,
            lng: c.coordinate!.lng as number,
            distanza: km === undefined ? undefined : readableDistance(km),
          }
        }),
    [visible, distances],
  )

  function choose(e: React.MouseEvent<HTMLAnchorElement>, p: string | null) {
    // Modificatori o tasto centrale: il browser apre una scheda, come per ogni link.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    window.history.pushState(null, '', p ? `/centri?provincia=${encodeURIComponent(p)}` : '/centri')
  }

  const notice = NOTICES[state]

  return (
    <>
      <h2 className="display display--sm list-title" id="list-title">
        {position
          ? 'I centri più vicini a te'
          : choice
            ? `Centri in provincia di ${provinceName(choice)}`
            : 'Tutti i centri'}
      </h2>

      <div className="choices">
        {provinces.length > 1 ? (
          <nav className="filters" aria-label="Filtra per provincia">
            <a
              className={`filter${choice ? '' : ' filter--active'}`}
              href="/centri"
              aria-current={choice ? undefined : 'true'}
              onClick={(e) => choose(e, null)}
            >
              Tutte ({centers.length})
            </a>
            {provinces.map((p) => (
              <a
                key={p}
                className={`filter${choice === p ? ' filter--active' : ''}`}
                href={`/centri?provincia=${p}`}
                aria-current={choice === p ? 'true' : undefined}
                onClick={(e) => choose(e, p)}
              >
                {provinceName(p)} ({centers.filter((c) => c.indirizzo?.provincia === p).length})
              </a>
            ))}
          </nav>
        ) : null}

        {/* Il bottone e' secondario: la conversione e' la richiesta, non la
            posizione. Ordinare per distanza e' una vista, non un'azione. */}
        <p className="nearest">
          <button
            type="button"
            className="button button--secondary"
            onClick={askLocation}
            disabled={state === 'pending'}
          >
            {state === 'pending'
              ? 'Cerco la posizione'
              : position
                ? 'Aggiorna la posizione'
                : 'Trova il centro più vicino'}
          </button>
        </p>
      </div>

      {/* Gli stati si dicono a parole: il rosso e' gia' impegnato a dire «premi qui». */}
      <p className="detail nearest__notice" role="status" aria-live="polite">
        {notice ?? ''}
      </p>

      {visible.length > 0 ? (
        <div className="centers">
          {points.length > 0 ? (
            <div className="centers__map">
              <CenterMap
                points={points}
                near={near}
                etichetta="Mappa dei centri tecnici AKM Italia"
              />
              {/* Il singolare non era gestito, e la frase si rompeva proprio con il
                  dato di oggi: «1 centri non hanno ancora le coordinate». */}
              {points.length < visible.length ? (
                <p className="detail map__note">
                  {visible.length - points.length === 1
                    ? 'Un centro non ha ancora le coordinate: lo trovi'
                    : `${visible.length - points.length} centri non hanno ancora le coordinate: li trovi`}{' '}
                  qui sotto con indirizzo e orari.
                </p>
              ) : null}
            </div>
          ) : null}

          <ul className="centers__list" aria-live="polite">
            {visible.map((center) => {
              const km = distances.get(center.id)
              return (
                <CenterCard
                  key={center.id}
                  center={center}
                  distance={km === undefined ? null : readableDistance(km)}
                  nearest={center.id === near}
                />
              )
            })}
          </ul>
        </div>
      ) : (
        <p className="text empty">
          L’elenco dei centri attivi è in aggiornamento per la stagione. Scrivici e ti diciamo
          qual è il più vicino.
        </p>
      )}
    </>
  )
}
