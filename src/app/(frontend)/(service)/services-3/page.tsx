import { Metadata } from "next";
import HeaderTwo from "@/layout/header/header-two";
import MainWrapper from "@/components/wrapper/main-wrapper";
import FooterInner from "@/layout/footer/footer-inner";
import PageTitle from "@/components/common/page-title";
import ServiceThreeWrapper from "./_components/service-three-wrapper";
import ClientAreaFour from "@/components/client/client-area-4";
import { ServiceThreeWrapperArea } from "@/components/services/service-area-3";
import ServiceContentWrapper from "@/components/services/service-content-wrapper";

export const metadata: Metadata = {
  title: "Services Three Page - Redox Next js Template",
  description:
    "Redox is a agency and portfolio template built with Next.js, designed to showcase your work and services effectively.",
};

export default function ServicesThreePage() {
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
        <ServiceThreeWrapper>
          <main>
            {/* page title area start */}
            <PageTitle title="Expertise" />
            {/* page title area end */}

            {/* services area start */}
            <section className="service-area-service-page">
              <div className="container large">
                <div className="service-area-service-page-inner">
                  <div className="section-header fade-anim">
                    <div className="section-title-wrapper">
                      <div className="subtitle-wrapper">
                        <span className="section-subtitle">Capabilities</span>
                      </div>
                      <div className="title-wrapper">
                        <h2 className="section-title font-sequelsans-romanbody">We think out of the
                          box when it comes
                          to creative</h2>
                      </div>
                    </div>
                  </div>
                  <div className="services-wrapper-box fade-anim">
                    <ServiceThreeWrapperArea />
                  </div>

                  {/* service content wrapper */}
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
        </ServiceThreeWrapper>
      </MainWrapper>
      {/* Main wrapper end */}
    </>
  );
}
