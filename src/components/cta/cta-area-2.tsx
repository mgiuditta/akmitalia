import Link from "next/link";

export default function CtaAreaTwo() {
  return (
    <section className="cta-area-2">
      <div className="cta-area-2-inner">
        <div className="section-header">
          <div className="section-title-wrapper">
            <div className="title-wrapper fade-anim">
              <h2 className="section-title font-sequelsans-romanbody">
                <Link href="/contact">Let’s work together
                <span className="line"></span>
                Let’s work
                together <span className="line"></span> Let’s work together <span className="line"></span> Let’s work
                together <span className="line"></span> Let’s work together</Link></h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
