import { Metadata } from "next";
import HeaderTwo from "@/layout/header/header-two";
import MainWrapper from "@/components/wrapper/main-wrapper";
import FooterInner from "@/layout/footer/footer-inner";
import TeamWrapper from "./_components/team-wrapper";
import PageTitle from "@/components/common/page-title";
import TeamHeaderArea from "./_components/team-header-area";
import { TeamWrapperArea } from "@/components/team/team-area";
import { TeamListWrapper } from "@/components/team/team-list-area";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Team Page - Redox Next js Template",
  description:
    "Redox is a agency and portfolio template built with Next.js, designed to showcase your work and services effectively.",
};

export default function TeamPage() {
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
        <TeamWrapper>
          <main>
            {/* page title area start */}
            <PageTitle title="Our Team" />
            {/* page title area end */}

            {/* team header area start */}
            <TeamHeaderArea />
            {/* team header area end */}

            {/* team area start */}
            <section className="team-area">
              <div className="container large">
                <div className="team-area-inner">
                  <div className="team-wrapper-box fade-anim">
                    <TeamWrapperArea />
                  </div>
                </div>
              </div>
            </section>
            {/* team area end */}

            {/* team list area start */}
            <div className="team-list-area">
              <div className="container large">
                <div className="team-list-area-inner">
                  <div className="team-wrapper-box fade-anim">
                    <TeamListWrapper />
                  </div>
                </div>
              </div>
            </div>
            {/* team list area end */}

            {/* cta area start */}
            <section className="cta-area-team-page">
              <div className="container large">
                <div className="cta-area-team-page-inner section-spacing-top">
                  <div className="section-content fade-anim">
                    <div className="section-title-wrapper">
                      <div className="title-wrapper">
                        <h2 className="section-title font-sequelsans-romanbody">We think out of the box when it comes
                          to strategy, design and creative. Want to join
                          the talented team?</h2>
                      </div>
                    </div>
                    <div className="btn-wrapper">
                      <Link href="/contact" className="rr-btn">
                        <span className="btn-wrap">
                          <span className="text-one">Send Us Now</span>
                          <span className="text-two">Send Us Now</span>
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* cta area end */}

          </main>

          {/* Footer area start */}
          <FooterInner />
          {/* Footer area end */}
        </TeamWrapper>
      </MainWrapper>
      {/* Main wrapper end */}
    </>
  );
}
