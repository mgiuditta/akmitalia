import Link from "next/link";
import React from "react";

type WorkItem = {
  image: string;
  extraClasses?: string;
};

const workItems: WorkItem[] = [
  { image: "/assets/imgs/project/image-52.webp" },
  { image: "/assets/imgs/project/image-53.webp" },
  { image: "/assets/imgs/project/image-54.webp" },
  { image: "/assets/imgs/project/image-55.webp", extraClasses: "grid-column-start-2" },
  { image: "/assets/imgs/project/image-56.webp" },
  { image: "/assets/imgs/project/image-57.webp" },
  { image: "/assets/imgs/project/image-58.webp" },
  { image: "/assets/imgs/project/image-59.webp" },
  { image: "/assets/imgs/project/image-60.webp" },
  { image: "/assets/imgs/project/image-61.webp" },
  { image: "/assets/imgs/project/image-62.webp" },
  { image: "/assets/imgs/project/image-63.webp" },
  { image: "/assets/imgs/project/image-64.webp", extraClasses: "grid-column-start-2" },
  { image: "/assets/imgs/project/image-65.webp" },
  { image: "/assets/imgs/project/image-66.webp", extraClasses: "grid-column-start-1" },
  { image: "/assets/imgs/project/image-67.webp", extraClasses: "grid-column-start-3" },
  { image: "/assets/imgs/project/image-68.webp" }
];

const PortfolioFourWorks = () => {
  return (
    <div className="work-area-work-page">
      <div className="work-area-work-page-inner">
        <div className="works-wrapper-box">
          <div className="container large">
            <div className="works-wrapper-5">
              {workItems.map((item, index) => (
                <Link
                  key={index}
                  href="/portfolio-details"
                  className={`work-box card-wrap fade-anim ${item.extraClasses || ""}`}
                  data-image={item.image}
                >
                  <div className="card">
                    <div className="card-bg"></div>
                    <div className="thumb"></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioFourWorks;
