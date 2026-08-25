import React from "react";

const approachSteps = [
  {
    number: "01",
    title: "Keyword research",
    text: "Our mission is to empower the brands we believe in with tailor-made approaches that ignite creativity and growth without limits.",
  },
  {
    number: "02",
    title: "Ai-driven keyword generator",
    text: "Our mission is to empower the brands we believe in with tailor-made approaches that ignite creativity and growth without limits.",
  },
  {
    number: "03",
    title: "Real traffic organizer",
    text: "Our mission is to empower the brands we believe in with tailor-made approaches that ignite creativity and growth without limits.",
  },
  {
    number: "04",
    title: "Technical finalism",
    text: "Our mission is to empower the brands we believe in with tailor-made approaches that ignite creativity and growth without limits.",
  },
];

export default function ApproachArea() {
  return (
    <section className="approach-area">
      <div className="container large">
        <div className="approach-area-inner section-spacing">
          <div className="section-header">
            <div className="section-title-wrapper">
              <div className="subtitle-wrapper fade-anim" data-direction="left">
                <span className="section-subtitle">
                  Approach, expertise <br /> and values
                </span>
              </div>
              <div className="title-wrapper fade-anim" data-direction="right">
                <h2 className="section-title font-sequelsans-romanbody rr_title_anim">
                  Whether you’re a <span>startup</span> or <span>industry star</span>, we’re here to promote your brand by ai-driven keyword and real structure
                </h2>
              </div>
            </div>
          </div>
          <div className="approach-wrapper-box">
            <span className="steps fade-anim">04</span>
            <div className="approach-wrapper">
              {approachSteps.map((step, idx) => (
                <div className="approach-box" key={step.number + idx}>
                  <span className="number">{step.number}</span>
                  <h3 className="title">{step.title}</h3>
                  <p className="text">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}