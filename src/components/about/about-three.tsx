import Image from "next/image";
import Link from "next/link";
import gallery_1 from "@/assets/imgs/gallery/image-43.webp";
import gallery_2 from "@/assets/imgs/gallery/image-44.webp";
import gallery_3 from "@/assets/imgs/gallery/image-45.webp";
import gallery_4 from "@/assets/imgs/gallery/image-46.webp";

const gallery_images = [gallery_1, gallery_2, gallery_3, gallery_4];

export default function AboutThree() {
  return (
    <div className="about-area-3">
      <div className="container large">
        <div className="about-area-3-inner section-spacing">
          <div className="section-content section-spacing">
            <div className="about-thumb about_3__thumb-anim fade-anim">
              {gallery_images.map((g, i) => (
                <Image
                  key={i}
                  src={g}
                  alt={`image-${i}`}
                  style={{ height: "auto" }}
                  className={`thumb-${i + 1}`}
                />
              ))}
            </div>
            <div className="text-wrapper fade-anim">
              <p className="text">
                Since 2012, we have provided strategy, design & development to
                innovative organizations around the world — from major consumer
                brands to early stage startups. Through our collaboration and
                design-driven leadership we’ve helped launch and grow
                digital-first brands, products and businesses.
              </p>
            </div>
            <div className="btn-wrapper fade-anim">
              <div className="rr-hover-btn-wrapper">
                <Link href="/portfolio-details" className="rr-btn-circle">
                  View <br />
                  All Work
                  <span className="rr-btn-circle-dot"></span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
