/**
 * `/corsi` non e' un indice, e non lo diventa (#29): il bivio della home lo e'
 * gia', e un secondo elenco degli stessi corsi sarebbe le tre card identiche
 * di PRODUCT.md. Ma un padre che fa 404 mentre le figlie (`/corsi/[slug]`)
 * vivono e' un difetto che qualcuno segnala: qui il padre porta al bivio.
 *
 * Temporaneo per scelta (307, non 308): il giorno che i corsi diventassero
 * dieci, l'indice esiste e il redirect si toglie senza dover disfare la cache
 * di un browser.
 */
import { redirect } from 'next/navigation'

export default function Corsi() {
  redirect('/#bivio')
}
