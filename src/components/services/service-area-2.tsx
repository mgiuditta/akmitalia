import Image from "next/image";
import Link from "next/link";
import gallery_1 from '@/assets/imgs/gallery/image-10.webp';
import gallery_2 from '@/assets/imgs/gallery/image-11.webp';

const services = [
  {
    number: "001",
    title: <>Art <br />Direction</>,
    text: "Our aim is to nurture brands and help them grow. And just like human brands need to grow.",
  },
  {
    number: "002",
    title: <>Interaction <br />Design</>,
    text: "Whether your inquiries are big or small, we're prepared to engage, focusing on complex problems",
  },
  {
    number: "003",
    title: <>Web &amp; Mobile <br />Development</>,
    text: "Every opportunity comes with unique factors are the main stream we can offer your brand.",
  },
  {
    number: "004",
    title: <>Digital <br />Marketing</>,
    text: "We offer digital marketing that connect, engage, and drive results. Let’s turn your vision into reality.",
  },
  {
    number: "005",
    title: <>Brand <br />Guideline</>,
    text: "We always eager to collaborate with forward-thinking individuals and the organizations",
  },
];

export default function ServiceAreaTwo() {
  return (
    <section className="service-area-2">
      <div className="service-area-2-inner">
        <div className="services-wrapper-box section-spacing-bottom">
          <div className="container large">
            <div className="services-wrapper-2">
              {services.map((service) => (
                <Link className="fade-anim" href="/service-details" key={service.number}>
                  <div className="service-box-wrapper">
                    <div className="service-box">
                      <div className="number">{service.number}</div>
                      <h3 className="title">{service.title}</h3>
                      <p className="text">{service.text}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="service-content-wrapper section-spacing-top">
        <div className="container large">
          <div className="service-content">
            <div className="section-info-wrapper fade-anim" data-direction="left">
              <div className="thumb parallax-view">
                <Image src={gallery_1} alt="image" data-speed="0.7" style={{height:"auto"}} />
              </div>
              <div className="text-wrapper">
                <p className="text text-invert">
                  A practical guide explaining how and why Redox should be part of every project to ensure its high quality and seamless user experience.
                </p>
                <p className="text text-invert">
                  If you already understand ask to continue scrolling; otherwise, click the link below to explore more.
                </p>
              </div>
              <div className="btn-wrapper">
                <Link href="/portfolio" className="rr-btn btn-border-white">
                  <span className="btn-wrap">
                    <span className="text-one">View All Work</span>
                    <span className="text-two">View All Work</span>
                  </span>
                </Link>
              </div>
            </div>
            <div className="section-thumb-wrapper fade-anim" data-delay="0.45" data-direction="right">
              <div className="thumb parallax-view">
                <Image src={gallery_2} alt="image" data-speed="0.6" style={{height:"auto"}} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}