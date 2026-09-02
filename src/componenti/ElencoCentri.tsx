'use client'

import { useSearchParams } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'

import type { Sedi } from '@/payload-types'
import { distanzaKm, distanzaLeggibile, provinciaEstesa, type Coordinate } from './dati'
import { Mappa, type PuntoMappa } from './Mappa'
import { SchedaCentro } from './SchedaCentro'

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

type StatoPosizione = 'riposo' | 'in-corso' | 'ottenuta' | 'negata' | 'assente'

const CHIAVE = 'akm:posizione'

const AVVISI: Partial<Record<StatoPosizione, string>> = {
  'in-corso': 'Sto chiedendo la posizione al browser.',
  negata:
    'Il browser non ci ha dato la posizione. Puoi consentirla dalle impostazioni del sito, oppure scorrere l’elenco qui sotto: è in ordine alfabetico per comune.',
  assente:
    'La posizione non è disponibile su questo dispositivo. L’elenco qui sotto è in ordine alfabetico per comune.',
}

export function ElencoCentri({ centri, province }: { centri: Sedi[]; province: string[] }) {
  const parametri = useSearchParams()
  const chiesta = parametri.get('provincia')
  const scelta = chiesta && province.includes(chiesta) ? chiesta : null
  const arrivaDalBottone = parametri.get('vicino') === '1'

  const [posizione, setPosizione] = useState<Coordinate | null>(null)
  const [stato, setStato] = useState<StatoPosizione>('riposo')

  const chiediPosizione = React.useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStato('assente')
      return
    }

    setStato('in-corso')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const trovata = { lat: coords.latitude, lng: coords.longitude }
        setPosizione(trovata)
        setStato('ottenuta')
        /* Solo per la sessione e solo in questo browser: non esce di qui, non
           arriva al server. E' scritto anche nella pagina privacy. */
        try {
          sessionStorage.setItem(CHIAVE, JSON.stringify(trovata))
        } catch {
          // Navigazione privata o storage pieno: si riprova al prossimo click.
        }
      },
      (errore) => setStato(errore.code === errore.PERMISSION_DENIED ? 'negata' : 'assente'),
      { timeout: 10000, maximumAge: 5 * 60 * 1000 },
    )
  }, [])

  useEffect(() => {
    let salvata: Coordinate | null = null
    try {
      const grezza = sessionStorage.getItem(CHIAVE)
      salvata = grezza ? (JSON.parse(grezza) as Coordinate) : null
    } catch {
      salvata = null
    }

    if (salvata && typeof salvata.lat === 'number' && typeof salvata.lng === 'number') {
      setPosizione(salvata)
      setStato('ottenuta')
      return
    }

    if (arrivaDalBottone) chiediPosizione()
  }, [arrivaDalBottone, chiediPosizione])

  const filtrati = useMemo(
    () => (scelta ? centri.filter((c) => c.indirizzo?.provincia === scelta) : centri),
    [centri, scelta],
  )

  /* Con la posizione l'elenco si riordina per distanza; senza resta alfabetico
     per comune, che e' l'ordine che arriva dal server. I centri senza
     coordinate non spariscono: si accodano, come vuole docs/adr/0002. */
  const { visibili, distanze, vicino } = useMemo(() => {
    const coordinate = (c: Sedi) =>
      typeof c.coordinate?.lat === 'number' && typeof c.coordinate?.lng === 'number'
        ? { lat: c.coordinate.lat, lng: c.coordinate.lng }
        : null

    if (!posizione) return { visibili: filtrati, distanze: new Map<number, number>(), vicino: null }

    const distanze = new Map<number, number>()
    for (const centro of filtrati) {
      const punto = coordinate(centro)
      if (punto) distanze.set(centro.id, distanzaKm(posizione, punto))
    }

    const visibili = [...filtrati].sort((a, b) => {
      const da = distanze.get(a.id)
      const db = distanze.get(b.id)
      if (da === undefined) return db === undefined ? 0 : 1
      if (db === undefined) return -1
      return da - db
    })

    return { visibili, distanze, vicino: distanze.has(visibili[0]?.id) ? visibili[0].id : null }
  }, [filtrati, posizione])

  const punti = useMemo<PuntoMappa[]>(
    () =>
      visibili
        .filter(
          (c) => typeof c.coordinate?.lat === 'number' && typeof c.coordinate?.lng === 'number',
        )
        .map((c) => {
          const km = distanze.get(c.id)
          return {
            id: c.id,
            nome: c.nome,
            citta: c.indirizzo?.citta ?? '',
            slug: c.slug,
            lat: c.coordinate!.lat as number,
            lng: c.coordinate!.lng as number,
            distanza: km === undefined ? undefined : distanzaLeggibile(km),
          }
        }),
    [visibili, distanze],
  )

  function scegli(e: React.MouseEvent<HTMLAnchorElement>, p: string | null) {
    // Modificatori o tasto centrale: il browser apre una scheda, come per ogni link.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    window.history.pushState(null, '', p ? `/centri?provincia=${encodeURIComponent(p)}` : '/centri')
  }

  const avviso = AVVISI[stato]

  return (
    <>
      <h2 className="display display--sm titolo-elenco" id="titolo-elenco">
        {posizione
          ? 'I centri più vicini a te'
          : scelta
            ? `Centri in provincia di ${provinciaEstesa(scelta)}`
            : 'Tutti i centri'}
      </h2>

      <div className="scelte">
        {province.length > 1 ? (
          <nav className="filtri" aria-label="Filtra per provincia">
            <a
              className={`filtro${scelta ? '' : ' filtro--attivo'}`}
              href="/centri"
              aria-current={scelta ? undefined : 'true'}
              onClick={(e) => scegli(e, null)}
            >
              Tutte ({centri.length})
            </a>
            {province.map((p) => (
              <a
                key={p}
                className={`filtro${scelta === p ? ' filtro--attivo' : ''}`}
                href={`/centri?provincia=${p}`}
                aria-current={scelta === p ? 'true' : undefined}
                onClick={(e) => scegli(e, p)}
              >
                {provinciaEstesa(p)} ({centri.filter((c) => c.indirizzo?.provincia === p).length})
              </a>
            ))}
          </nav>
        ) : null}

        {/* Il bottone e' secondario: la conversione e' la richiesta, non la
            posizione. Ordinare per distanza e' una vista, non un'azione. */}
        <p className="vicino">
          <button
            type="button"
            className="bottone bottone--secondario"
            onClick={chiediPosizione}
            disabled={stato === 'in-corso'}
          >
            {stato === 'in-corso'
              ? 'Cerco la posizione'
              : posizione
                ? 'Aggiorna la posizione'
                : 'Trova il centro più vicino'}
          </button>
        </p>
      </div>

      {/* Gli stati si dicono a parole: il rosso e' gia' impegnato a dire «premi qui». */}
      <p className="dato vicino__avviso" role="status" aria-live="polite">
        {avviso ?? ''}
      </p>

      {visibili.length > 0 ? (
        <div className="centri">
          {punti.length > 0 ? (
            <div className="centri__mappa">
              <Mappa
                punti={punti}
                vicino={vicino}
                etichetta="Mappa dei centri tecnici AKM Italia"
              />
              {punti.length < visibili.length ? (
                <p className="dato mappa__nota">
                  {visibili.length - punti.length} centri non hanno ancora le coordinate: li
                  trovi qui sotto con indirizzo e orari.
                </p>
              ) : null}
            </div>
          ) : null}

          <ul className="centri__elenco" aria-live="polite">
            {visibili.map((centro) => {
              const km = distanze.get(centro.id)
              return (
                <SchedaCentro
                  key={centro.id}
                  centro={centro}
                  distanza={km === undefined ? null : distanzaLeggibile(km)}
                  piuVicino={centro.id === vicino}
                />
              )
            })}
          </ul>
        </div>
      ) : (
        <p className="testo vuoto">
          L’elenco dei centri attivi è in aggiornamento per la stagione. Scrivici e ti diciamo
          qual è il più vicino.
        </p>
      )}
    </>
  )
}
