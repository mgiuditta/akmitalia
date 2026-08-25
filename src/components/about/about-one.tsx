import Link from "next/link";


export default function AboutOne() {
  return (
    <section className="about-area">
      <div className="container large">
        <div className="about-area-inner section-spacing">
          <div className="section-content">
            <div className="shape-1"></div>
            <div className="shape-2"></div>
            <div className="shape-3"></div>
            <div className="shape-4"></div>
            <div className="section-title-wrapper">
              <div className="title-wrapper">
                <h2 className="section-title font-instrumentsans-medium">Redox</h2>
              </div>
            </div>
            <div className="text-wrapper">
              <p className="text">We’re a dynamic startup agency specializing in innovative solutions for businesses
                looking to elevate their brand presence. We offer a range of services including digital marketing,
                branding, web development, and creative strategy to help company</p>
            </div>
            <div className="btn-wrapper ">
              <Link href="/contact" className="rr-btn  btn-text-fli hover-bg-theme">
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
  )
}
