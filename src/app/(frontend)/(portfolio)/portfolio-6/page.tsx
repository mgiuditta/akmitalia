import { Metadata } from "next";
import HeaderTwo from "@/layout/header/header-two";
import MainWrapper from "@/components/wrapper/main-wrapper";
import FooterInner from "@/layout/footer/footer-inner";
import PortfolioWrapper from "./_components/portfolio-6-wrapper";
import PageTitle from "@/components/common/page-title";
import PortfolioSixArea from "./_components/portfolio-6-area";
import CustomCursor from "@/components/common/custom-cursor";


export const metadata: Metadata = {
  title: "Portfolio six Page - Redox Next js Template",
  description:
    "Redox is a agency and portfolio template built with Next.js, designed to showcase your work and services effectively.",
};

export default function PortfolioSixPage() {
  return (
    <>
      {/* custom cursor start */}
      <CustomCursor />
      {/* custom cursor end */}

      {/* Header area start */}
      <HeaderTwo />
      {/* Header area end */}

      {/* Main wrapper start */}
      <MainWrapper
        bodyCls={[
          "body-wrapper",
          "dark",
          "body-page-inner",
          "font-heading-sequelsans-romanbody",
        ]}
      >
        <PortfolioWrapper>
          <main>
            {/* page title area start */}
            <PageTitle title="Portfolio" />
            {/* page title area end */}

            {/* portfolio area start */}
            <PortfolioSixArea />
            {/* portfolio area end */}

          </main>

          {/* Footer area start */}
          <FooterInner />
          {/* Footer area end */}
        </PortfolioWrapper>
      </MainWrapper>
      {/* Main wrapper end */}
    </>
  );
}
