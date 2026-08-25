"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Pagination, Navigation, EffectFade } from 'swiper/modules';
import Link from 'next/link';

// Define the type for portfolio items
interface PortfolioItem {
  background: string;
  title: string;
  categories: string[];
  year: string;
}

// Sample portfolio data
const portfolioItems: PortfolioItem[] = [
  {
    background: '/assets/imgs/slider/protfolio-2.webp',
    title: 'Saudi <br> Lime Green',
    categories: ['Design', 'Branding'],
    year: '2014',
  },
  {
    background: '/assets/imgs/slider/protfolio-3.webp',
    title: 'Saudi <br> Lime Green',
    categories: ['Design', 'Branding'],
    year: '2014',
  },
  {
    background: '/assets/imgs/slider/protfolio-4.webp',
    title: 'Saudi <br> Lime Green',
    categories: ['Design', 'Branding'],
    year: '2014',
  },
  {
    background: '/assets/imgs/slider/protfolio-5.webp',
    title: 'Saudi <br> Lime Green',
    categories: ['Design', 'Branding'],
    year: '2014',
  },
  {
    background: '/assets/imgs/slider/protfolio.webp',
    title: 'Saudi <br> Lime Green',
    categories: ['Design', 'Branding'],
    year: '2014',
  },
];

const PortfolioLineEffectSlider = () => {
  return (
    <section className="portfolio-2 py-12">
      <Swiper
        modules={[Mousewheel, Pagination, Navigation, EffectFade]}
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        speed={2000}
        centeredSlides={true}
        effect="fade"
        mousewheel={{ releaseOnEdges: true }}
        pagination={{ el: '.portfolio-2-pagination', clickable: true }}
        navigation={{
          prevEl: '.portfolio-2__slider__arrow-prev',
          nextEl: '.portfolio-2__slider__arrow-next',
        }}
        onSlideChangeTransitionStart={() => {
          document.querySelectorAll('.line').forEach((line) => {
            (line as HTMLElement).style.transform = 'scaleY(1)';
          });

          setTimeout(() => {
            document
              .querySelectorAll('.swiper-slide-active .line')
              .forEach((line) => {
                (line as HTMLElement).style.transform = 'scaleY(0)';
              });
          }, 10);
        }}
        onSlideChange={(swiper) => {
          const bullets = document.querySelectorAll('.swiper-pagination-bullet');
          bullets.forEach((bullet, index) => {
            if (index <= swiper.realIndex) {
              bullet.classList.add('swiper-pagination-bullet-active');
            } else {
              bullet.classList.remove('swiper-pagination-bullet-active');
            }
          });
        }}
        className="portfolio-2-activ"
      >
        {portfolioItems.map((item, index) => (
          <SwiperSlide key={index}>
            <div
              className="portfolio-2__item"
              style={{ backgroundImage: `url(${item.background})` }}
            >
              <div className="line-effect">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="line"></div>
                ))}
              </div>
              <div className="container mx-auto px-4">
                <div className="portfolio-2__content">
                  <h1 className="portfolio-2__content-title text-4xl font-bold text-white">
                    <Link href="/portfolio-details" dangerouslySetInnerHTML={{ __html: item.title }}></Link>
                  </h1>
                  <ul className="portfolio-2__list flex space-x-4 text-white">
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
        <div className="portfolio-2__slider__arrow flex justify-start lg:justify-end mt-4">
          <button className="portfolio-2__slider__arrow-prev flex items-center justify-center px-4 py-2 bg-gray-800 text-white hover:bg-gray-700">
            <i className="fa-solid fa-arrow-left mr-2"></i> PREV
          </button>
          <button className="portfolio-2__slider__arrow-next flex items-center justify-center px-4 py-2 bg-gray-800 text-white hover:bg-gray-700 ml-2">
            NEXT <i className="fa-solid fa-arrow-right ml-2"></i>
          </button>
        </div>
        <div className="portfolio-2-pagination mt-4"></div>
      </Swiper>
    </section>
  );
};

export default PortfolioLineEffectSlider;