/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Parallax, Mousewheel, Pagination, Navigation } from 'swiper/modules';
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
    background: '/assets/imgs/slider/protfolio.webp',
    title: 'Saudi <br> Lime Green',
    categories: ['Design', 'Branding'],
    year: '2014',
  },
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
];

const PortfolioHorizontalSlider: React.FC = () => {
  return (
    <section className="portfolio py-12">
      <Swiper
        modules={[Parallax, Mousewheel, Pagination, Navigation]}
        loop={true}
        speed={1800}
        parallax={true}
        mousewheel={{ releaseOnEdges: true }}
        pagination={{ el: '.portfolio-pagination', clickable: true }}
        navigation={{
          prevEl: '.portfolio__slider__arrow-prev',
          nextEl: '.portfolio__slider__arrow-next',
        }}
        onProgress={(swiper:any) => {
          for (let i = 0; i < swiper.slides.length; i++) {
            const slideProgress = swiper.slides[i]?.progress;
            const innerOffset = swiper.width * 1; // interleaveOffset
            const innerTranslate = slideProgress * innerOffset;
            const slideInner = swiper.slides[i].querySelector('.slide-inner');
            if (slideInner) {
              (slideInner as HTMLElement).style.transform = `translate3d(${innerTranslate}px, 0, 0)`;
            }
          }
        }}
        onTouchStart={(swiper) => {
          for (let i = 0; i < swiper.slides.length; i++) {
            (swiper.slides[i] as HTMLElement).style.transition = '';
          }
        }}
        onSetTransition={(swiper, speed) => {
          for (let i = 0; i < swiper.slides.length; i++) {
            (swiper.slides[i] as HTMLElement).style.transition = `${speed}ms`;
            const slideInner = swiper.slides[i].querySelector('.slide-inner');
            if (slideInner) {
              (slideInner as HTMLElement).style.transition = `${speed}ms`;
            }
          }
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
        className="portfolio-activ"
      >
        {portfolioItems.map((item, index) => (
          <SwiperSlide key={index}>
            <div
              className="portfolio__item slide-inner"
              style={{ backgroundImage: `url(${item.background})` }}
              data-swiper-parallax="50%"
            >
              <div className="container mx-auto px-4">
                <div className="portfolio__content">
                  <h1 className="portfolio__content-title text-4xl font-bold text-white">
                    <Link href="/portfolio-details" dangerouslySetInnerHTML={{ __html: item.title }}></Link>
                  </h1>
                  <ul className="portfolio__list flex space-x-4 text-white">
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
        <div className="portfolio__slider__arrow flex justify-start lg:justify-end mt-4">
          <button
            className="portfolio__slider__arrow-prev flex items-center justify-center px-4 py-2 bg-gray-800 text-white hover:bg-gray-700"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i> PREV
          </button>
          <button
            className="portfolio__slider__arrow-next flex items-center justify-center px-4 py-2 bg-gray-800 text-white hover:bg-gray-700 ml-2"
          >
            NEXT <i className="fa-solid fa-arrow-right ml-2"></i>
          </button>
        </div>
        <div className="portfolio-pagination mt-4"></div>
      </Swiper>
    </section>
  );
};

export default PortfolioHorizontalSlider;