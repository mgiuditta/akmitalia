import { Metadata } from "next";
import MainWrapper from "@/components/wrapper/main-wrapper";
import StartupAgencyWrapper from "./_components/startup-agency-wrapper";
import HeaderFive from "@/layout/header/header-five";
import HeroFive from "@/components/hero/hero-five";
import WorkAreaFour from "@/components/work/work-area-4";
import MarqueeText from "@/components/marquee/marquee-text";
import AboutFour from "@/components/about/about-four";
import ServiceAreaFive from "@/components/services/service-area-5";
import CtaAreaFour from "@/components/cta/cta-area-4";
import FooterFour from "@/layout/footer/footer-four";
import CustomCursor from "@/components/common/custom-cursor";

export const metadata: Metadata = {
  title: "Redox - Startup Agency and Portfolio Next js Template",
  description:
    "Redox is a startup agency and portfolio template built with Next.js, designed to showcase your work and services effectively.",
};

export default function HomeStartupAgencyPage() {
  return (
    <>
      {/* custom cursor start */}
      <CustomCursor />
      {/* custom cursor end */}

      {/* Header area start */}
      <HeaderFive />
      {/* Header area end */}

      {/* Main wrapper start */}
      <MainWrapper
        bodyCls={[
          "body-wrapper",
          "dark",
          "body-startup-agency",
          "font-heading-bdogrotesk-regular",
        ]}
      >
        <StartupAgencyWrapper>
          <main>

            {/* Hero area start */}
            <HeroFive />
            {/* Hero area end */}

            {/* work area start */}
            <WorkAreaFour />
            {/* work area end */}

            {/* marquee area start */}
            <MarqueeText />
            {/* marquee area end */}

            {/* about area start */}
            <AboutFour />
            {/* about area end */}

            {/* service area start */}
            <ServiceAreaFive />
            {/* service area end */}

            {/* cta area start */}
            <CtaAreaFour />
            {/* cta area end*/}

          </main>

          {/* Footer area start */}
          <FooterFour />
          {/* Footer area end */}
        </StartupAgencyWrapper>
      </MainWrapper>
      {/* Main wrapper end */}
    </>
  );
}
