import Image from "next/image";
import Link from "next/link";

const portfolioData = [
  {
    id: 1,
    title: "Saudi Lime Green",
    category: "Marketing",
    year: 2010,
    imageSrc: "/assets/imgs/project/image-69.webp",
  },
  {
    id: 2,
    title: "Panda Automap",
    category: "Branding",
    year: 2010,
    imageSrc: "/assets/imgs/project/image-70.webp",
  },
  {
    id: 3,
    title: "Saudi Venture Capital",
    category: "Graphics",
    year: 2010,
    imageSrc: "/assets/imgs/project/image-71.webp",
  },
  {
    id: 4,
    title: "Rebrand Lawberry",
    category: "Motion",
    year: 2010,
    imageSrc: "/assets/imgs/project/image-72.webp",
  },
  {
    id: 5,
    title: "Selicon Cloud Cave",
    category: "Design",
    year: 2010,
    imageSrc: "/assets/imgs/project/image-73.webp",
  },
  {
    id: 6,
    title: "Mountain Upwork",
    category: "UI Design",
    year: 2010,
    imageSrc: "/assets/imgs/project/image-74.webp",
  },
  {
    id: 7,
    title: "Blacky Motorola",
    category: "Branding",
    year: 2010,
    imageSrc: "/assets/imgs/project/image-75.webp",
  },
  {
    id: 8,
    title: "Lambax Nanak",
    category: "Graphics",
    year: 2010,
    imageSrc: "/assets/imgs/project/image-76.webp",
  },
  {
    id: 9,
    title: "Save Me Saudia",
    category: "Branding",
    year: 2010,
    imageSrc: "/assets/imgs/project/image-77.webp",
  },
  {
    id: 10,
    type: "button",
    buttonText: "Explore our all outstanding works (18)",
    buttonLink: "/portfolio",
  },
];

export default function WorkAreaFive() {
  return (
    <>
      <section className="work-area-7">
        <div className="work-area-7-inner">
          <div className="works-wrapper-box border-top-bottom">
            <div className="container large">
              <div className="works-wrapper-7">
                {portfolioData.map((item) => (
                  <div className="work-box" key={item.id}>
                    {item.type === "button" ? (
                      <div className="btn-wrapper fade-anim">
                        <Link href={item.buttonLink}>
                          <span className="underline">{item.buttonText}</span>
                        </Link>
                      </div>
                    ) : (
                      <div
                        className="thumb fade-anim"
                        data-cursor-text={`<div className="content">
                          <h3 class="title">
                            <a href="/portfolio-details">${item.title}</a>
                          </h3>
                          <span class="meta">${item.category}, ${item.year}</span>
                        </div>`}
                        data-cursor-text-portfolio
                      >
                        <div className="content">
                          <h3 className="title">
                            <Link href="/portfolio-details">{item.title}</Link>
                          </h3>
                          <span className="meta">{`${item.category}, ${item.year}`}</span>
                        </div>
                        {item.imageSrc && ( 
                          <div className="image scale">
                            <Link href="/portfolio-details">
                              <Image
                                src={item.imageSrc}
                                alt="image"
                                width={608}
                                height={708}
                                style={{height:'auto'}}
                              />
                            </Link>
                          </div>
                         )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
