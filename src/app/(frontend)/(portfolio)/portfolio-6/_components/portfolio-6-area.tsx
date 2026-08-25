import React from "react";
import Image from "next/image";
import Link from "next/link";

const workItems = [
  {
    title: "Saudi Lime Green",
    meta: "Marketing, 2010",
    imageSrc: "/assets/imgs/project/image-69.webp",
  },
  {
    title: "Panda Automap",
    meta: "Branding, 2010",
    imageSrc: "/assets/imgs/project/image-70.webp",
  },
  {
    title: "Saudi Venture Capital",
    meta: "Graphics, 2010",
    imageSrc: "/assets/imgs/project/image-71.webp",
  },
  {
    title: "Rebrand Lawberry",
    meta: "Motion, 2010",
    imageSrc: "/assets/imgs/project/image-72.webp",
  },
  {
    title: "Selicon Cloud Cave",
    meta: "Design, 2010",
    imageSrc: "/assets/imgs/project/image-73.webp",
  },
  {
    title: "Mountain Upwork",
    meta: "UI Design, 2010",
    imageSrc: "/assets/imgs/project/image-74.webp",
  },
  {
    title: "Blacky Motorola",
    meta: "Branding, 2010",
    imageSrc: "/assets/imgs/project/image-75.webp",
  },
  {
    title: "Lambax Nanak",
    meta: "Graphics, 2010",
    imageSrc: "/assets/imgs/project/image-76.webp",
  },
];

const PortfolioSixArea = () => {
  return (
    <section className="work-area-work-page mb-0">
      <div className="work-area-work-page-inner">
        <div className="works-wrapper-box border-top-bottom">
          <div className="container large">
            <div className="works-wrapper-7">
              {workItems.map((item, index) => (
                <div key={index} className="work-box">
                  <div
                    className="thumb fade-anim"
                    data-cursor-text={`<div class="content"><h3 class="title"><a href="/portfolio-details">${item.title}</a></h3><span class="meta">${item.meta}</span></div>`}
                    data-cursor-text-portfolio
                  >
                    <div className="content">
                      <h3 className="title">
                        <Link href="/portfolio-details">{item.title}</Link>
                      </h3>
                      <span className="meta">{item.meta}</span>
                    </div>
                    <div className="image scale">
                      <Link href="/portfolio-details">
                        <Image
                          src={item.imageSrc}
                          alt="image"
                          width={608}
                          height={708}
                          style={{height:'auto'}}
                        />
                      </Link>
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

export default PortfolioSixArea;
