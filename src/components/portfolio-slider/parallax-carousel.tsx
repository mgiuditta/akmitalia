"use client";
import Image from "next/image";
import { parallaxSliderAnimation } from "@/utils/parallax-slider";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

interface PortfolioItem {
  imageSrc: string;
  title: string;
  tags: string;
  date: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    imageSrc: "/assets/imgs/slider/protfolio-6.webp",
    title: "Redox Digital Agency HTML Template",
    tags: "WordPress, Themeforest",
    date: "2025",
  },
  {
    imageSrc: "/assets/imgs/slider/protfolio-7.webp",
    title: "Al Khobar Uptown",
    tags: "Visual Identity, Branding",
    date: "2021",
  },
  {
    imageSrc: "/assets/imgs/slider/protfolio-8.webp",
    title: "Save Me Saudia",
    tags: "Communication, Social Media",
    date: "2020",
  },
  {
    imageSrc: "/assets/imgs/slider/protfolio-9.webp",
    title: "Lambax Nanak",
    tags: "Strategy, Visual Identity, Re-branding",
    date: "2022",
  },
  {
    imageSrc: "/assets/imgs/slider/protfolio-6.webp",
    title: "Redox Digital Agency HTML Template",
    tags: "WordPress, Themeforest",
    date: "2025",
  },
  {
    imageSrc: "/assets/imgs/slider/protfolio-7.webp",
    title: "Al Khobar Uptown",
    tags: "Visual Identity, Branding",
    date: "2021",
  },
  {
    imageSrc: "/assets/imgs/slider/protfolio-8.webp",
    title: "Save Me Saudia",
    tags: "Communication, Social Media",
    date: "2020",
  },
  {
    imageSrc: "/assets/imgs/slider/protfolio-9.webp",
    title: "Lambax Nanak",
    tags: "Strategy, Visual Identity, Re-branding",
    date: "2022",
  },
];

export default function ParallaxCarousel() {
  useGSAP(() => {
    parallaxSliderAnimation();
  },{})
  return (
    <section className="parallax-slider-wrapper">
      <div className="parallax-slider">
        <div className="parallax-slider-inner">
          {portfolioItems.map((item, index) => (
            <div key={index} className="parallax-slider-item">
              <Link href="/portfolio-details">
                <Image
                  className="image"
                  data-cursor-text="Drag"
                  data-cursor-text-red
                  src={item.imageSrc}
                  alt="image"
                  width={750}
                  height={358}
                />
              </Link>

              <div className="content">
                <h3 className="title">
                  <Link href="/portfolio-details">{item.title}</Link>
                </h3>
                <div className="meta">
                  <span className="tag">{item.tags}</span>
                  <span className="date">({item.date})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
