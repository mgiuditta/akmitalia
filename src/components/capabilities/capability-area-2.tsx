"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Capability {
  id: number;
  title: string;
  link: string;
  images?: string[];
}

const capabilitiesData: Capability[] = [
  {
    id: 1,
    title: "Art Direction",
    link: "/service-details",
    images: [
      "/assets/imgs/gallery/image-39.webp",
      "/assets/imgs/gallery/image-40.webp",
      "/assets/imgs/gallery/image-41.webp",
    ],
  },
  {
    id: 2,
    title: "Interaction Design",
    link: "/service-details",
    images: ["/assets/imgs/gallery/image-40.webp", "/assets/imgs/gallery/image-41.webp"],
  },
  {
    id: 3,
    title: "Development",
    link: "/service-details",
    images: [
      "/assets/imgs/gallery/image-39.webp",
      "/assets/imgs/gallery/image-40.webp",
      "/assets/imgs/gallery/image-41.webp",
    ],
  },
  {
    id: 4,
    title: "Marketing",
    link: "/service-details",
    images: ["/assets/imgs/gallery/image-39.webp", "/assets/imgs/gallery/image-41.webp"],
  },
  {
    id: 5,
    title: "Brand Guideline",
    link: "/service-details",
    images: [
      "/assets/imgs/gallery/image-39.webp",
      "/assets/imgs/gallery/image-40.webp",
      "/assets/imgs/gallery/image-41.webp",
    ],
  },
  {
    id: 6,
    title: "Creative Writing",
    link: "/service-details",
    images: ["/assets/imgs/gallery/image-39.webp", "/assets/imgs/gallery/image-40.webp"],
  },
  {
    id: 7,
    title: "Explore",
    link: "/services",
  },
];

type IProps = {
  sec_spacing?: string;
  sec_wrapper_cls?: string;
  show_explore?: boolean;
};
export default function CapabilitiesAreaTwo({
  sec_spacing = "section-spacing",
  sec_wrapper_cls,
  show_explore = true,
}: IProps) {
  const [activeId, setActiveId] = useState<number>(1);
  const filteredCapabilities = show_explore
  ? capabilitiesData
  : capabilitiesData.filter(item => item.title !== "Explore");

  return (
    <section className="capabilities-area-2">
      <div className="container large">
        <div className={`capabilities-area-2-inner ${sec_spacing}`}>
          <div className={`section-content-wrapper ${sec_wrapper_cls || ""}`}>
            <div className="section-content">
              <div className="section-title-wrapper">
                <div className="subtitle-wrapper fade-anim">
                  <span className="section-subtitle">Our capabilities</span>
                </div>
              </div>
            </div>
            <div className="capability-wrapper-box">
              <div className="capability-wrapper capability-hover-active">
                {filteredCapabilities.map((item) => (
                  <div
                    key={item.id}
                    className={`capability-box fade-anim ${item.id === activeId ? "active" : ""}`}
                    onMouseEnter={() => setActiveId(item.id)}
                    onMouseLeave={() => setActiveId(item.id)}
                  >
                    <Link href={item.link}>
                      <div className="capability-box-inner">
                        <div className="content">
                          <h3
                            className={`title ${item.title === "Explore" ? "rr-btn-underline" : ""}`}
                          >
                            {item.title}
                          </h3>
                        </div>
                        {item.images && (
                          <div className="thumb">
                            {item.images.map((src, index) => (
                              <Image
                                key={index}
                                src={src}
                                alt="image"
                                width={76}
                                height={76}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}