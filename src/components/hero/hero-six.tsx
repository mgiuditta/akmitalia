import Link from "next/link";

export default function HeroSix() {
  return (
    <div className="hero-area-7">
      <div className="hero-area-7-inner">
        <div className="section-content">
          <div className="section-title-wrapper">
            <div className="container large">
              <div className="title-wrapper">
                <h2 className="section-title font-tartuffotrial-thin char-anim">
                  We’re Redox, a creative design agency based in {" "}
                  <span>Germany</span>
                </h2>
              </div>
            </div>
          </div>
          <div className="container large">
            <div className="text-wrapper fade-anim" data-delay="0.90">
              <p className="text">
                We are a duo of design obsessed who strive to push the
                boundaries of what is possible.
              </p>
            </div>
            <div className="btn-wrapper fade-anim">
              <Link href="/about" className="rr-btn">
                <span className="btn-wrap">
                  <span className="text-one">Learn more us</span>
                  <span className="text-two">Learn more us</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
