import Image from 'next/image'
import shape_3 from '@/assets/imgs/shape/shape-3.webp';
import shape_2 from '@/assets/imgs/shape/shape-2.webp';
import shape_1 from '@/assets/imgs/shape/shape-1.webp';

export default function HeroOne() {
  return (
    <section className="hero-area">
      <div className="container large">
        <div className="hero-area-inner section-spacing-top">
          <div className="hero-content section-spacing-bottom">
            <div
              className="award-wrapper fade-anim"
              data-delay="0.90"
              data-direction="left"
              data-ease="back.out(4)"
            >
              <div className="circle-text-wrapper">
                <div className="circle-text">
                  <Image
                    src={shape_3}
                    alt="image"
                    className="text"
                  />
                  <Image
                    src={shape_2}
                    alt="image"
                    className="icon"
                  />
                </div>
              </div>
            </div>
            <div className="section-header">
              <div className="section-title-wrapper">
                <div className="title-wrapper">
                  <h2
                    className="section-title font-instrumentsans-medium char-anim"
                    data-delay="0.45"
                  >
                    Let’s sharpen your brand with
                    <span>
                      <Image
                        className="title-shape-1 fade-anim"
                        src={shape_1}
                        alt="image"
                        data-direction="right"
                        data-delay="1.80"
                        style={{height:'auto'}}
                      />
                    </span>
                    quality work
                  </h2>
                </div>
              </div>
            </div>
            <div className="section-content">
              <div className="features-wrapper-box fade-anim" data-delay="0.75">
                <div className="features-wrapper">
                  <div className="feature-box">
                    <div className="content">
                      <span className="number">98%</span>
                      <p className="text">
                        Average clients satisfied and repeating
                      </p>
                    </div>
                  </div>
                  <div className="feature-box">
                    <div className="content">
                      <span className="number">120+</span>
                      <p className="text">
                        Successfully projects done in 24 countries
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-wrapper fade-anim" data-delay="0.75">
                <p className="text">
                  We’re a digital products design & development agency that works
                  passionately with the digital experiences.
                </p>
              </div>
            </div>
          </div>
          <div className="big-text-wrapper">
            <h2 className="big-text">Redox</h2>
          </div>
        </div>
      </div>
    </section>
  )
}
