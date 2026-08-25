import Image from "next/image";
import Link from "next/link";

interface FeaturedWorkItem {
  title: string;
  image: string;
  tag: string;
  thumbExtraClass?: string;
}

const featuredWorks: FeaturedWorkItem[] = [
  {
    title: "Saudi Venture Capital",
    image: "/assets/imgs/gallery/image-47.webp",
    tag: "Branding — 2014",
  },
  {
    title: "Saudi Lime Green",
    image: "/assets/imgs/gallery/image-48.webp",
    tag: "Branding — 2014",
    thumbExtraClass: "mt--150",
  },
  {
    title: "Wave Coxsheet",
    image: "/assets/imgs/gallery/image-49.webp",
    tag: "Branding — 2014",
  },
  {
    title: "Padro Alex Garoat",
    image: "/assets/imgs/gallery/image-50.webp",
    tag: "Branding — 2014",
  },
];

const PortfolioThreeWorkArea = () => {
  return (
    <section className="work-area-work-page">
      <div className="work-area-work-page-inner">
        <div className="works-wrapper-box">
          <div className="container large">
            <div className="featured-work-wrapper-2">
              {featuredWorks.map((work, index) => (
                <div key={index} className="featured-work-box fade-anim">
                  <div className={`thumb ${work.thumbExtraClass || ""}`}>
                    <span></span>
                    <div
                      className="image"
                      data-cursor-text="View"
                      data-cursor-text-red
                    >
                      <Link href="/portfolio-details">
                        <Image
                          src={work.image}
                          alt="port-img"
                          width={750}
                          height={900}
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
};

export default PortfolioThreeWorkArea;
