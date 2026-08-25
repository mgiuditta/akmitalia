import { Metadata } from "next";
import Image from "next/image";
import HeaderTwo from "@/layout/header/header-two";
import MainWrapper from "@/components/wrapper/main-wrapper";
import CreativeAgencyWrapper from "./_components/creative-agency-wrapper";
import HeroTwo from "@/components/hero/hero-two";
import AboutTwo from "@/components/about/about-two";
import WorkAreaTwo from "@/components/work/work-area-2";
import ActuallyArea from "@/components/actually/actually-area";
import ServiceAreaTwo from "@/components/services/service-area-2";
import TestimonialArea from "@/components/testimonial/testimonial-area";
import ClientSliderTwo from "@/components/client/client-area-2";
import AwardArea from "@/components/award/award-area";
import TeamArea from "@/components/team/team-area";
import CtaAreaTwo from "@/components/cta/cta-area-2";
import FooterTwo from "@/layout/footer/footer-two";
import shape from '@/assets/imgs/shape/shape-9.webp';
import shape_2 from '@/assets/imgs/shape/shape-8.svg';
import CustomCursor from "@/components/common/custom-cursor";

export const metadata: Metadata = {
  title: "Redox - Creative Agency and Portfolio Next js Template",
  description: "Redox is a creative agency and portfolio template built with Next.js, designed to showcase your work and services effectively.",
};

export default function HomeCreativeAgencyPage() {
  return (
    <>

      {/* custom cursor start */}
      <CustomCursor />
      {/* custom cursor end */}

      {/* Header area start */}
      <HeaderTwo />
      {/* Header area end */}

      {/* Main wrapper start */}
      <MainWrapper bodyCls={['body-wrapper', 'dark', 'body-creative-agency', 'font-heading-sequelsans-romanbody']}>
        <CreativeAgencyWrapper>
          <div>

            {/* body bg start */}
            <div className="body-bg">
              <div className="container large">
                <Image src={shape} alt="image" />
                <Image src={shape} alt="image" />
              </div>
            </div>
            {/* body bg end */}

            <main>

              {/* Hero area start */}
              <HeroTwo />
              {/* Hero area end */}

              {/* about area start */}
              <AboutTwo />
              {/* about area end */}

              {/* work area start */}
              <WorkAreaTwo />
              {/* work area end */}

              {/* actually area start */}
              <ActuallyArea />
              {/* actually area end */}

              {/* service area start */}
              <ServiceAreaTwo />
              {/* service area end */}

              {/* testimonial area start */}
              <TestimonialArea />
              {/* testimonial area end */}

              {/* client area start */}
              <ClientSliderTwo />
              {/* client area end */}

              {/* circular shape area start */}
              <div className="mb--1">
                <div className="circular-shape-wrapper">
                  <div className="shape-thumb">
                    <Image src={shape_2} alt="image" />
                  </div>
                </div>
              </div>
              {/* circular shape area end */}

              {/* Award area start */}
              <AwardArea />
              {/* Award area end */}

              {/* team area start */}
              <TeamArea />
              {/* team area end */}

              {/* cta area start */}
              <CtaAreaTwo />
              {/* cta area end */}

            </main>


            {/* Footer area start */}
            <FooterTwo />
            {/* Footer area end */}
          </div>

        </CreativeAgencyWrapper>
      </MainWrapper>
      {/* Main wrapper end */}
    </>
  );
}
