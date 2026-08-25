// Numeri placeholder — da validare col cliente prima del lancio (docs/contenuti.md)
export default function FunFactArea() {
  return (
    <section className="funfact-area fade-anim">
      <div className="container large">
        <div className="funfact-area-inner pin-area">
          <div className="section-header section-spacing-top pin-element">
            <div className="section-title-wrapper">
              <div className="title-wrapper">
                <h2 className="section-title font-instrumentsans-medium word-anim">AKM <br />
                  —in numeri</h2>
              </div>
            </div>
          </div>
          <div className="funfact-wrapper-box section-spacing">
            <span className="line-1"></span>
            <span className="line-2"></span>
            <span className="line-3"></span>
            <span className="line-4"></span>
            <div className="funfact-wrapper">
              <div className="funfact-item go-visible">
                <span className="number">20+</span>
                <p className="text">Centri tecnici attivi in Lombardia.</p>
              </div>
              <div className="funfact-item go-visible">
                <span className="number">30+</span>
                <p className="text">Anni di attività dell&apos;accademia.</p>
              </div>
              <div className="funfact-item go-visible">
                <span className="number">7</span>
                <p className="text">Discipline: Krav Maga, Kick Boxing, Full Contact e altro.</p>
              </div>
              <div className="funfact-item go-visible">
                <span className="number">4</span>
                <p className="text">Province coperte in Lombardia.</p>
              </div>
              <div className="funfact-item go-visible">
                <span className="number">1000+</span>
                <p className="text">Allievi formati nel corso degli anni.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
