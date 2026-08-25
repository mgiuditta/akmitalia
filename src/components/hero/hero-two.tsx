import Image from "next/image";
import shape from "@/assets/imgs/shape/shape-7.webp";
import gallery_img from "@/assets/imgs/gallery/image-9.webp";

export default function HeroTwo() {
  return (
    <section className="hero-area-2">
      <div className="container large">
        <div className="hero-area-2-inner">
          <div className="section-header">
            <div className="section-title-wrapper">
              <div className="title-wrapper">
                <h1
                  className="section-title font-sequelsans-romanbody char-anim"
                  data-delay="0.45"
                  data-direction="left"
                >
                  Design <br />
                  Edge
                  <Image
                    className="title-shape-1 fade-anim"
                    data-delay="1.9"
                    data-offset="100"
                    data-direction="left"
                    src={shape}
                    alt="img"
                  />{" "}
                  <br />
                  <Image
                    className="title-video fade-anim"
                    data-delay="1.9"
                    data-offset="100"
                    data-direction="right"
                    src="https://rrdevs.net/project-video/antoni.gif"
                    alt="image"
                    width={268}
                    height={150}
                    unoptimized
                  />
                  creative <br />
                  Agency
                </h1>
              </div>
            </div>
          </div>
          <div className="section-content">
            <div className="text-wrapper">
              <p
                className="text info-text fade-anim"
                data-delay="2.15"
                data-offset="100"
                data-direction="right"
              >
                An{" "}
                <span>award winning</span> creative agency, working based in
                Germany
              </p>
              <p className="text about-text rr_title_anim">
                Redox is the first and only creative agency for your real
                exploration. It’s one private place to save everything you can
                realize about digital beautifully design.
              </p>
            </div>
            <div className="hero-thumb fade-anim parallax-view">
              <Image
                src={gallery_img}
                alt="image"
                data-speed="0.6"
                style={{ height: "auto" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
