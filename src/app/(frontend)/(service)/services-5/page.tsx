import { Metadata } from "next";
import HeaderTwo from "@/layout/header/header-two";
import MainWrapper from "@/components/wrapper/main-wrapper";
import FooterInner from "@/layout/footer/footer-inner";
import PageTitle from "@/components/common/page-title";
import ServiceFiveWrapper from "./_components/service-5-wrapper";
import ClientAreaFour from "@/components/client/client-area-4";
import ServiceContentWrapper from "@/components/services/service-content-wrapper";
import ServiceAreaFive from "@/components/services/service-area-5";

export const metadata: Metadata = {
  title: "Services Five Page - Redox Next js Template",
  description:
    "Redox is a agency and portfolio template built with Next.js, designed to showcase your work and services effectively.",
};

export default function ServicesFivePage() {
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
        <ServiceFiveWrapper>
          <main>
            {/* page title area start */}
            <PageTitle title="Expertise" />
            {/* page title area end */}

            {/* services area start */}
            <section className="service-area-service-page">
              <div className="service-area-service-page-inner">
                <ServiceAreaFive
                  spacing=""
                  title_font="font-sequelsans-romanbody"
                />
                <div className="container large">
                  <ServiceContentWrapper />
                </div>
              </div>
            </section>
            {/* services area end */}

            {/* client area start  */}
            <ClientAreaFour />
            {/* client area end  */}
          </main>

          {/* Footer area start */}
          <FooterInner />
          {/* Footer area end */}
        </ServiceFiveWrapper>
      </MainWrapper>
      {/* Main wrapper end */}
    </>
  );
}
