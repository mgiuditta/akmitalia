
interface ApproachItem {
  number: string;
  title: string;
  text: string;
}

const approachItems: ApproachItem[] = [
  {
    number: "01",
    title: "Discovery & Research",
    text: "Our mission is to empower the brands we believe in with tailor-made approaches that ignite creativity and growth without limits.",
  },
  {
    number: "02",
    title: "Wireframing & Prototyping",
    text: "Our mission is to empower the brands we believe in with tailor-made approaches that ignite creativity and growth without limits.",
  },
  {
    number: "03",
    title: "Design System",
    text: "Our mission is to empower the brands we believe in with tailor-made approaches that ignite creativity and growth without limits.",
  },
  {
    number: "04",
    title: "Design Validation",
    text: "Our mission is to empower the brands we believe in with tailor-made approaches that ignite creativity and growth without limits.",
  },
];

const ServiceDetailsApproach = () => {
  return (
    <section className="approach-area-service-details-page">
      <div className="container large">
        <div className="approach-area-service-details-page-inner section-spacing">
          <div className="section-header">
            <div className="section-title-wrapper">
              <div className="subtitle-wrapper fade-anim" data-direction="left">
                <span className="section-subtitle">
                  Our comprehensive <br />
                  design process
                </span>
              </div>
              <div className="title-wrapper fade-anim" data-direction="right">
                <h2 className="section-title font-sequelsans-romanbody">
                  Whether you’re a startup or industry star, we’re here to promote
                  your brand by creative research and real human centred design.
                </h2>
              </div>
            </div>
          </div>
          <div className="approach-wrapper-box">
            <span className="steps fade-anim">04</span>
            <div className="approach-wrapper fade-anim" data-direction="right">
              {approachItems.map((item, index) => (
                <div key={index} className="approach-box">
                  <span className="number">{item.number}</span>
                  <h3 className="title">{item.title}</h3>
                  <p className="text">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceDetailsApproach;