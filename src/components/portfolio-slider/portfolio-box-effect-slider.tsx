/* eslint-disable react-hooks/purity -- shuffle casuale del template, lasciato com'è (il div ha già suppressHydrationWarning) */
"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Mousewheel, EffectFade } from "swiper/modules";
import Link from "next/link";

interface PortfolioItem {
  background: string;
  title: string;
  categories: string[];
  year: string;
}

const portfolioItems: PortfolioItem[] = [
  { background: "/assets/imgs/slider/protfolio-3.webp", title: "Saudi <br>Lime Green", categories: ["Design", "Branding"], year: "2014" },
  { background: "/assets/imgs/slider/protfolio-4.webp", title: "Saudi <br>Lime Green", categories: ["Design", "Branding"], year: "2014" },
  { background: "/assets/imgs/slider/protfolio-5.webp", title: "Saudi <br>Lime Green", categories: ["Design", "Branding"], year: "2014" },
  { background: "/assets/imgs/slider/protfolio.webp", title: "Saudi <br>Lime Green", categories: ["Design", "Branding"], year: "2014" },
  { background: "/assets/imgs/slider/protfolio-2.webp", title: "Saudi <br>Lime Green", categories: ["Design", "Branding"], year: "2014" },
];

const GridMask = ({ count = 32 }: { count?: number }) => {
  const blocks = Array.from({ length: count }).map((_, i) => ({
    id: i,
    delay: `${Math.random() * 1.5}s`,
  }));

  return (
    <div className="grid-mask" suppressHydrationWarning>
      {blocks
        .sort(() => Math.random() - 0.5)
        .map((block, i) => (
          <div
            key={block.id}
            className="grid-block"
            // style={{ transitionDelay: block.delay }}
            style={{ transitionDelay: `${(i % 10) * 0.1}s` }}
          />
        ))}
    </div>
  );
};


const PortfolioBoxEffectSlider = () => {
  return (
    <section className="portfolio-3 py-12">
      <Swiper
        modules={[Pagination, Navigation, Mousewheel, EffectFade]}
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        centeredSlides={true}
        effect="fade"
        mousewheel={{ releaseOnEdges: true }}
        pagination={{ el: ".portfolio-3-pagination", clickable: true }}
        navigation={{
          prevEl: ".portfolio-3__slider__arrow-prev",
          nextEl: ".portfolio-3__slider__arrow-next",
        }}
        onSlideChange={(swiper) => {
          const bullets = document.querySelectorAll(".swiper-pagination-bullet");
          bullets.forEach((bullet, index) => {
            if (index <= swiper.realIndex) {
              bullet.classList.add("swiper-pagination-bullet-active");
            } else {
              bullet.classList.remove("swiper-pagination-bullet-active");
            }
          });
        }}
        className="portfolio-3-activ"
      >
        {portfolioItems.map((item, index) => (
          <SwiperSlide key={index}>
            <div
              className="portfolio-3__item"
              style={{ backgroundImage: `url(${item.background})` }}
            >
              <div className="slide-content">
                {/* <div className="grid-mask"></div> */}
                 <GridMask count={32} />
              </div>
              <div className="container mx-auto px-4">
                <div className="portfolio-3__content">
                  <h1 className="portfolio-3__content-title text-4xl font-bold text-white">
                    <Link href="/portfolio-details" dangerouslySetInnerHTML={{ __html: item.title }}></Link>
                  </h1>
                  <ul className="portfolio-3__list flex space-x-4 text-white">
                    {item.categories.map((category, idx) => (
                      <li key={idx}>
                        <Link href="/portfolio" className="hover:underline">
                          {category}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link href="/portfolio" className="hover:underline">
                        {item.year}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <div className="portfolio-3__slider__arrow d-flex justify-content-lg-end justify-content-start">
          <button className="portfolio-3__slider__arrow-prev d-flex align-items-center justify-content-center">
            <i className="fa-solid fa-arrow-left"></i> PREV
          </button>

          <button className="portfolio-3__slider__arrow-next d-flex align-items-center justify-content-center">
            NEXT<i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
        <div className="portfolio-3-pagination"></div>
      </Swiper>
    </section>
  );
};

export default PortfolioBoxEffectSlider;

