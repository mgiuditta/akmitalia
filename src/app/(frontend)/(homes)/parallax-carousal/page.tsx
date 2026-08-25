import { Metadata } from "next";
import MainWrapper from "@/components/wrapper/main-wrapper";
import ParallaxCarousel from "@/components/portfolio-slider/parallax-carousel";
import HeaderSix from "@/layout/header/header-six";
import CustomCursor from "@/components/common/custom-cursor";

export const metadata: Metadata = {
  title: "Redox - Prarallax Carousal and Portfolio Next js Template",
  description:
    "Redox is a agency and portfolio template built with Next.js, designed to showcase your work and services effectively.",
};

export default function ParallaxCarousalPage() {
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
          "body-parallax-carosole",
          "font-heading-bdogrotesk-regular",
        ]}
      >
        <main>

          {/* portfolio area start */}
          <ParallaxCarousel />
          {/* portfolio area end */}

        </main>

        {/* Footer area start */}
        {/* Footer area end */}
      </MainWrapper>
      {/* Main wrapper end */}
    </>
  );
}
