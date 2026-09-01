/**
 * L'anatomia di una pagina (#28): il vocabolario che ogni pagina usa invece di
 * inventarsi la propria apertura. Estratto dalle tre pagine che esistevano
 * gia' — home, elenco centri, pagina corso — e provato su `/prototipo-anatomia`
 * contro `/privacy` e `/istruttori`, che sono il caso magro.
 *
 * Una pagina dichiara un attributo solo, il suo **peso**, e da li' scendono
 * larghezza e livello del titolo. Il corpus aveva gia' tre pesi senza saperlo:
 * 1040px con il Display (la home), 78ch con l'Headline (i centri), 100ch con
 * il Display e una spalla (il corso).
 */
import React from 'react'
import stile from './anatomia.module.css'

/** Portale = la radice. Documento = si legge. Scheda = si consulta, ha una spalla. */
export type Peso = 'portale' | 'documento' | 'scheda'

export const Pagina = ({
  peso,
  children,
  ...resto
}: { peso: Peso; children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => (
  <div {...resto} className={`${stile.pagina} ${stile[peso]} ${resto.className ?? ''}`}>
    {children}
  </div>
)

export const Apertura = ({
  occhiello,
  titolo,
  sommario,
  fatti,
  children,
}: {
  occhiello?: string
  titolo: string
  sommario?: string
  /** La riga di numeri sotto il sommario. Cifre tabulari, mai sotto il Dato. */
  fatti?: string
  /** Le azioni: al massimo una piena, il resto in Grafite. */
  children?: React.ReactNode
}) => (
  <header className={stile.apertura}>
    {occhiello ? <p className={stile.occhiello}>{occhiello}</p> : null}
    <h1 className={stile.titolo}>{titolo}</h1>
    {sommario ? <p className={stile.sommario}>{sommario}</p> : null}
    {fatti ? <p className={stile.fatti}>{fatti}</p> : null}
    {children ? <p className={stile.azioni}>{children}</p> : null}
  </header>
)

/**
 * Una sezione **senza righe non esiste**: il prototipo di #28 l'ha trovato
 * sull'antibullismo, che ha `adattoA` e `focus` vuoti (#16) e stampava un
 * titolo con il nulla sotto. La regola sta qui e non nella pagina, perche' una
 * pagina prima o poi se la dimentica.
 */
export function Sezione({
  titolo,
  righe,
  children,
}: {
  titolo: string
  righe?: (string | null | undefined)[]
  children?: React.ReactNode
}) {
  const piene = righe?.filter(Boolean) as string[] | undefined
  if (righe && !piene?.length) return null
  return (
    <section>
      <h2 className={stile.sezione}>{titolo}</h2>
      {piene ? (
        <ul className={stile.righe}>
          {piene.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      ) : (
        children
      )}
    </section>
  )
}

/** Il testo in coda, in Grafite: la nota che non e' una sezione. */
export const Coda = ({ children }: { children: React.ReactNode }) => (
  <p className={stile.coda}>{children}</p>
)

export const Azione = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a className={stile.azione} href={href}>
    {children}
  </a>
)
