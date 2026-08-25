import Link from "next/link";


export default function AboutOne() {
  return (
    <section className="about-area">
      <div className="container large">
        <div className="about-area-inner section-spacing">
          <div className="section-content">
            <div className="shape-1"></div>
            <div className="shape-2"></div>
            <div className="shape-3"></div>
            <div className="shape-4"></div>
            <div className="section-title-wrapper">
              <div className="title-wrapper">
                <h2 className="section-title font-instrumentsans-medium">Chi siamo</h2>
              </div>
            </div>
            <div className="text-wrapper">
              <p className="text">AKM Italia è un&apos;accademia di Krav Maga con oltre 20 centri tecnici in Lombardia.
                Formiamo istruttori e insegniamo autodifesa a bambini, adulti, donne, aziende e forze dell&apos;ordine,
                con un metodo serio e disciplinato, non spettacolare.</p>
            </div>
            <div className="btn-wrapper ">
              <Link href="/about" className="rr-btn  btn-text-fli hover-bg-theme">
                <span className="btn-wrap">
                  <span className="text-one">Chi siamo</span>
                  <span className="text-two">Chi siamo</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
