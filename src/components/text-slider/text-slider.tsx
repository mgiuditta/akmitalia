"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

const TextSlider = () => {
  return (
    <div className="text-slider-box fade-anim">
      <div className="text-slider">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 1 }}
          loop={true}
          className="text-slider-active"
          slidesPerView={'auto'}
          spaceBetween={35}
          speed={10000}
          allowTouchMove={false}
        >
          {Array(7)
            .fill(null)
            .map((_, index) => (
              <SwiperSlide key={index}>
                <div className="text-slider-item">
                  <h2 className="title">
                    <span className="dot"></span>Featured work
                  </h2>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default TextSlider;