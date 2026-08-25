import Image from "next/image";
import gallery_img from '@/assets/imgs/gallery/image-43.webp';

export default function HeroFour() {
  return (
    <section className="hero-area-4">
      <div className="container large">
        <div className="hero-area-2-inner">
          <div className="section-content">
            <div className="section-content__top">
              <div
                className="section-content__top-left fade-anim"
                data-delay="0.75"
                data-direction="left"
              >
                <div className="section-content__video">
                  <Image
                    src="https://rrdevs.net/project-video/antoni.gif"
                    alt="gif-image"
                    width={225}
                    height={126}
                    unoptimized
                  />
                </div>
                <ul className="section-content__list">
                  <li>Branding</li>
                  <li>Development</li>
                  <li>Design</li>
                  <li>Marketing</li>
                  <li>Creative Writing</li>
                </ul>
              </div>
              <div
                className="section-content__right fade-anim"
                data-delay="0.75"
                data-direction="right"
              >
                <h2 className="section-title font-thunder-regular">
                  Live in a <span>World</span>
                  <br />
                  of creative designs
                </h2>
              </div>
            </div>
            <div className="title-wrapper fade-anim" data-delay="0.75">
              <h1 className="section-title font-thunder-regular">
                Redox <sup>R</sup> <span className="bg"></span> design studio
              </h1>
              <p className="decisions">
                Redox is the first and only branding studio for your real
                exploration. you can realize about digital beautifully design.
              </p>
            </div>

            <div className="section-content__bottom">
              <ul className="social-links fade-anim" data-delay="0.60">
                <li><a href="https://www.facebook.com/">Facebook</a></li>
                <li><a href="https://dribbble.com/">Dribbble</a></li>
                <li><a href="https://www.behance.net/">Behance</a></li>
                <li><a href="https://x.com/?lang=en&mx=2">Twitter</a></li>
                <li><a href="https://bd.linkedin.com/">Linkedin</a></li>
              </ul>
              <div className="section-content__thumb">
                <Image
                  className="grow"
                  src={gallery_img}
                  alt="gallery-image"
                  style={{ height: "auto" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
