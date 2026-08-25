import React from "react";

type Award = {
  category: string;
  award: string;
  year: number;
};

const awards: Award[] = [
  { category: "Awwwards", award: "3x creative agency of the day", year: 2023 },
  { category: "Envato", award: "1x agency of the year", year: 2010 },
  { category: "CSS Winner", award: "5x honorable mentioned", year: 2012 },
  { category: "Behance", award: "2x Featured design of the week", year: 2021 },
  { category: "Dribbble", award: "8x Best design of the day", year: 2017 },
];

const AwardAreaThree: React.FC = () => {
  return (
    <section className="award-area-2">
      <div className="container large">
        <div className="award-area-2-inner section-spacing">
          {/* Header */}
          <div className="section-header fade-anim">
            <div className="section-title-wrapper">
              <div className="subtitle-wrapper">
                <span className="section-subtitle">Awards</span>
              </div>
              <div className="title-wrapper">
                <h2 className="section-title font-thunder-regular">
                  We proudly receive worthy recognition and{" "}
                  <span>awards</span>
                </h2>
              </div>
            </div>
          </div>

          {/* Award Boxes */}
          <div className="award-wrapper-box fade-anim">
            <div className="award-wrapper">
              {awards.map(({ category, award, year }, index) => (
                <div key={index} className="award-box">
                  <span className="category">{category}</span>
                  <p className="award">{award}</p>
                  <span className="year">{year}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwardAreaThree;
