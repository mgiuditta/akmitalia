import React from "react";
import Image from "next/image";
export default function ServiceContentWrapper() {
  return (
    <div className="service-content-wrapper section-spacing-top">
      <div className="service-content">
        <div className="section-info-wrapper fade-anim" data-direction="left">
          <div className="thumb parallax-view">
            <Image
              src="/assets/imgs/gallery/image-10.webp"
              alt="Service info visual"
              data-speed="0.9"
              width={250}
              height={320}
              style={{ height: "auto" }}
            />
          </div>
          <div className="text-wrapper">
            <p className="text text-invert">
              A practical guide explaining how and why Redox should be part of
              every project to ensure its high quality and seamless user
              experience.
            </p>
            <p className="text text-invert">
              If you already understand ask to continue scrolling; otherwise,
              click the link below to explore more.
            </p>
          </div>
        </div>
        <div
          className="section-thumb-wrapper fade-anim"
          data-delay="0.45"
          data-direction="right"
        >
          <div className="thumb parallax-view">
            <Image
              src="/assets/imgs/gallery/image-11.webp"
              alt="Service related"
              data-speed="0.8"
              width={740}
              height={930}
              style={{ height: "auto" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
