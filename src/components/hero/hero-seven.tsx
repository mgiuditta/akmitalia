import React from "react";

export default function HeroSeven() {
  return (
    <section className="hero-area-6">
      <div className="container large">
        <div className="hero-area-6-wrapper">
          <div className="hero-area-6-wrapper__line">
            <div className="contentt"></div>
            <div className="hero-area-6-inner">
              <div className="section-content-wrapper">
                <div className="section-content">
                  <div className="section-title-wrapper">
                    <div className="title-wrapper">
                      <h1 className="section-title">
                          <span className="line">Art</span>
                          <span className="line">Direction</span>

                          <span className="line"><span className="plus">+</span>
                              <span>Design</span>
                          </span>
                      </h1>
                    </div>
                  </div>
                </div>
                <div className="hero-video-wrapper">
                  <div className="hero-video">
                    <video
                      className="title-video"
                      loop
                      muted
                      autoPlay
                      playsInline
                    >
                      <source
                        src="https://rrdevs.net/project-video/xfire.webm"
                        type="video/mp4"
                      />
                    </video>
                  </div>
                  <p className="text">
                    Redox is the first and only branding studio for your real
                    exploration. You can realize digital beautifully designed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
