"use client";
import Link from 'next/link';
import SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Mousewheel } from 'swiper/modules';
import Image, { StaticImageData } from 'next/image';
import EffectSlicer from '@/assets/plugins/effect-slicer.min.cjs';

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
    image: port_5,
    title: 'Saudi <br>Lime Green',
    categories: ['Design', 'Branding'],
    year: '2014',
  },
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
];

const PortfolioSlicerSlider = () => {
  return (
    <section className="portfolio-5">
      <div className="swiper portfolio-5-activ">
        <Swiper
          modules={[Pagination, Navigation, Mousewheel,EffectSlicer]}
          effect="slicer"
          loop={true}
          direction="vertical"
          speed={600}
          mousewheel={{ releaseOnEdges: true }}
          pagination={{ el: '.portfolio-5-pagination', clickable: true }}
          navigation={{
            prevEl: '.portfolio-5__slider__arrow-prev',
            nextEl: '.portfolio-5__slider__arrow-next',
          }}
          onSlideChange={(swiper: SwiperCore) => {
            const bullets = document.querySelectorAll('.swiper-pagination-bullet');
            bullets.forEach((bullet, index) => {
              if (index <= swiper.realIndex) {
                bullet.classList.add('swiper-pagination-bullet-active');
              } else {
                bullet.classList.remove('swiper-pagination-bullet-active');
              }
            });
          }}
          className="swiper-wrapper"
        >
          {portfolioItems.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="portfolio-5__item">
                <Image className="swiper-slicer-image" src={item.image} alt="image" style={{height:'auto'}} />
                <div className="slide-content">
                  <div className="grid-mask"></div>
                </div>
                <div className="container">
                  <div className="portfolio-5__content">
                    <h1 className="portfolio-5__content-title">
                      <Link
                        href="/portfolio-details"
                        dangerouslySetInnerHTML={{ __html: item.title }}
                      ></Link>
                    </h1>
                    <ul className="portfolio-5__list">
                      {item.categories.map((category, idx) => (
                        <li key={idx}>
                          <Link href="/portfolio">{category}</Link>
                        </li>
                      ))}
                      <li>
                        <Link href="/portfolio">{item.year}</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="portfolio-5__slider__arrow d-flex justify-content-lg-end justify-content-start">
          <button className="portfolio-5__slider__arrow-prev d-flex align-items-center justify-content-center">
            <i className="fa-solid fa-arrow-left"></i> PREV
          </button>
          <button className="portfolio-5__slider__arrow-next d-flex align-items-center justify-content-center">
            NEXT <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
        <div className="portfolio-5-pagination"></div>
      </div>
    </section>
  );
};

export default PortfolioSlicerSlider;