import { Metadata } from "next";
import MainWrapper from "@/components/wrapper/main-wrapper";
import AgencyPortfolioWrapper from "./_components/agency-portfolio-wrapper";
import HeaderSeven from "@/layout/header/header-seven";
import HeroSeven from "@/components/hero/hero-seven";
import WorkAreaSix from "@/components/work/work-area-6";
import FooterFive from "@/layout/footer/footer-five";
import CustomCursor from "@/components/common/custom-cursor";

export const metadata: Metadata = {
  title: "Redox - Agency Portfolio Next js Template",
  description:
    "Redox is a agency portfolio template built with Next.js, designed to showcase your work and services effectively.",
};


export default function AgencyPortfolioPage() {
  return (
    <>
      {/* custom cursor start */}
      <CustomCursor />
      {/* custom cursor end */}

      {/* Header area start */}
      <HeaderSeven />
      {/* Header area end */}

      {/* Main wrapper start */}
      <MainWrapper
        bodyCls={[
          "body-wrapper",
          "dark",
          "body-portfolio-agency",
          "font-heading-bdogrotesk-regular",
        ]}
      >
        <AgencyPortfolioWrapper>
          <main>

            {/* Hero area start */}
            <HeroSeven />
            {/* Hero area end */}

            {/* work area start */}
            <WorkAreaSix />
            {/* work area end */}

          </main>

          {/* Footer area start */}
          <FooterFive />
          {/* Footer area end */}
        </AgencyPortfolioWrapper>
      </MainWrapper>
      {/* Main wrapper end */}
    </>
  );
}
