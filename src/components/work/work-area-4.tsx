import React from "react";
import Image from "next/image";
import Link from "next/link";

const workData = [
  {
    title: "Redox Digital Agency HTML Template",
    tag: "WordPress, Themeforest",
    date: "(2025)",
    image: "/assets/imgs/project/image-30.webp",
  },
  {
    title: "Redox Digital Agency Theme",
    tag: "Themeforest",
    date: "(2025)",
    image: "/assets/imgs/project/image-31.webp",
  },
  {
    title: "Redox Digital Agency HTML Template",
    tag: "WordPress, Themeforest",
    date: "(2025)",
    image: "/assets/imgs/project/image-32.webp",
  },
  {
    title: "Redox Digital Agency Theme",
    tag: "Themeforest",
    date: "(2025)",
    image: "/assets/imgs/project/image-33.webp",
  },
  {
    title: "Redox Digital Agency HTML Template",
    tag: "WordPress, Themeforest",
    date: "(2025)",
    image: "/assets/imgs/project/image-34.webp",
  },
  {
    title: "Redox Digital Agency Theme",
    tag: "Themeforest",
    date: "(2025)",
    image: "/assets/imgs/project/image-35.webp",
  },
];

const WorkAreaFour = () => {
  return (
    <section className="work-area-4">
      <div className="container large">
        <div className="work-area-4-inner section-spacing-top">
          <div className="section-header fade-anim">
            <div className="section-title-wrapper">
              <div className="subtitle-wrapper">
                <span className="section-subtitle">
                  Products
                  <svg
                    viewBox="0 0 99 7"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.41291 5.98894C1.41291 5.98894 3.65997 6.01383 4.51655 5.98894C7.19358 5.56824 10.4255 5.80978 13.363 5.56824C17.8256 5.20128 22.1327 4.79415 26.6187 4.79415C31.6715 4.79415 36.6774 4.21934 41.7162 4.18834C46.981 4.15594 52.2465 4.18834 57.5114 4.18834C68.6462 4.18834 79.781 4.18834 90.9158 4.18834C121.155 6.61149 47.6583 -1.30401 1 1.68408"
                      stroke="#111111"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </div>
              <div className="title-wrapper">
                <h2 className="section-title font-bdogrotesk-regular fade-anim">
                  The work we do, and our favorite ones
                </h2>
                <div className="btn-wrapper fade-anim">
                  <Link
                    href="/service-details"
                    className="rr-btn-underline"
                  >
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

          <div className="works-wrapper-box section-spacing-top">
            <div className="works-wrapper-4 fade-anim">
              {workData.map((work, index) => (
                <div className="work-box" key={index}>
                  <div className="thumb">
                    <div
                      className="image scale"
                      data-cursor-text="View Details"
                      data-cursor-text-red
                    >
                      <Link href="/portfolio-details">
                        <Image
                          src={work.image}
                          alt="image"
                          width={805}
                          height={630}
                          style={{height:'auto'}}
                        />
                      </Link>
                    </div>
                  </div>
                  <div className="content">
                    <h3 className="title">
                      <Link href="/portfolio-details">{work.title}</Link>
                    </h3>
                    <div className="meta">
                      <span className="tag">{work.tag}</span>
                      <span className="date">{work.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkAreaFour;
