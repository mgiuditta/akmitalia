import Image from "next/image";
import gallery_img_1 from "@/assets/imgs/gallery/image-19.webp";
import gallery_img_2 from "@/assets/imgs/gallery/image-20.webp";
import gallery_img_3 from "@/assets/imgs/gallery/image-21.webp";
import gallery_img_4 from "@/assets/imgs/gallery/image-22.webp";
import Link from "next/link";

const gallery_images = [
  gallery_img_1,
  gallery_img_2,
  gallery_img_3,
  gallery_img_4,
  gallery_img_1,
];

export default function AboutAreaDetails() {
  return (
    <section className="about-area-details">
      <div className="container large">
        <div className="about-area-details-inner">
          <div className="section-header fade-anim">
            <div className="section-title-wrapper">
              <div className="subtitle-wrapper">
                <span className="section-subtitle">About studio</span>
              </div>
              <div className="title-wrapper">
                <h2 className="section-title font-sequelsans-romanbody">
                  Crafting digital products with a unique — vision of making
                  user experience better.
                </h2>
              </div>
            </div>
          </div>
          <div className="section-content-wrapper fade-anim">
            <div className="info-list">
              <ul>
                <li>Art Direction</li>
                <li>Capability</li>
                <li>Sustainability </li>
              </ul>
            </div>
            <div className="section-content">
              <div className="text-wrapper" data-direction="right">
                <p className="text">
                  Redox is the first and only creative agency for your real
                  exploration. It’s one private place to save everything you can
                  realize about digital beautifully design.
                </p>
                <p className="text">
                  As a global creative agency, we understand the importance of
                  staying ahead of the game. That’s why we partner with some of
                  the {"world's"} best talent to bring fresh ideas
                </p>
              </div>
              <div className="btn-wrapper" data-direction="right">
                <Link href="/about" className="rr-btn">
                  <span className="btn-wrap">
                    <span className="text-one">Explore Services</span>
                    <span className="text-two">Explore Services</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="moving-gallery fade-anim">
        <ul className="wrapper-gallery">
          {gallery_images.map((g, i) => (
            <li key={i}>
              <Image src={g} alt={`image-${i}`} style={{height:"auto"}} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
