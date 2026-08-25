import Image from "next/image";
import Link from "next/link";
import React from "react";

const workItems = [
  {
    img: "/assets/imgs/project/image-19.webp",
    title: "Harash Denmark",
    date: "2010",
    tag: "Branding"
  },
  {
    img: "/assets/imgs/project/image-20.webp",
    title: "Saudi Lime Green",
    date: "2010",
    tag: "Marketing"
  },
  {
    img: "/assets/imgs/project/image-21.webp",
    title: "Saudi Venture Capital",
    date: "2010",
    tag: "Marketing"
  },
  {
    img: "/assets/imgs/project/image-22.webp",
    title: "Nilachal Network",
    date: "2010",
    tag: "Marketing"
  },
  {
    img: "/assets/imgs/project/image-23.webp",
    title: "Royal Cash App",
    date: "2010",
    tag: "Design"
  },
  {
    img: "/assets/imgs/project/image-24.webp",
    title: "Mashup Gradient",
    date: "2010",
    tag: "Design"
  },
];

export default function WorkAreaThree() {
  return (
    <section className="work-area-3">
      <div className="container large">
        <div className="work-area-3-inner section-spacing-top">
          <div className="section-header fade-anim">
            <div className="section-title-wrapper">
              <div className="title-wrapper">
                <h2 className="section-title font-sequelsans-romanbody rr_title_anim">
                  We find the unique, easy solution for each creative project{" "}
                  <span className="mb-14">
                    <Link href="/portfolio" className="rr-btn-group">
                      <span className="b">View all work</span>
                      <span className="c">
                        <i className="fa-solid fa-arrow-right"></i>
                      </span>
                    </Link>
                  </span>
                </h2>
              </div>
            </div>
          </div>
          <div className="works-wrapper-box">
            <div className="works-wrapper-3">
              {workItems.map((item, idx) => (
                <div className="work-box fade-anim" key={item.title + idx}>
                  <div className="thumb">
                    <div className="image scale" data-cursor-text="View Project">
                      <Link href="/portfolio-details">
                        <Image
                          src={item.img}
                          alt="image"
                          width={900}
                          height={630}
                          style={{ height: "auto" }}
                        />
                      </Link>
                    </div>
                  </div>
                  <div className="content">
                    <h3 className="title">
                      <Link href="/portfolio-details">{item.title}</Link>
                    </h3>
                    <div className="meta">
                      <span className="date">{item.date}</span>
                      <span className="tag">{item.tag}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}