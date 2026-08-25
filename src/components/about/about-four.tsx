import Image from "next/image";
import gallery_img from "@/assets/imgs/gallery/image-51.webp";
import Link from "next/link";

export default function AboutFour() {
  return (
    <section className="about-area-4">
      <div className="container large">
        <div className="about-area-4-inner section-spacing-bottom">
          <div className="section-header fade-anim">
            <div className="section-title-wrapper">
              <div className="subtitle-wrapper">
                <span className="section-subtitle">
                  The studio
                  <svg
                    viewBox="0 0 99 7"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.41291 5.98894C1.41291 5.98894 3.65997 6.01383 4.51655 5.98894C7.19358 5.56824 10.4255 5.80978 13.363 5.56824C17.8256 5.20128 22.1327 4.79415 26.6187 4.79415C31.6715 4.79415 36.6774 4.21934 41.7162 4.18834C46.981 4.15594 52.2465 4.18834 57.5114 4.18834C68.6462 4.18834 79.781 4.18834 90.9158 4.18834C121.155 6.61149 47.6583 -1.30401 1 1.68408"
                      stroke="#111111"
                      strokeLinecap="round"
                      className="svg-elem-1"
                    ></path>
                  </svg>
                </span>
              </div>
              <div className="title-wrapper">
                <h2 className="section-title font-bdogrotesk-regular fade-anim">
                  We’re a design and development studio since 2017 who craft
                  digital masterpiece products.
                </h2>
                <div className="btn-wrapper fade-anim">
                  <Link href="/about" className="rr-btn">
                    <span className="btn-wrap">
                      <span className="text-one">Learn more us</span>
                      <span className="text-two">Learn more us</span>
                    </span>
                  </Link>
                  <Link href="/portfolio" className="rr-btn-underline">
                    Browse all products
                    <span className="icon">
                      <Image
                        src="/assets/imgs/icon/icon-5.webp"
                        alt="image"
                        width={13}
                        height={13}
                      />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="thumb parallax-view go_full">
            <Image
              src={gallery_img}
              alt="image"
              data-speed="0.8"
              style={{ height: "auto" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
