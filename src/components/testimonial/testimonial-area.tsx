import Image from "next/image";
import React from "react";

const testimonials = [
  {
    text: `“They took the time to understand my brand and target audience, and developed a marketing strategy that perfectly captured our essence. Their creative campaigns led to a significant increase in sales, and their expertise helped us secure a valuable partnership with another company`,
    name: "Michael Mahanay",
    post: "CMO, Supra",
    icon: "/assets/imgs/icon/icon-3.webp",
    light: false,
  },
  {
    text: `Their mission is to empower the brands we believe in with tailor-made approaches that ignite creativity and growth without limits. We discovered more funny quality work.`,
    name: "James David",
    post: "Lead Developer, Dexra",
    icon: "/assets/imgs/icon/icon-3-light.webp",
    light: true,
  },
  {
    text: `Redox always eager to collaborate with forward-thinking individuals and organizations, using the power of design and technology to tackle today’s challenges and shape a better future from sleek websites to memorable branding, I offer creative solutions that connect, engage, and drive results`,
    name: "Brenda C. Janet",
    post: "Lead Designer, Fexzo",
    icon: "/assets/imgs/icon/icon-3.webp",
    light: false,
  },
  {
    text: `Design is a team effort, and I believe in a true partnership. By working closely with you, understanding your vision, and staying open to feedback. We can create something that truly resonates.`,
    name: "Martin Carlos",
    post: "CEO & Founder, Dulex",
    icon: "/assets/imgs/icon/icon-3-light.webp",
    light: true,
  },
  {
    text: `“They took the time to understand my brand and target audience, and developed a marketing strategy that perfectly captured our essence. Their creative campaigns led to a significant increase in sales, and their expertise helped us secure a valuable partnership with another company`,
    name: "Garry J. Coburn",
    post: "Project Manager, Camos",
    icon: "/assets/imgs/icon/icon-3.webp",
    light: false,
  },
];

export default function TestimonialArea() {
  return (
    <section className="testimonial-area moving-testimonial">
      <div className="container large">
        <div className="testimonial-area-inner section-spacing-top">
          <div className="section-header">
            <div className="section-title-wrapper">
              <div className="title-wrapper">
                <h2 className="section-title font-sequelsans-romanbody rr_title_anim">
                  Our happy clients always say, how they are satisfied with our service.
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="testimonial-wrapper-box section-spacing-bottom">
        <div className="pin">
          <div className="container full-hd">
            <div className="testimonial-wrapper">
              {testimonials.map((t, idx) => (
                <div
                  className={`testimonial-item t-card${t.light ? " light" : ""}`}
                  key={idx}
                >
                  <div className="content">
                    <div className="text-wrapper">
                      <p className="text">{t.text}</p>
                    </div>
                    <div className="author">
                      <div className="meta">
                        <h3 className="name">{t.name}</h3>
                        <span className="post">{t.post}</span>
                      </div>
                      <div className="icon">
                        <Image className="quote-icon" src={t.icon} alt="Quote Icon" width={26} height={21} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}