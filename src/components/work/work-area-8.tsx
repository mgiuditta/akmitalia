import Image from "next/image";
import Link from "next/link";
type WorkItem = {
  title: string;
  image: string;
  date: string;
  tag: string;
};

const worksData: WorkItem[] = [
  {
    title: "Harash Denmark",
    image: "/assets/imgs/project/image-19.webp",
    date: "2010",
    tag: "Branding",
  },
  {
    title: "Saudi Lime Green",
    image: "/assets/imgs/project/image-20.webp",
    date: "2010",
    tag: "Marketing",
  },
  {
    title: "Saudi Venture Capital",
    image: "/assets/imgs/project/image-21.webp",
    date: "2010",
    tag: "Marketing",
  },
  {
    title: "Nilachal Network",
    image: "/assets/imgs/project/image-22.webp",
    date: "2010",
    tag: "Marketing",
  },
  {
    title: "Royal Cash App",
    image: "/assets/imgs/project/image-23.webp",
    date: "2010",
    tag: "Design",
  },
  {
    title: "Mashup Gradient",
    image: "/assets/imgs/project/image-24.webp",
    date: "2010",
    tag: "Design",
  },
  {
    title: "House of Shapes",
    image: "/assets/imgs/project/image-25.webp",
    date: "2010",
    tag: "Marketing",
  },
  {
    title: "Ocean Harmony",
    image: "/assets/imgs/project/image-26.webp",
    date: "2010",
    tag: "Branding",
  },
  {
    title: "Wave Coxsheet",
    image: "/assets/imgs/project/image-27.webp",
    date: "2010",
    tag: "Design",
  },
  {
    title: "Padro Alex Garoat",
    image: "/assets/imgs/project/image-28.webp",
    date: "2010",
    tag: "Branding",
  },
];

const WorkAreaEight = () => {
  return (
    <section className="work-area-work-page">
      <div className="work-area-work-page-inner">
        <div className="container large">
          {/* Section Header */}
          <div className="section-header fade-anim">
            <div className="section-title-wrapper">
              <div className="subtitle-wrapper">
                <span className="section-subtitle">Recent work</span>
              </div>
              <div className="title-wrapper">
                <h2 className="section-title font-sequelsans-romanbody">
                  Creative works
                  <br /> with our incredible
                  <br /> people.
                </h2>
              </div>
            </div>
          </div>

          {/* Section Content */}
          <div className="section-content-wrapper fade-anim">
            <div className="info-list">
              <ul>
                <li>Design</li>
                <li>Development</li>
                <li>Marketing</li>
                <li>Writing</li>
              </ul>
            </div>
            <div className="section-content">
              <div className="text-wrapper" data-direction="right">
                <p className="text">
                  We take a comprehensive approach to the creation and
                  development of brands. We help local companies and services
                  enter the market, and well-known brands expand an audience.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Works Grid */}
        <div className="works-wrapper-box">
          <div className="container large">
            <div className="works-wrapper-8">
              {worksData.map((work, index) => (
                <div className="work-box" key={index}>
                  <div className="thumb">
                    <div
                      className="image scale"
                      data-cursor-text="View Project"
                    >
                      <Link href="/portfolio-details">
                        <Image src={work.image} alt={work.title} width={900} height={630} style={{height:'auto'}} />
                      </Link>
                    </div>
                  </div>
                  <div className="content">
                    <h3 className="title">
                      <Link href="/portfolio-details">{work.title}</Link>
                    </h3>
                    <div className="meta">
                      <span className="date">{work.date}</span>
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

export default WorkAreaEight;
