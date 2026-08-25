import { Metadata } from "next";
import HeaderTwo from "@/layout/header/header-two";
import MainWrapper from "@/components/wrapper/main-wrapper";
import FooterInner from "@/layout/footer/footer-inner";
import FaqWrapper from "./_components/faq-wrapper";
import PageTitle from "@/components/common/page-title";
import { AccordionWrapper } from "@/components/faq/faq-area";

export const metadata: Metadata = {
  title: "Faq Page - Redox Next js Template",
  description:
    "Redox is a agency and portfolio template built with Next.js, designed to showcase your work and services effectively.",
};

export default function FaqPage() {
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
        <FaqWrapper>
          <main>

            {/* page title area start */}
            <PageTitle title="Question" />
            {/* page title area end */}

            {/* faq area start */}
            <section className="faq-area-faq-page">
              <div className="container large">
                <div className="faq-area-faq-page-inner">
                  <div className="section-header fade-anim">
                    <div className="section-title-wrapper">
                      <div className="subtitle-wrapper">
                        <span className="section-subtitle">FAQ</span>
                      </div>
                      <div className="title-wrapper">
                        <h2 className="section-title font-sequelsans-romanbody">Learn some common
                          answers about newly
                          projects</h2>
                      </div>
                    </div>
                  </div>

                  {/* accordion wrapper */}
                  <AccordionWrapper />
                  {/* accordion wrapper */}

                </div>
              </div>
            </section>
            {/* faq area end */}

          </main>

          {/* Footer area start */}
          <FooterInner />
          {/* Footer area end */}
        </FaqWrapper>
      </MainWrapper>
      {/* Main wrapper end */}
    </>
  );
}
