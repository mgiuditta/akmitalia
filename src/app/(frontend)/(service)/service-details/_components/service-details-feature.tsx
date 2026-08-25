import Image from "next/image";
import shape_1 from "@/assets/imgs/shape/shape-15.webp";
import shape_2 from "@/assets/imgs/shape/shape-16.webp";
import shape_3 from "@/assets/imgs/shape/shape-17.webp";
import shape_4 from "@/assets/imgs/shape/shape-18.webp";


const featureItems = [
  {
    imageSrc: shape_1,
    title: "Skilled <br> design team",
    text: "We work closely with your team to understand your mission, values, and goals, forming the foundation of your brand identity.",
  },
  {
    imageSrc: shape_2,
    title: "User-centric <br> design",
    text: "We bring extensive experience across various industries, delivering tailored design solutions that meet specific sector needs.",
  },
  {
    imageSrc: shape_3,
    title: "Data-driven <br> approach",
    text: "Our designs are guided by data and user insights, ensuring optimal usability and impactful user experiences.",
  },
  {
    imageSrc: shape_4,
    title: "Collaborative <br> process",
    text: "We work closely with you throughout the design journey, incorporating your feedback to create designs that align with your vision.",
  },
];

const ServiceDetailsFeature = () => {
  return (
    <section className="feature-area">
      <div className="container large">
        <div className="feature-area-inner section-spacing-top">
          <div className="features-wrapper-box fade-anim">
            <div className="features-wrapper">
              {featureItems.map((item, index) => (
                <div key={index} className="feature-box">
                  <div className="thumb">
                    <Image src={item.imageSrc} alt="icon" />
                  </div>
                  <div className="content">
                    <h3 className="title" dangerouslySetInnerHTML={{ __html: item.title }} />
                    <p className="text">{item.text}</p>
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

export default ServiceDetailsFeature;