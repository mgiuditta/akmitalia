/* eslint-disable @next/next/no-img-element */
import React from "react";
// import Image from "next/image";
import Link from "next/link";
// import gallery_img from "@/assets/imgs/gallery/image-47.webp";
// import gallery_img_2 from "@/assets/imgs/gallery/image-48.webp";
// import gallery_img_3 from "@/assets/imgs/gallery/image-49.webp";
// import gallery_img_4 from "@/assets/imgs/gallery/image-50.webp";

const featuredWorks = [
  {
    title: "Saudi Venture Capital",
    tag: "Branding — 2014",
    image: '/assets/imgs/gallery/image-47.webp',
    marginTop: false,
  },
  {
    title: "Saudi Venture Capital",
    tag: "Branding — 2014",
    image: '/assets/imgs/gallery/image-48.webp',
    marginTop: true,
  },
  {
    title: "Saudi Venture Capital",
    tag: "Branding — 2014",
    image: '/assets/imgs/gallery/image-49.webp',
    marginTop: false,
  },
  {
    title: "Saudi Venture Capital",
    tag: "Branding — 2014",
    image: '/assets/imgs/gallery/image-50.webp',
    marginTop: false,
  },
];

const AwardAreaTwo = () => {
  return (
    <section className="featured-work-area-2">
      <div className="container large">
        <div className="featured-work-area-2-inner section-spacing">
          <div className="section-header">
            <div className="section-title-wrapper">
              <div className="subtitle-wrapper fade-anim">
                <span className="section-subtitle">featured WORK</span>
              </div>
              <div className="title-wrapper fade-anim">
                <h2 className="section-title font-thunder-regular">
                  Reach our <br />
                  featured <span>works</span>
                </h2>
              </div>
              <div className="description fade-anim">
                <p>
                  We help local companies and services enter the market, and
                  well-known brands expand an audience.
                </p>
              </div>
            </div>
          </div>

          <div className="featured-work-wrapper-box">
            <div className="featured-work-wrapper-2">
              {featuredWorks.map((work, index) => (
                <div className={`featured-work-box ${featuredWorks.length != -1 ? 'fade-anim':''}`} key={index}>
                  <div className={`thumb ${work.marginTop ? "mt--150" : ""}`}>
                    <span></span>
                    <div
                      className="image"
                      data-cursor-text="View"
                      data-cursor-text-red
                    >
                      <Link href="/portfolio-details">
                        <img
                          src={work.image}
                          alt={`image-${index}`}
                        />
                      </Link>
                    </div>
                  </div>
                  <div className="content">
                    <h3 className="title">
                      <Link href="/portfolio-details">
                        {work.title}
                      </Link>
                    </h3>
                    <div className="meta">
                      <span className="tag">{work.tag}</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="featured-work-box">
                <div className="content-wapper">
                  <div className="view-button fade-anim">
                    <p className="desc">
                      Whether your inquiries are big or small, {"we're"} prepared
                      to engage, focusing on complex problems
                    </p>
                    <div className="rr-hover-btn-wrapper">
                      <Link href="/portfolio-details" className="rr-btn-circle">
                        View <br />
                        All Work
                        <span className="rr-btn-circle-dot"></span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwardAreaTwo;
