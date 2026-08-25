"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import client_1 from '@/assets/imgs/client/client-1-dark.webp';
import client_2 from '@/assets/imgs/client/client-2-dark.webp';
import client_3 from '@/assets/imgs/client/client-3-dark.webp';
import client_4 from '@/assets/imgs/client/client-4-dark.webp';
import client_5 from '@/assets/imgs/client/client-5-dark.webp';
import client_6 from '@/assets/imgs/client/client-6-dark.webp';
import client_7 from '@/assets/imgs/client/client-7-dark.webp';
import client_8 from '@/assets/imgs/client/client-8-dark.webp';

const clientImages = [
  client_1,
  client_2,
  client_3,
  client_4,
  client_5,
  client_6,
  client_7,
  client_8,
  client_1,
  client_2,
  client_3,
  client_4,
  client_5,
  client_6,
  client_7,
  client_8,
];

export default function ClientSliderTwo() {
  return (
    <div className="client-area-2">
      <div className="client-area-2-inner">
        <div className="container large">
          <div className="section-header">
            <div className="text-wrapper rr_title_anim">
              <p className="text">
                Help to brands growing up and show their success stories to the world
              </p>
            </div>
          </div>
        </div>
        <div className="clients-wrapper-box fade-anim">
          <div className="clients-wrapper">
            <Swiper
              slidesPerView="auto"
              loop={true}
              autoplay={{ delay: 1, disableOnInteraction: false }}
              spaceBetween={0}
              speed={5000}
              allowTouchMove={false}
              modules={[Autoplay]}
              className="client-slider-active"
            >
              {clientImages.map((src, idx) => (
                <SwiperSlide key={idx} style={{ width: "auto" }}>
                  <div className="client-box">
                    <Image src={src} alt="client" style={{ height: "auto" }} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}