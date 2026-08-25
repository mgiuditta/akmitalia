import React from "react";
import Image from "next/image";
import Link from "next/link";
import ServiceContentWrapper from "./service-content-wrapper";

export default function ServiceAreaSix() {
  return (
    <section className="service-area-service-page">
      <div className="container large">
        <div className="service-area-service-page-inner">
          {/* Section Header */}
          <div className="section-header fade-anim">
            <div className="section-title-wrapper">
              <div className="subtitle-wrapper">
                <span className="section-subtitle">Capabilities</span>
              </div>
              <div className="title-wrapper">
                <h2 className="section-title font-sequelsans-romanbody">
                  We think out of the box when it comes to creative
                </h2>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="services-wrapper-box fade-anim">
            <div className="services-wrapper-1">
              {[
                {
                  number: "(01)",
                  title: "Branding",
                  services: [
                    "Creative Direction",
                    "Brand Identity",
                    "Branding Strategy",
                    "Graphic Design",
                    "Startup",
                  ],
                  img: "/assets/imgs/gallery/image-3.webp",
                },
                {
                  number: "(02)",
                  title: "UI-UX Design",
                  services: [
                    "UI UX Consulting",
                    "UX Research",
                    "Usability Testing",
                    "Wireframing",
                    "Prototyping",
                  ],
                  img: "/assets/imgs/gallery/image-4.webp",
                },
                {
                  number: "(03)",
                  title: "Development",
                  services: [
                    "WordPress",
                    "Webflow",
                    "Laravel Framework",
                    "React & Flutter",
                    "Design System",
                  ],
                  img: "/assets/imgs/gallery/image-5.webp",
                },
                {
                  number: "(04)",
                  title: "Digital Marketing",
                  services: [
                    "Online Marketing",
                    "SEO-Marketing",
                    "Strategy",
                    "Market Research",
                    "Social Reform",
                  ],
                  img: "/assets/imgs/gallery/image-6.webp",
                },
              ].map((service, index) => (
                <div className="service-box fade-anim" key={index}>
                  <div className="count">
                    <span className="number">{service.number}</span>
                  </div>
                  <div className="content">
                    <h3 className="title">
                      <Link href="/service-details">{service.title}</Link>
                    </h3>
                    <ul className="service-list">
                      {service.services.map((item, idx) => (
                        <li key={idx}>
                          <Link href="/service-details">{item}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="thumb">
                    <Image
                      className="grow"
                      src={service.img}
                      alt={service.title}
                      width={545}
                      height={265}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Service Content Wrapper */}
          <ServiceContentWrapper/>
        </div>
      </div>
    </section>
  );
};
