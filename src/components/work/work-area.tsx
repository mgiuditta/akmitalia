import Image from "next/image";
import Link from "next/link";

const WorkArea = () => {
  return (
    <div className="container large">
      <div className="work-area-inner">
        <div className="section-header fade-anim">
          <div className="section-title-wrapper">
            <div className="title-wrapper">
              <h2 className="section-title font-instrumentsans-medium">
                Featured Work
              </h2>
            </div>
          </div>
          <div className="text-wrapper">
            <p className="text">Excellency in creative designs</p>
          </div>
          <div className="total-count">
            <span className="number">(26)</span>
          </div>
        </div>
        <div className="works-wrapper-box">
          <div className="works-wrapper-1 fade-anim">
            {[
              {
                title: "Panda Automap",
                tag: "Development",
                image: "/assets/imgs/project/image-1.webp",
              },
              {
                title: "Saudi Venture Capital",
                tag: "Graphics",
                image: "/assets/imgs/project/image-2.webp",
              },
              {
                title: "Rebrand Lawberry",
                tag: "Motion, Design",
                image: "/assets/imgs/project/image-3.webp",
              },
              {
                title: "Selicon Cloud Cave",
                tag: "UI Design",
                image: "/assets/imgs/project/image-4.webp",
              },
              {
                title: "Mountain Upwork",
                tag: "Branding",
                image: "/assets/imgs/project/image-5.webp",
              },
              {
                title: "Blacky Motorola",
                tag: "UI Design",
                image: "/assets/imgs/project/image-6.webp",
              },
            ].map((work, index) => (
              <div key={index} className="work-box">
                <div className="thumb">
                  <div className="image scale" data-cursor-text="View Project">
                    <Link href="/portfolio-details">
                      <Image
                        src={work.image}
                        alt="image"
                        width={840}
                        height={580}
                        style={{ height: "auto" }}
                      />
                    </Link>
                  </div>
                </div>
                <div className="content">
                  <h3 className="title">
                    <Link href="/portfolio-details">{work.title}</Link>
                  </h3>
                  <div className="meta">
                    <span className="tag">{work.tag}</span>
                    <span className="date">2025</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="all-btn-wrapper fade-anim">
          <Link href="/portfolio" className="rr-btn btn-border hover-bg-theme">
            <span className="btn-wrap">
              <span className="text-one">View All Work</span>
              <span className="text-two">View All Work</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WorkArea;
