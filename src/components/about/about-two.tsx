import Link from "next/link";

export default function AboutTwo() {
  return (
    <section className="about-area-2">
      <div className="container large">
        <div className="about-area-2-inner section-spacing-top">
          <div className="section-header">
            <div className="section-title-wrapper">
              <div className="title-wrapper">
                <h2 className="section-title font-sequelsans-romanbody rr_title_anim">
                  Creating virtual emotion in the universe, for the largest
                  brands & market since
                </h2>
              </div>
            </div>
          </div>
          <div className="section-content section-spacing-top">
            <div className="year-wrapper">
              <h2 className="year-since">
                <span className="is-fading">
                  <span className="first-text">2017</span> - 2025
                </span>
                <span className="last-text">Work</span>
              </h2>
            </div>
            <div className="text-wrapper">
              <p className="text">
                We help brands and people be part of the solution. As a
                cause-led branding and communications agency, we harness the
                power of technology and creativity to drive positive changes.
                Whether your inquiries are big or small, {"we're"} prepared to
                engage, focusing on complex problems
              </p>
            </div>
            <div className="btn-wrapper">
              <Link href="/about" className="rr-btn">
                <span className="btn-wrap">
                  <span className="text-one">Learn More</span>
                  <span className="text-two">Learn More</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



