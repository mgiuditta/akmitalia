import Image from "next/image";
import gallery_img from "@/assets/imgs/gallery/image-24.webp";
import Link from "next/link";

export default function ServiceDetailsHero() {
  return (
    <section className="hero-area-service-details">
      <div className="container large">
        <div className="hero-area-service-details-inner section-spacing-top">
          <div className="service-meta fade-anim">
            <span className="serial">[SL: 005]</span>
            <span className="tag">[Brand Guideline]</span>
            <span className="next-item">
              <Link href="/service-details">[Next]</Link>
            </span>
          </div>
          <div className="section-header fade-anim">
            <div className="section-title-wrapper">
              <div className="title-wrapper">
                <h2 className="section-title font-sequelsans-romanbody">
                  Brand <br />
                  Guideline
                </h2>
              </div>
            </div>
          </div>
          <div className="section-content-wrapper fade-anim">
            <div className="section-content">
              <div className="text-wrapper">
                <p className="text">
                  {"You'll"} need to provide your brand information, and
                  starting history to visualize identity. We speak fluent
                  branding, as we apply a solid base understanding to everything
                  we do in thought and action.
                </p>
              </div>
              <div className="feature-list">
                <ul>
                  <li>Strategy</li>
                  <li>Brand Identity</li>
                  <li>Communication</li>
                  <li>Research</li>
                  <li>Consultation</li>
                </ul>
              </div>
            </div>
            <div className="section-thumb parallax-view">
              <Image
                src={gallery_img}
                alt="image"
                data-speed="0.8"
                style={{height:'auto'}}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
