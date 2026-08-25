import Image from "next/image"
import shape from "@/assets/imgs/shape/shape-12.webp"
import gallery_img from "@/assets/imgs/gallery/image-17.webp"
import Link from "next/link"

export default function FunFactAreaTwo() {
  return (
    <section className="funfact-area-2">
      <div className="funfact-area-2-inner section-spacing-top">
        <div className="container large">
          <div className="section-header fade-anim">
            <div className="section-title-wrapper">
              <div className="title-wrapper">
                <h2 className="section-title font-sequelsans-romanbody rr_title_anim">
                  Yes! we take some smart decisions for brands{" "}
                  <span className="mb-14">
                    <Link href="/contact" className="rr-btn-group btn-whte">
                      <span className="b">Get started</span>
                      <span className="c">
                        <i className="fa-solid fa-arrow-right"></i>
                      </span>
                    </Link>
                  </span>
                </h2>
              </div>
            </div>
          </div>
          <div className="section-content">
            <div className="text-wrapper fade-anim">
              <p className="text">
                We help brands and company in marketing solution. As a cause-led digital marketing
                and brand agency, we harness the power of technology and creativity to drive positive feedback.
              </p>
            </div>
            <div className="info-text fade-anim" data-direction="right">
              <span className="year">1475</span>
              <div className="about-info">
                <Image src={shape} alt="image" />
                <p className="text">
                  Projects successfully completed from last 25 years.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="thumb fade-anim">
          <Image src={gallery_img} alt="image" style={{ height: "auto" }} />
        </div>
      </div>
    </section>
  )
}
