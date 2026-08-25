import { Metadata } from "next";
import MainWrapper from "@/components/wrapper/main-wrapper";
import ModernAgencyWrapper from "./_components/modern-agency-wrapper";
import HeroSix from "@/components/hero/hero-six";
import HeaderSix from "@/layout/header/header-six";
import WorkAreaFive from "@/components/work/work-area-5";
import CapabilitiesAreaTwo from "@/components/capabilities/capability-area-2";
import ParallaxImgTwo from "@/components/parallax-img/parallax-img-2";
import AwardAreaFour from "@/components/award/award-area-4";
import CtaAreaFive from "@/components/cta/cta-area-5";
import FooterThree from "@/layout/footer/footer-three";
import CustomCursor from "@/components/common/custom-cursor";

export const metadata: Metadata = {
  title: "Redox - modern Agency and Portfolio Next js Template",
  description:
    "Redox is a modern agency and portfolio template built with Next.js, designed to showcase your work and services effectively.",
};

export default function HomeModernAgencyPage() {
  return (
    <>
      {/* custom cursor start */}
      <CustomCursor />
      {/* custom cursor end */}

      {/* Header area start */}
      <HeaderSix />
      {/* Header area end */}

      {/* Main wrapper start */}
      <MainWrapper
        bodyCls={[
          "body-wrapper",
          "dark",
          "body-modern-agency",
          "font-heading-tartuffotrial-thin",
        ]}
      >
        <ModernAgencyWrapper>
          <main>

            {/* Hero area start */}
            <HeroSix />
            {/* Hero area end */}

            {/* work area start */}
            <WorkAreaFive />
            {/* work area end */}

            {/* capability area start */}
            <CapabilitiesAreaTwo />
            {/* capability area end */}

            {/* parallax view start */}
            <ParallaxImgTwo />
            {/* parallax view end */}

            {/* award area start */}
            <AwardAreaFour />
            {/* award area end */}

            {/* cta area start */}
            <CtaAreaFive />
            {/* cta area end */}

          </main>

          {/* Footer area start */}
          <FooterThree />
          {/* Footer area end */}
        </ModernAgencyWrapper>
      </MainWrapper>
      {/* Main wrapper end */}
    </>
  );
}
