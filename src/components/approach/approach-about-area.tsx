import Image from "next/image";
import shape from "@/assets/imgs/shape/shape-13.webp";

export default function ApproachAboutArea() {
  return (
    <section className="approach-area-about-page">
      <div className="container large">
        <div className="approach-area-about-page-inner section-spacing">
          <div className="section-header fade-anim">
            <div className="section-title-wrapper">
              <div className="subtitle-wrapper">
                <span className="section-subtitle">Approach</span>
              </div>
              <div className="title-wrapper">
                <h2 className="section-title font-sequelsans-romanbody">
                  Method of making better result
                </h2>
              </div>
            </div>
          </div>
          <div className="approach-wrapper-box">
            <div className="approach-wrapper fade-anim">
              <div className="approach-box">
                <h2 className="title">
                  Problem <br />
                  discovery{" "}
                  <Image src={shape} alt="image" />
                </h2>
                <div className="approach-list">
                  <ul>
                    <li>Usability Studies</li>
                    <li>User Interviews</li>
                    <li>Stakeholder Interviews</li>
                    <li>Competitive Research</li>
                    <li>Insights Report</li>
                    <li>User Journey</li>
                  </ul>
                </div>
              </div>
              <div className="approach-box">
                <h2 className="title">
                  Design <br />
                  system ready{" "}
                  <Image src={shape} alt="image" />
                </h2>
                <div className="approach-list">
                  <ul>
                    <li>Thinking Workshops</li>
                    <li>Sitemaps</li>
                    <li>Concepts</li>
                    <li>Designs</li>
                    <li>Prototypes</li>
                    <li>Usability Studies</li>
                  </ul>
                </div>
              </div>
              <div className="approach-box">
                <h2 className="title">
                  Design <br />
                  implementation{" "}
                </h2>
                <div className="approach-list">
                  <ul>
                    <li>Design</li>
                    <li>Use Cases</li>
                    <li>User Flows</li>
                    <li>Various User Types</li>
                    <li>Annotations</li>
                    <li>Interactions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
