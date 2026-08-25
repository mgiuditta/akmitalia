import Image from "next/image";
import gallery_img from "@/assets/imgs/gallery/image-23.webp";
import Link from "next/link";

export default function MediaAboutArea() {
  return (
    <section className="media-area-page-about">
      <div className="container large">
        <div className="media-area-page-about-inner">
          <div className="section-content-wrapper fade-anim">
            <div className="area-thumb parallax-view">
              <Image
                src={gallery_img}
                alt="image"
                data-speed="0.8"
                style={{ height: "auto" }}
              />
            </div>
            <div className="section-content">
              <div className="section-title-wrapper">
                <div className="title-wrapper">
                  <h2 className="section-title font-sequelsans-romanbody">
                    Collaborate with a super down-to-earth, mad-talented team
                  </h2>
                </div>
              </div>
              <div className="text-wrapper">
                <p className="text">
                  A collective bunch working on incredible projects and building
                  enduring partnerships that extend well beyond the deliverable.
                </p>
              </div>
              <div className="btn-wrapper">
                <Link href="/contact" className="rr-btn">
                  <span className="btn-wrap">
                    <span className="text-one">Learn More</span>
                    <span className="text-two">Learn More</span>
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
