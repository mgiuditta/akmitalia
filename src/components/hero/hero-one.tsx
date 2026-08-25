import Link from 'next/link'

// Stat numbers (centri/anni) are placeholders — da validare col cliente prima del lancio (docs/contenuti.md)
export default function HeroOne() {
  return (
    <section className="hero-area">
      <div className="container large">
        <div className="hero-area-inner section-spacing-top">
          <div className="hero-content section-spacing-bottom">
            {/* Spacer: preserva la 1a colonna (130px) della grid a 3 colonne del tema
                — occupata in origine dal badge decorativo rimosso (non pertinente ad AKM) */}
            <div aria-hidden="true" />
            <div className="section-header">
              <div className="section-title-wrapper">
                <div className="title-wrapper">
                  <h2
                    className="section-title font-instrumentsans-medium char-anim"
                    data-delay="0.45"
                  >
                    Krav Maga e autodifesa, con disciplina
                  </h2>
                </div>
              </div>
            </div>
            <div className="section-content">
              <div className="features-wrapper-box fade-anim" data-delay="0.75">
                <div className="features-wrapper">
                  <div className="feature-box">
                    <div className="content">
                      <span className="number">20+</span>
                      <p className="text">
                        Centri tecnici attivi in Lombardia
                      </p>
                    </div>
                  </div>
                  <div className="feature-box">
                    <div className="content">
                      <span className="number">30+</span>
                      <p className="text">
                        Anni di attività dell&apos;accademia
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-wrapper fade-anim" data-delay="0.75">
                <p className="text">
                  Corsi di Krav Maga e autodifesa per bambini, adulti, donne, aziende
                  e forze dell&apos;ordine. Trova il centro più vicino e il corso giusto per te.
                </p>
              </div>
              <div className="btn-wrapper fade-anim" data-delay="0.9">
                <Link href="/contact" className="rr-btn btn-text-fli hover-bg-theme">
                  <span className="btn-wrap">
                    <span className="text-one">Trova il tuo centro</span>
                    <span className="text-two">Trova il tuo centro</span>
                  </span>
                </Link>
                <Link href="/about" className="rr-btn btn-border hover-bg-theme">
                  <span className="btn-wrap">
                    <span className="text-one">Scopri i corsi</span>
                    <span className="text-two">Scopri i corsi</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
          <div className="big-text-wrapper">
            <h2 className="big-text">AKM ITALIA</h2>
          </div>
        </div>
      </div>
    </section>
  )
}
