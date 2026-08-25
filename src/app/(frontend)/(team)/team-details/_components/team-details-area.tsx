import Image from "next/image";
import team_img from "@/assets/imgs/team/team-14.webp";

export default function TeamDetailsArea() {
  return (
    <section className="team-details-area">
      <div className="container">
        <div className="team-details-area-inner section-spacing-top">
          <div className="section-content-wrapper fade-anim">
            <div className="team-thumb">
              <Image src={team_img} alt="image" style={{height:'auto'}} />
            </div>
            <div className="section-content">
              <div className="section-title-wrapper">
                <div className="title-wrapper">
                  <h2 className="section-title font-sequelsans-romanbody">
                    Jared Silverman
                  </h2>
                </div>
                <div className="subtitle-wrapper">
                  <span className="section-subtitle">Java Developer</span>
                </div>
              </div>
              <div className="text-wrapper">
                <p className="text">I’m leading experts in disciplines ranging from data science and neural networks
                  to low-level devices, software engineering, and architecture.</p>
                <p className="text">By combining our strong experience in AI-enriched technology areas and product
                  development mindset, we provide unique smart products co-creation services enabling cities,
                  industries, and people to make their way into a new era of the digital efficiently and securely.
                </p>
              </div>
              <div className="social-links">
                <a href="#">Facebook</a>
                <a href="#">Twitter</a>
                <a href="#">Dribbble</a>
                <a href="#">LinkedIn</a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
