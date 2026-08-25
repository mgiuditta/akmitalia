"use client";
import React from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

import client_1 from "@/assets/imgs/client/client-1.webp";
import client_2 from "@/assets/imgs/client/client-2.webp";
import client_3 from "@/assets/imgs/client/client-3.webp";
import client_4 from "@/assets/imgs/client/client-4.webp";
import client_5 from "@/assets/imgs/client/client-5.webp";
import client_6 from "@/assets/imgs/client/client-6.webp";
import client_7 from "@/assets/imgs/client/client-7.webp";
import client_8 from "@/assets/imgs/client/client-8.webp";

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

export default function ClientSlider() {
  return (
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
        <SwiperSlide key={idx}>
          <div className="client-box">
            <Image src={src} alt="client" style={{ height: "auto" }} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
