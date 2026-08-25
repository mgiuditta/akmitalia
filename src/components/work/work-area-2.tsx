"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    title: "Kashtech Doyel",
    image: "/assets/imgs/project/image-7.webp",
  },
  {
    title: "Saudi Lime Green",
    image: "/assets/imgs/project/image-8.webp",
  },
  {
    title: "Panda Automap",
    image: "/assets/imgs/project/image-9.webp",
  },
  {
    title: "Saudi Venture Capital",
    image: "/assets/imgs/project/image-10.webp",
  },
  {
    title: "Rebrand Lawberry",
    image: "/assets/imgs/project/image-11.webp",
  },
  {
    title: "Selicon Cloud Cave",
    image: "/assets/imgs/project/image-12.webp",
  },
  {
    title: "Mountain Upwork",
    image: "/assets/imgs/project/image-13.webp",
  },
  {
    title: "Blacky Motorola",
    image: "/assets/imgs/project/image-14.webp",
  },
  {
    title: "Panda Automap",
    image: "/assets/imgs/project/image-15.webp",
  },
  {
    title: "Saudi Venture Capital",
    image: "/assets/imgs/project/image-16.webp",
  },
  {
    title: "Rebrand Lawberry",
    image: "/assets/imgs/project/image-17.webp",
  },
  {
    title: "Selicon Cloud Cave",
    image: "/assets/imgs/project/image-18.webp",
  },
];

export const WorksWrapperTwo = () => {
  return (
    <div className="works-wrapper-2">
      {projects.map((project, index) => (
        <div className="work-box" key={index}>
          <div className="thumb" data-cursor-text="View Project">
            <Link href="/portfolio-details">
              <Image
                src={project.image}
                alt={project.title}
                width={440}
                height={290}
                style={{ height: "auto", width: "100%" }}
              />
            </Link>
          </div>
          <div className="content">
            <h3 className="title">
              <Link href="/portfolio-details">{project.title}</Link>
            </h3>
            <div className="meta">
              <span className="date">2025</span>
              <span className="tag">Design</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const WorkAreaTwo = () => {
  return (
    <section className="work-area-2">
      <div className="container large">
        <div className="work-area-2-inner section-spacing-top">
          <div className="works-wrapper-box">
            <div className="works-wrapper-head">
              <div className="text-wrapper">
                <p className="text">
                  Selected <span className="d-xxl-none">Work</span>
                </p>
              </div>
              <div className="total-count">
                <p className="text">
                  <Link href="/portfolio">browse more (20)</Link>
                </p>
              </div>
            </div>

            {/* works wrapper */}
            <WorksWrapperTwo />
            {/* works wrapper */}

          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkAreaTwo;
