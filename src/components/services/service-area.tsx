/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";

const ServiceArea = () => {
  // Service data
  const services = [
    {
      number: "(01)",
      title: "Branding",
      list: [
        "Creative Direction",
        "Brand Identity",
        "Branding Strategy",
        "Graphic Design",
        "Startup",
      ],
      image: "/assets/imgs/gallery/image-3.webp",
    },
    {
      number: "(02)",
      title: "UI-UX Design",
      list: [
        "UI UX Consulting",
        "UX Research",
        "Usability Testing",
        "Wireframing",
        "Prototyping",
      ],
      image: "/assets/imgs/gallery/image-4.webp",
    },
    {
      number: "(03)",
      title: "Development",
      list: [
        "WordPress",
        "Webflow",
        "Laravel Framework",
        "React & Flutter",
        "Design System",
      ],
      image: "/assets/imgs/gallery/image-5.webp",
    },
    {
      number: "(04)",
      title: "Digital Marketing",
      list: [
        "Online Marketing",
        "SEO-Marketing",
        "Strategy",
        "Market Research",
        "Social Reform",
      ],
      image: "/assets/imgs/gallery/image-6.webp",
    },
  ];

  return (
    <section className="service-area">
      <div className="container large">
        <div className="service-area-inner section-spacing">
          <div className="section-header">
            <div className="section-title-wrapper fade-anim">
              <div className="title-wrapper">
                <h2 className="section-title font-instrumentsans-medium word-anim">
                  Complex <br /> proficiency
                </h2>
              </div>
            </div>
          </div>
          <div className="services-wrapper-box">
            <div className="services-wrapper-1">
              {services.map((service, index) => (
                <div key={index} className="service-box fade-anim">
                  <div className="count">
                    <span className="number">{service.number}</span>
                  </div>
                  <div className="content">
                    <h3 className="title">
                      <Link href="/service-details">{service.title}</Link>
                    </h3>
                    <ul className="service-list">
                      {service.list.map((item, i) => (
                        <li key={i}>
                          <Link href="/service-details">{item}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="thumb">
                    <img className="grow" src={service.image} alt="image" />
                    {/* <Image className="grow" src={service.image} alt="image" width={545} height={265} style={{ height: "auto" }} /> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceArea;

