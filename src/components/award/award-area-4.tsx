import React from "react";

interface Award {
  id: number;
  category: string;
  award: string;
  year: number;
}

export default function AwardAreaFour() {
  const awardsData: Award[] = [
    {
      id: 1,
      category: "Awwwards",
      award: "3x creative agency of the day",
      year: 2023,
    },
    {
      id: 2,
      category: "Envato",
      award: "1x agency of the year",
      year: 2010,
    },
    {
      id: 3,
      category: "CSS Winner",
      award: "5x honorable mentioned",
      year: 2012,
    },
    {
      id: 4,
      category: "Behance",
      award: "2x Featured design of the week",
      year: 2021,
    },
    {
      id: 5,
      category: "Dribbble",
      award: "8x Best design of the day",
      year: 2017,
    },
  ];

  return (
    <section className="award-area-3">
      <div className="container large">
        <div className="award-area-2-inner section-spacing">
          <div className="section-header">
            <div className="section-title-wrapper">
              <div className="title-wrapper fade-anim" data-direction="left">
                <h2 className="section-title font-tartuffotrial-thin">
                  Making work that wins <span>awards</span> is not our destination. It is a starting point
                </h2>
              </div>
            </div>
          </div>
          <div className="award-wrapper-box">
            <div className="award-wrapper fade-anim" data-direction="right">
              {awardsData.map((item) => (
                <div className="award-box" key={item.id}>
                  <span className="category">{item.category}</span>
                  <p className="award">{item.award}</p>
                  <span className="year">{item.year}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}