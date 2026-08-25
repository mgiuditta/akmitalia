import { Metadata } from "next";
import HeaderTwo from "@/layout/header/header-two";
import MainWrapper from "@/components/wrapper/main-wrapper";
import FooterInner from "@/layout/footer/footer-inner";
import FAQArea from "@/components/faq/faq-area";
import ServiceDetailsWrapper from "./_components/service-details-wrapper";
import ServiceDetailsHero from "./_components/service-details-hero";
import ServiceDetailsApproach from "./_components/service-details-approach";
import ServiceDetailsFeature from "./_components/service-details-feature";
import ServiceDetailsValueArea from "./_components/service-details-value-area";

export const metadata: Metadata = {
  title: "Services Details Page - Redox Next js Template",
  description:
    "Redox is a agency and portfolio template built with Next.js, designed to showcase your work and services effectively.",
};

export default function ServiceDetailsPage() {
  return (
    <>
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
        <ServiceDetailsWrapper>
          <main>

            {/* service details hero area start */}
            <ServiceDetailsHero />  
            {/* service details hero area end */}

            {/* service details approach area start */}
            <ServiceDetailsApproach />
            {/* service details approach area end */}

            {/* service details feature area start */}
            <ServiceDetailsFeature/>
            {/* service details feature area end */}

            {/* service details value area start */}
            <ServiceDetailsValueArea/>
            {/* service details value area end */}

            {/* service details faq area start */}
            <FAQArea />
            {/* service details faq area end */}

          </main>

          {/* Footer area start */}
          <FooterInner />
          {/* Footer area end */}
        </ServiceDetailsWrapper>
      </MainWrapper>
      {/* Main wrapper end */}
    </>
  );
}
