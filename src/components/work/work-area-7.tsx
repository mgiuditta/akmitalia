"use client";
import Link from 'next/link';
import Image from 'next/image';
import shape from '@/assets/imgs/shape/shape-21.webp';
import { useGSAP } from '@gsap/react';
import { fadeAnimation } from '@/utils/title-anim';
import { workAnimationTwo } from '@/utils/work-anim';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


const WorkAreaSeven: React.FC = () => {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    fadeAnimation();
    workAnimationTwo();
  }, {});
  return (
   <section className="work-area-5">
      <div className="container large">
        <div className="work-area-5-inner section-spacing-bottom">
          <div className="works-wrapper-box">
            <div className="works-wrapper-5">
              <div className="section-header span-2 fade-anim">
                <div className="section-title-wrapper">
                  <div className="title-wrapper">
                    <h2 className="section-title">
                      We’re Redox®—a design and development agency based in
                      Germany.
                    </h2>
                  </div>
                </div>
                <div className="header-shape-1">
                  <Image src={shape} alt="image" />
                </div>
              </div>

              {/* Work cards */}
              {[
                "image-52.webp",
                "image-53.webp",
                "image-54.webp",
                "image-55.webp",
                "image-56.webp",
                "image-57.webp",
                "image-58.webp",
                "image-59.webp",
              ].map((img, index) => (
                <Link
                  key={index}
                  href="/portfolio-details"
                  className="work-box card-wrap fade-anim"
                  data-image={`/assets/imgs/project/${img}`}
                >
                  <div className="card">
                    <div className="card-bg"></div>
                    <div className="thumb"></div>
                  </div>
                </Link>
              ))}

              {/* Services */}
              <div className="services-wrapper-box span-2 fade-anim">
                <span className="subtitle">Capability</span>
                <div className="services-wrapper">
                  {[
                    "Design",
                    "Brand Identity",
                    "Development",
                    "Digital Marketing",
                    "Animation",
                  ].map((service, index) => (
                    <div className="service-box" key={index}>
                      <h2 className="title">
                        <Link href="/service-details">{service}</Link>
                      </h2>
                    </div>
                  ))}
                </div>
              </div>

              {/* Remaining work cards */}
              {[
                "image-60.webp",
                "image-61.webp",
                "image-62.webp",
                "image-63.webp",
                { src: "image-64.webp", extra: "grid-column-start-2" },
                "image-65.webp",
                { src: "image-66.webp", extra: "grid-column-start-1" },
                { src: "image-67.webp", extra: "grid-column-start-3" },
                "image-68.webp",
              ].map((item, index) => {
                const src = typeof item === "string" ? item : item.src;
                const extra = typeof item === "string" ? "" : item.extra;
                return (
                  <Link
                    key={`last-${index}`}
                    href="/portfolio-details"
                    className={`work-box card-wrap fade-anim ${
                      extra || ""
                    }`.trim()}
                    data-image={`/assets/imgs/project/${src}`}
                  >
                    <div className="card">
                      <div className="card-bg"></div>
                      <div className="thumb"></div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkAreaSeven;