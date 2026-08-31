// PROTOTIPO USA E GETTA — issue #7. I tre insiemi di valori in prova.
// Ogni interlinea e' un multiplo intero del modulo da 4px (vincolo del corpus, #2).
//   node 'src/app/(frontend)/prototipo-scala/scala.mjs'

export const VARIANTI = {
  a: {
    nome: 'Corpus',
    strategia:
      'I valori che il corpus ha misurato, presi cosi come stanno: GOV.UK per la scala, SBB per l interlinea dei dati, Unigrid per il rapporto 2:1 attorno ai titoli di gruppo. E la variante da battere, non quella da preferire: se una delle altre due legge meglio sui 18 centri veri, il corpus ha misurato registri di carta e noi facciamo una pagina.',
    scala: {
      display: [56, 60, '-0.015em', 900],
      headline: [36, 40, '-0.01em', 700],
      title: [22, 28, '0', 500],
      body: [18, 30, '0', 400],
      dato: [16, 28, '0', 400],
      meta: [14, 20, '0', 400],
      label: [12, 16, '0.03em', 500],
    },
    ritmo: { voce: 20, gruppoSopra: 40, gruppoSotto: 20, blocco: 12 },
  },
  b: {
    nome: 'Annuario',
    strategia:
      'La logica di Bell Centennial: dentro la voce cambia il peso, non il corpo. I corpi si stringono attorno al dato, l interlinea si accorcia dove non c e prosa, e in una schermata ci stanno quasi il doppio dei centri. Il rischio e la pagina fitta che DESIGN.md chiama sito federale anni 2000.',
    scala: {
      display: [44, 48, '-0.02em', 900],
      headline: [28, 32, '-0.01em', 700],
      title: [19, 24, '0', 500],
      body: [17, 28, '0', 400],
      dato: [16, 24, '0', 400],
      meta: [14, 20, '0', 400],
      label: [12, 16, '0.04em', 500],
    },
    ritmo: { voce: 14, gruppoSopra: 32, gruppoSotto: 16, blocco: 8 },
  },
  c: {
    nome: 'Segnaletica',
    strategia:
      'Il dato letto a distanza di braccio, non a distanza di lettura: corpi piu grandi, interlinee piu larghe, meno voci per schermata. E la variante che tratta l elenco come un cartello e non come un annuario. Il rischio e opposto: diciotto centri diventano tre schermate di scroll, e la densita che L Albo promette sparisce.',
    scala: {
      display: [64, 68, '-0.02em', 900],
      headline: [40, 44, '-0.01em', 700],
      title: [24, 32, '0', 500],
      body: [19, 32, '0', 400],
      dato: [18, 30, '0', 400],
      meta: [15, 24, '0', 400],
      label: [13, 16, '0.03em', 500],
    },
    ritmo: { voce: 28, gruppoSopra: 56, gruppoSotto: 28, blocco: 16 },
  },
}

const LIVELLI = ['display', 'headline', 'title', 'body', 'dato', 'meta', 'label']

/** I token della variante come blocco :root, da iniettare nella pagina. */
export function cssDi(chiave) {
  const { scala, ritmo } = VARIANTI[chiave]
  const righe = [
    ...LIVELLI.flatMap((l) => {
      const [corpo, interlinea, tracking, peso] = scala[l]
      return [
        `  --${l}-corpo: ${corpo}px;`,
        `  --${l}-interlinea: ${interlinea}px;`,
        `  --${l}-tracking: ${tracking};`,
        `  --${l}-peso: ${peso};`,
      ]
    }),
    `  --voce-padding: ${ritmo.voce}px;`,
    `  --gruppo-sopra: ${ritmo.gruppoSopra}px;`,
    `  --gruppo-sotto: ${ritmo.gruppoSotto}px;`,
    `  --blocco: ${ritmo.blocco}px;`,
  ]
  return `:root {\n${righe.join('\n')}\n}`
}

/** I controlli secchi del corpus che si possono verificare sui numeri soli. */
export function verifiche(chiave) {
  const { scala, ritmo } = VARIANTI[chiave]
  const modulo = (n) => n % 4 === 0
  return [
    {
      prova: 'Salto Display → Headline ≥ 1.25',
      valore: (scala.display[0] / scala.headline[0]).toFixed(2),
      passa: scala.display[0] / scala.headline[0] >= 1.25,
    },
    {
      prova: 'Dato nudo ≥ 16px (Regola del Dato Nudo)',
      valore: `${scala.dato[0]}px`,
      passa: scala.dato[0] >= 16,
    },
    {
      prova: 'Meta ≥ 14px, Label ≥ 12px',
      valore: `${scala.meta[0]}px / ${scala.label[0]}px`,
      passa: scala.meta[0] >= 14 && scala.label[0] >= 12,
    },
    {
      prova: 'Interlinea dei dati > interlinea dei titoli (SBB)',
      valore: `${(scala.dato[1] / scala.dato[0]).toFixed(2)} vs ${(scala.title[1] / scala.title[0]).toFixed(2)}`,
      passa: scala.dato[1] / scala.dato[0] > scala.title[1] / scala.title[0],
    },
    {
      prova: 'Ogni interlinea è multiplo del modulo da 4px',
      valore: LIVELLI.map((l) => scala[l][1]).join(' '),
      passa: LIVELLI.every((l) => modulo(scala[l][1])),
    },
    {
      prova: 'Rapporto 2:1 sopra e sotto il titolo di gruppo (Unigrid)',
      valore: `${ritmo.gruppoSopra} / ${ritmo.gruppoSotto}`,
      passa: ritmo.gruppoSopra === ritmo.gruppoSotto * 2,
    },
    {
      prova: 'Corpi distinti in pagina ≤ 7 (test 7 del corpus)',
      valore: String(new Set(LIVELLI.map((l) => scala[l][0])).size),
      passa: new Set(LIVELLI.map((l) => scala[l][0])).size <= 7,
    },
  ]
}

if (process.argv[1]?.endsWith('scala.mjs')) {
  for (const k of Object.keys(VARIANTI)) {
    console.log(`\n=== ${k.toUpperCase()} ${VARIANTI[k].nome}`)
    for (const v of verifiche(k)) {
      console.log(`${v.passa ? 'ok  ' : 'NO  '}${String(v.valore).padStart(14)}  ${v.prova}`)
    }
  }
}
