"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Mousewheel } from 'swiper/modules';
import SwiperCore from 'swiper';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';

// images 
import port_1 from '@/assets/imgs/slider/protfolio.webp';
import port_2 from '@/assets/imgs/slider/protfolio-2.webp';
import port_3 from '@/assets/imgs/slider/protfolio-3.webp';
import port_4 from '@/assets/imgs/slider/protfolio-4.webp';
import port_5 from '@/assets/imgs/slider/protfolio-5.webp';

// Define the type for portfolio items
interface PortfolioItem {
  image: StaticImageData;
  title: string;
  categories: string[];
  year: string;
}

// Sample portfolio data
const portfolioItems: PortfolioItem[] = [
  {
    image: port_1,
    title: 'Saudi <br>Lime Green',
    categories: ['Design', 'Branding'],
    year: '2014',
  },
  {
    image: port_2,
    title: 'Saudi <br>Lime Green',
    categories: ['Design', 'Branding'],
    year: '2014',
  },
  {
    image: port_3,
    title: 'Saudi <br>Lime Green',
    categories: ['Design', 'Branding'],
    year: '2014',
  },
  {
    image: port_4,
    title: 'Saudi <br>Lime Green',
    categories: ['Design', 'Branding'],
    year: '2014',
  },
  {
    image: port_5,
    title: 'Saudi <br>Lime Green',
    categories: ['Design', 'Branding'],
    year: '2014',
  },
];

const PortfolioSlider4: React.FC = () => {
  const interleaveOffset = 0.75;

  return (
    <section className="portfolio-4">
      <div className="swiper-container portfolio-4-activ">
        <Swiper
          modules={[Pagination, Navigation, Mousewheel]}
          loop={true}
          direction="vertical"
          autoplay={false}
          speed={2000}
          watchSlidesProgress={true}
          mousewheel={true}
          navigation={{
            prevEl: '.portfolio-4__slider__arrow-prev',
            nextEl: '.portfolio-4__slider__arrow-next',
          }}
          pagination={{ el: '.portfolio-4-pagination', clickable: true }}
          onProgress={(swiper: SwiperCore) => {
            for (let i = 0; i < swiper.slides.length; i++) {
              const slide = swiper.slides[i] as SwiperCore['slides'][number] & {
                progress: number;
              };
              const slideProgress = slide.progress;
              const innerOffset = swiper.height * interleaveOffset;
              const innerTranslate = slideProgress * innerOffset;
              const slideInner = swiper.slides[i].querySelector('.slide-inner');
              if (slideInner) {
                (slideInner as HTMLElement).style.transform = `translateY(${innerTranslate}px)`;
              }
            }
          }}
          onSetTransition={(swiper: SwiperCore, speed: number) => {
            for (let i = 0; i < swiper.slides.length; i++) {
              (swiper.slides[i] as HTMLElement).style.transition = `${speed}ms`;
              const slideInner = swiper.slides[i].querySelector('.slide-inner');
              if (slideInner) {
                (slideInner as HTMLElement).style.transition = `${speed}ms`;
              }
            }
          }}
          className="slider swiper-wrapper"
        >
          {portfolioItems.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="media slide-inner">
                <Image src={item.image} alt="home" style={{height:'auto'}} />
              </div>
              <div className="container">
                <div className="portfolio-4__content">
                  <h1 className="portfolio-4__content-title">
                    <Link
                      href="/work-details"
                      dangerouslySetInnerHTML={{ __html: item.title }}
                    ></Link>
                  </h1>
                  <ul className="portfolio-4__list">
                    {item.categories.map((category, idx) => (
                      <li key={idx}>
                        <Link href="/work">{category}</Link>
                      </li>
                    ))}
                    <li>
                      <Link href="/work">{item.year}</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="portfolio-4__slider__arrow d-flex justify-content-lg-end justify-content-start">
          <button className="portfolio-4__slider__arrow-prev d-flex align-items-center justify-content-center">
            <i className="fa-solid fa-arrow-left"></i> PREV
          </button>
          <button className="portfolio-4__slider__arrow-next d-flex align-items-center justify-content-center">
            NEXT <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
        <div className="portfolio-4-pagination"></div>
      </div>
    </section>
  );
};

export default PortfolioSlider4;