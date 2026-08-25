import React from "react";
import Image from "next/image";
import Link from "next/link";

const services = [
  {
    number: "01",
    title: "Art Direction",
    features: [
      "Design Strategy",
      "Prototyping & Wireframe",
      "Design system",
      "Usability testing",
    ],
  },
  {
    number: "02",
    title: "Brand Guideline",
    features: [
      "Design Strategy",
      "Prototyping & Wireframe",
      "Design system",
      "Usability testing",
    ],
  },
  {
    number: "03",
    title: "Art Direction",
    features: [
      "Design Strategy",
      "Prototyping & Wireframe",
      "Design system",
      "Usability testing",
    ],
  },
  {
    number: "04",
    title: "Brand Guideline",
    features: [
      "Design Strategy",
      "Prototyping & Wireframe",
      "Design system",
      "Usability testing",
    ],
  },
];

type IProps = {
  wrapperCls?: string;
};

const ServiceAreaFour = ({wrapperCls}:IProps) => {
  return (
    <section className="service-area-4">
      <div className="container large">
        <div className="service-area-4-inner">
          <div className={`services-wrapper-box ${wrapperCls || ""}`}>
            <div className="services-wrapper-4">
              {services.map((service, index) => (
                <div className="service-box fade-anim" key={index}>
                  <span className="number">{service.number}</span>
                  <h2 className="title">
                    <Link href="/service-details">{service.title}</Link>
                  </h2>
                  <div className="feature-list">
                    <ul>
                      {service.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}

              <div className="service-thumb">
                <Image
                  src="/assets/imgs/project/image-29.webp"
                  alt="image not found"
                  width={1920}
                  height={970}
                  style={{height:"auto"}}
                />
                <div className="service-thumb-line-wrapper">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <span key={i}></span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreaFour;
