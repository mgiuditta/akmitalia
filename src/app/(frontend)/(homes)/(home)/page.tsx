import AboutOne from "@/components/about/about-one";
import CtaArea from "@/components/cta/cta-area";
import FunFactArea from "@/components/fun-fact/fun-fact-area";
import HeroOne from "@/components/hero/hero-one";
import ProductivityArea from "@/components/productivity/productivity-area";
import ServiceArea from "@/components/services/service-area";
import TextSlider from "@/components/text-slider/text-slider";
import VideoBox from "@/components/video/video-box";
import WorkArea from "@/components/work/work-area";
import MainWrapper from "@/components/wrapper/main-wrapper";
import Footer from "@/layout/footer/footer-one";
import Header from "@/layout/header/header-one";
import DigitalAgencyWrapper from "./_components/digital-agency-wrapper";
import CustomCursor from "@/components/common/custom-cursor";

export default function HomePage() {
  return (
    <>

      {/* custom cursor start */}
      <CustomCursor />
      {/* custom cursor end */}

      {/* Header area start */}
      <Header />
      {/* Header area end */}

      {/* Main wrapper start */}
      <MainWrapper bodyCls={['body-wrapper', 'dark', 'body-digital-agency', 'font-heading-instrumentsans-medium']}>
        <DigitalAgencyWrapper>
          <main>

            {/* Hero area start */}
            <HeroOne />
            {/* Hero area end */}

            {/* About area start */}
            <AboutOne />
            {/* About area end */}

            {/* Video area start */}
            <VideoBox />
            {/* Video area end */}

            {/* Work area start */}
            <section className="work-area">
              {/* Text slider start */}
              <TextSlider />
              {/* Text slider end */}

              {/* Work area start */}
              <WorkArea />
              {/* Work area end */}
            </section>
            {/* Work area end */}

            {/* Service area start */}
            <ServiceArea />
            {/* Service area end */}

            {/* Fun fact area start */}
            <FunFactArea />
            {/* Fun fact area end */}

            {/* Cta area start */}
            <CtaArea />
            {/* Cta area end */}

            {/* Productivity area start */}
            <ProductivityArea />
            {/* Productivity area end */}
          </main>

          {/* Footer area start */}
          <Footer />
          {/* Footer area end */}
        </DigitalAgencyWrapper>
      </MainWrapper>
      {/* Main wrapper end */}
    </>
  );
}
