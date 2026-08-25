import Image from "next/image";
import shape_1 from "@/assets/imgs/shape/shape-10.webp";
import shape_2 from "@/assets/imgs/shape/shape-11.webp";
import gallery_img from "@/assets/imgs/gallery/image-10.webp";
import Link from "next/link";

export default function HeroThree() {
  return (
    <section className="hero-area-3">
      <div className="container large">
        <div className="hero-area-3-inner">
          <div className="section-header">
            <div className="section-title-wrapper">
              <div className="subtitle-wrapper">
                <span className="section-subtitle">
                  Award winning marketing agency — 1994®
                </span>
              </div>
              <div className="title-wrapper">
                <h1
                  className="section-title font-sequelsans-romanbody fade-anim"
                  data-delay="0.45"
                >
                  Ai—driven marketing
                  <Image
                    className="title-shape-1"
                    src={shape_1}
                    alt="image"
                  />
                  agency, based in {" "}
                  <span
                    className="text-underline hover-image-wrpper"
                    data-label="activewear"
                  >
                    Jordan{" "}
                    <Image
                      className="image-hover"
                      src={gallery_img}
                      alt="activewear"
                      data-image="activewear"
                      style={{ height: "auto" }}
                    />{" "}
                  </span>
                  <Image
                    className="title-shape-2"
                    src={shape_2}
                    alt="image"
                  />
                </h1>
              </div>
            </div>
          </div>
          <div className="section-content">
            <ul className="social-links fade-anim" data-delay="0.60">
              <li>
                <a href="#">Facebook</a>
              </li>
              <li>
                <a href="#">Dribbble</a>
              </li>
              <li>
                <a href="#">Behance</a>
              </li>
              <li>
                <a href="#">Twitter</a>
              </li>
              <li>
                <a href="#">Linkedin</a>
              </li>
            </ul>
            <div className="content-middle fade-anim" data-delay="0.75">
              <p className="text info-text">
                From 1994-2025 <br /> we’re growing fast
              </p>
            </div>
            <div className="content-last fade-anim" data-delay="0.90">
              <div className="text-wrapper">
                <p className="text about-text rr_title_anim">
                  We help brands and company in marketing solution. As a
                  cause-led digital marketing and brand agency, we harness the
                  power of technology and creativity to drive positive feedback.
                </p>
              </div>
              <div className="btn-wrapper">
                <Link href="/contact" className="rr-btn-group">
                  <span className="b">Get started</span>
                  <span className="c">
                    <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
