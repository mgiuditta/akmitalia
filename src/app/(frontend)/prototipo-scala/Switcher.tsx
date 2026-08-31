'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

/** Barra flottante del prototipo: cicla `?variant=`, con le frecce o da tastiera. */
export function Switcher({ varianti, corrente }: { varianti: [string, string][]; corrente: string }) {
  const router = useRouter()
  const params = useSearchParams()
  const i = Math.max(
    0,
    varianti.findIndex(([k]) => k === corrente),
  )

  const vai = (passo: number) => {
    const p = new URLSearchParams(params)
    p.set('variant', varianti[(i + passo + varianti.length) % varianti.length][0])
    router.replace(`?${p}`, { scroll: false })
  }

  useEffect(() => {
    const suTasto = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t?.closest('input, textarea, [contenteditable]')) return
      if (e.key === 'ArrowLeft') vai(-1)
      if (e.key === 'ArrowRight') vai(1)
    }
    window.addEventListener('keydown', suTasto)
    return () => window.removeEventListener('keydown', suTasto)
  })

  if (process.env.NODE_ENV === 'production') return null

  return (
    <div className="switcher">
      <button onClick={() => vai(-1)} aria-label="Famiglia precedente">
        ←
      </button>
      <span>
        {varianti[i][0].toUpperCase()} · {varianti[i][1]}
      </span>
      <button onClick={() => vai(1)} aria-label="Famiglia successiva">
        →
      </button>
    </div>
  )
}
