import Link from "next/link";
import ServiceContentWrapper from "./service-content-wrapper";

export default function ServiceAreaSeven() {
  const services = [
    {
      number: "001",
      title: "Art <br> Direction",
      text: "Our aim is to nurture brands and help them grow. And just like human brands need to grow.",
    },
    {
      number: "002",
      title: "Interaction <br> Design",
      text: "Whether your inquiries are big or small, we're prepared to engage, focusing on complex problems",
    },
    {
      number: "003",
      title: "Web & Mobile <br> Development",
      text: "Every opportunity comes with unique factors are the main stream we can offer your brand.",
    },
    {
      number: "004",
      title: "Digital <br> Marketing",
      text: "We offer digital marketing that connect, engage, and drive results. Let’s turn your vision into reality.",
    },
    {
      number: "005",
      title: "Brand <br> Guideline",
      text: "We always eager to collaborate with forward-thinking individuals and the organizations",
    },
  ];

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
            <div className="services-wrapper-2">
              {services.map((service, idx) => (
                <Link key={idx} className="fade-anim" href="/service-details">
                  <div className="service-box-wrapper">
                    <div className="service-box">
                      <div className="number">{service.number}</div>
                      <h3
                        className="title"
                        dangerouslySetInnerHTML={{ __html: service.title }}
                      />
                      <p className="text">{service.text}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Service Content Wrapper */}
          <ServiceContentWrapper />
        </div>
      </div>
    </section>
  );
};
