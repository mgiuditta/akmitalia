import { redirect } from 'next/navigation'

// La homepage e' uno sforzo separato (fuori scopo della mappa #1). Finche' non
// esiste, la radice manda dove il sito e' vero: l'elenco dei centri.
export default function HomePage() {
  redirect('/centri')
}
