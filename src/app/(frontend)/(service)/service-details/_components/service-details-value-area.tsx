import Image from "next/image";
import gallery_img from "@/assets/imgs/gallery/image-25.webp";

interface ValueItem {
  number: string;
  text: string;
}

const valueItems: ValueItem[] = [
  {
    number: "2750",
    text: "A website refresh or redesign is a comprehensive overhaul that includes substantial changes to the content, structure, visuals, and code of your current website.",
  },
  {
    number: "92%",
    text: "High-quality custom logo design for Melbourne businesses. We are here to support you. Description - Our logo design package uniquely blends creative skills and strategic thinking. We don't just create brand identities.",
  },
  {
    number: "75%",
    text: "Every creative design begins with a clear objective. Whether it's branding, advertising, product design and user experience, the design must align with the intended purpose to effectively communicate its beyond beauty.",
  },
];

const ServiceDetailsValueArea = () => {
  return (
    <section className="value-area">
      <div className="container large">
        <div className="value-area-inner section-spacing">
          <div className="section-content-wrapper fade-anim">
            <div className="section-thumb parallax-view">
              <Image
                src={gallery_img}
                alt="image"
                data-speed="0.8"
                style={{ height: 'auto' }}
              />
            </div>
            <div className="section-content">
              <div className="section-title-wrapper">
                <div className="title-wrapper">
                  <h2 className="section-title font-sequelsans-romanbody">
                    We sharpen your brands and businesses create exceptional
                    experiences where people live work
                  </h2>
                </div>
              </div>
              <div className="values-wrapper">
                {valueItems.map((item, index) => (
                  <div key={index} className="value-box">
                    <h3 className="number">{item.number}</h3>
                    <p className="text">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceDetailsValueArea;