import React from "react";

const awardsData = [
  {
    category: "Awwwards",
    items: [
      { title: "7x Honorable Mention", year: "2014" },
      { title: "4x Site of the Day", year: "2016" },
      { title: "2x Developer Awards", year: "2016" },
      { title: "1x Site of the Year", year: "2019" },
      { title: "1x Design of the Year", year: "2025" },
    ],
  },
  {
    category: "CSS Design",
    items: [
      { title: "2x Website of the Day", year: "2014" },
      { title: "1x Best Innovation", year: "2016" },
      { title: "5x UX Design", year: "2016" },
      { title: "6x Creative Design", year: "2019" },
    ],
  },
  {
    category: "Dribbble",
    items: [
      { title: "2x Design of the Day", year: "2014" },
      { title: "2x Site of the Day", year: "2016" },
    ],
  },
  {
    category: "Behance",
    items: [{ title: "5x Featured Design", year: "2025" }],
  },
];

export const AwardBoxWrapper = () => {
  return (
    awardsData.map((award, idx) => (
      <div className="award-box" key={award.category + idx}>
        <div className="category">{award.category}</div>
        <ul className="award-list">
          {award.items.map((item, i) => (
            <li key={item.title + item.year + i}>
              {item.title}
              <span>{item.year}</span>
            </li>
          ))}
        </ul>
      </div>
    ))
  );
};

export default function AwardArea() {
  return (
    <section className="award-area">
      <div className="container large">
        <div className="award-area-inner section-spacing-top">
          <div className="section-header">
            <div className="section-title-wrapper">
              <div className="title-wrapper">
                <h2 className="section-title font-sequelsans-romanbody rr_title_anim">
                  We believe in quality, not quantity, that’s why we’re great
                  ever.
                </h2>
              </div>
            </div>
          </div>
          <div className="awards-wrapper-box">
            <div className="awards-wrapper fade-anim" data-direction="right">
              <AwardBoxWrapper/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
