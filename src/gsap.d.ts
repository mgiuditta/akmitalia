/**
 * `gsap` esporta un barile ESM che riesporta ScrollTrigger, SplitText,
 * MotionPath e ogni altro plugin: un import dinamico non li puo' scuotere via
 * e il chunk misura 70 kB gz. `dist/gsap.min.js` e' la build gia' pronta di
 * motore piu' CSSPlugin, che e' tutto quello che serve qui, e ne misura 28.
 * Il pacchetto non mappa i tipi su quel percorso: si prendono dal barile.
 */
declare module 'gsap/dist/gsap.min.js' {
  export const gsap: typeof import('gsap').gsap
}
