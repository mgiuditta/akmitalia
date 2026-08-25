import Link from "next/link";


export default function CtaAreaThree() {
  return (
    <section className="cta-area-3">
      <div className="container large">
        <div className="cta-area-3-inner section-spacing-top">
          <div className="section-header fade-anim">
            <div className="section-title-wrapper">
              <div className="title-wrapper">
                <h2 className="section-title font-sequelsans-romanbody rr_title_anim">Let’s start a
                  great work right
                  now {" "}
                  <span className="mb-14">
                    <Link href="/contact" className="rr-btn-group">
                      <span className="b">Get in touch</span>
                      <span className="c"><i className="fa-solid fa-arrow-right"></i></span>
                    </Link>
                  </span>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
