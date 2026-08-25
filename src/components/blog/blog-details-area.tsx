import Image from "next/image";
import gallery_img from '@/assets/imgs/gallery/image-35.webp';
import gallery_img_2 from '@/assets/imgs/gallery/image-36.webp';
import gallery_img_3 from '@/assets/imgs/gallery/image-37.webp';
import gallery_img_4 from '@/assets/imgs/gallery/image-38.webp';


export default function BlogDetailsArea() {
  return (
    <section className="blog-details-area">
      <div className="blog-details-area-inner section-spacing-top">
        <div className="container large">
          <div className="section-header fade-anim">
            <div className="section-title-wrapper">
              <div className="title-wrapper">
                <h2 className="section-title font-sequelsans-romanbody">
                  Various ideas and creative concepts based on market research
                </h2>
              </div>
            </div>
            <div className="meta">
              <span className="name">
                By <span>Jerry</span>
              </span>
              <span className="tag has-left-line">Business</span>
              <span className="date has-left-line">2023</span>
            </div>
          </div>
        </div>
        <div className="image-wrapper parallax-view fade-anim">
          <Image
            className="w-100"
            src={gallery_img}
            alt="image"
            data-speed="0.8"
            style={{ height: "auto" }}
          />
        </div>
        <div className="container">
          <div className="section-details fade-anim">
            <div className="text-wrapper">
              <p className="text">
                Myriam was first trained as a sculptor in Montreal and then in
                Helsinki, Finland. She is now based in Quebec but works for
                clients all around the globe. From textile design to murals,
                editorial illustrations and book covers, her style is recognized
                by her simple and perfectly arranged shapes as well as her rich
                and vibrant color palette. Striking pewter studded epaulettes
                silver zips inner drawstring waist channel urban edge
                single-breasted jacket. There are several reasons why a business
                would consider a rebrand
              </p>
            </div>
            <div className="details-info">
              <h3 className="title">Typography Hierarchy</h3>
              <div className="text-wrapper">
                <p className="text">
                  Always ready to push the boundaries, especially when it comes
                  to our own platform, Our analytical eye to create a site that
                  was visually engaging and also optimized for maximum
                  performance. It also perfectly reflects the journey to help it
                  tell a story to increase its understanding and drive action.
                </p>
              </div>
              <div className="thumb-text-wrapper">
                <div className="thumb parallax-view">
                  <Image
                    src={gallery_img_2}
                    alt="image"
                    data-speed="0.8"
                    style={{ height: "auto" }}
                  />
                </div>
                <div className="text-wrapper">
                  <p className="text">
                    Beckoning a diverse audience of food lovers who may have
                    never considered trying dumplings before. The unique blend
                    of bold quirkiness and personality sets this brand apart,
                    marking its own distinct place in the crowded world of bold
                    font family. We love to bring designs to life as a
                    developer, and I aim to do this using whatever front end
                    tools are necessary.
                  </p>
                  <p className="text">
                    Structured gripped tape invisible molded cups for support
                    firm hold strong power mesh front liner sport detail. Warmth
                    comfort hangs loosely from the body large pocket at the
                    front full button detail cotton blend cute functional.
                    Bodycon skirts bright primary colors punchy palette. Visual
                    hierarchy is the principle of arranging elements to show
                    their order of importance. information easily. By laying out
                    elements logically and strategically damage.
                  </p>
                </div>
              </div>
            </div>
            <div className="details-info">
              <h3 className="title">Visual Hierarchy</h3>
              <div className="text-wrapper">
                <p className="text">
                  We had observers go into the workplace and we timed people’s
                  activities to the second. We’ve been to various workplaces,
                  all high-tech companies. We wanted to look at information
                  workers. We had observers shadow each person for three and a
                  half days each and timed every activity to the second.
                </p>
              </div>
              <div className="feature-list">
                <ul>
                  <li>Create the table lines here </li>
                  <li>Organize everything early thoroughly</li>
                  <li>Development</li>
                  <li>Shopify Development</li>
                </ul>
              </div>
              <div className="text-wrapper">
                <p className="text">
                  Achieving deep work should be our goal in any team, but doing
                  it in an office setting can be challenging because of so many
                  distractions. Asynchronous communication in a remote setting
                  is perfect for it. I’m not a fan of long reads with too many
                  unnecessary details, so I’ll “jump” into the subject right
                  away. My guide consists of several parts; thus, you can stop
                  reading at any point when you understand that what you have
                  learned so far covers your needs at the moment, and you can go
                  back/or jump forward to any section when you want to refresh
                  your memory or learn about the more complex workflows. Let’s
                  go and do that!
                </p>
              </div>
            </div>
            <div className="details-info">
              <h3 className="title">UX Principal</h3>
              <div className="text-wrapper">
                <p className="text">
                  Always ready to push the boundaries, especially when it comes
                  to our own platform, Our analytical eye to create a site that
                  was visually engaging and also optimized for maximum
                  performance. It also perfectly reflects the journey to help it
                  tell a story to increase its understanding and drive action.
                </p>
              </div>
              <div className="gallery-wrapper">
                <div className="image parallax-view">
                  <Image
                    src={gallery_img_3}
                    alt="image"
                    data-speed="0.8"
                    style={{ height: "auto" }}
                  />
                </div>
                <div className="image parallax-view">
                  <Image
                    src={gallery_img_4}
                    alt="image"
                    data-speed="0.8"
                    style={{ height: "auto" }}
                  />
                </div>
              </div>
              <div className="text-wrapper">
                <p className="text">
                  Beckoning a diverse audience of food lovers who may have never
                  considered trying dumplings before. The unique blend of bold
                  quirkiness and personality sets this brand apart, marking its
                  own distinct place in the crowded world of bold font family.
                  We love to bring designs to life as a developer, and I aim to
                  do this using whatever front end tools are necessary.
                </p>
                <p className="text">
                  Structured gripped tape invisible moulded cups for sauppor
                  firm hold strong powermesh front liner sport detail. Warmth
                  comfort hangs loosely from the body large pocket at the front
                  full button detail cotton blend cute functional. Bodycon
                  skirts bright primary colours punchy palette. By working
                  closely with you, understanding your vision
                </p>
              </div>
            </div>
            <div className="tags-wrapper">
              <span className="heading">Tags:</span>
              <div className="tags">
                <span className="tag">Startup</span>
                <span className="tag">UI Design</span>
                <span className="tag">Concept</span>
              </div>
            </div>
            <div className="comment-wrap">
              <h3 className="title">Leave a reply</h3>
              <form action="#">
                <div className="comment-formwrap">
                  <div className="comment-formfield">
                    <input
                      type="text"
                      name="Name"
                      id="Name"
                      placeholder="Name*"
                    />
                  </div>
                  <div className="comment-formfield">
                    <input
                      type="text"
                      name="Email"
                      id="Email"
                      placeholder="Email*"
                    />
                  </div>
                  <div className="comment-formfield message">
                    <input
                      type="text"
                      name="Message"
                      id="Message"
                      placeholder="Message*"
                    />
                  </div>
                </div>
                <div className="submit-btn">
                  <button type="submit" className="rr-btn">
                    <span className="btn-wrap">
                      <span className="text-one">Send Us Now</span>
                      <span className="text-two">Send Us Now</span>
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
