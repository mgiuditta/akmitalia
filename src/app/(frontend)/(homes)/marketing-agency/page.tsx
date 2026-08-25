import { Metadata } from "next";
import Image from "next/image";
import MainWrapper from "@/components/wrapper/main-wrapper";
import MarketingAgencyWrapper from "./_components/marketing-agency-wrapper";
import HeaderThree from "@/layout/header/header-three";
import HeroThree from "@/components/hero/hero-three";
import ServiceAreaThree from "@/components/services/service-area-3";
import WorkAreaThree from "@/components/work/work-area-3";
import ApproachArea from "@/components/approach/approach-area";
import FunFactAreaTwo from "@/components/fun-fact/fun-fact-area-2";
import ClientAreaThree from "@/components/client/client-area-3";
import BlogArea from "@/components/blog/blog-area";
import CtaAreaThree from "@/components/cta/cta-area-3";
import FooterTwo from "@/layout/footer/footer-two";
import gallery_img from "@/assets/imgs/gallery/image-12.webp";
import CustomCursor from "@/components/common/custom-cursor";

export const metadata: Metadata = {
  title: "Redox - Marketing Agency and Portfolio Next js Template",
  description:
    "Redox is a marketing agency and portfolio template built with Next.js, designed to showcase your work and services effectively.",
};

export default function HomeMarketingAgencyPage() {
  return (
    <>

      {/* custom cursor start */}
      <CustomCursor />
      {/* custom cursor end */}

      {/* Header area start */}
      <HeaderThree />
      {/* Header area end */}

      {/* Main wrapper start */}
      <MainWrapper
        bodyCls={[
          "body-wrapper",
          "dark",
          "body-marketing-agency",
          "font-heading-sequelsans-romanbody",
        ]}
      >
        <MarketingAgencyWrapper>
          <main>
            {/* Hero area start */}
            <HeroThree />
            {/* Hero area end */}

            {/* image wrapper start */}
            <div className="image-wrapper fade-anim parallax-view">
              <Image
                className="w-100"
                src={gallery_img}
                alt="image"
                data-speed="0.8"
                style={{ height: "auto" }}
              />
            </div>
            {/* image wrapper end */}

            {/* service area start */}
            <ServiceAreaThree />
            {/* service area end */}

            {/* work area start */}
            <WorkAreaThree />
            {/* work area end */}

            {/* approach area start */}
            <ApproachArea />
            {/* approach area end */}

            {/* fun fact area start */}
            <FunFactAreaTwo />
            {/* fun fact area end */}

            {/* client area start */}
            <ClientAreaThree />
            {/* client area end */}

            {/* blog area start */}
            <BlogArea />
            {/* blog area end */}

            {/* cta area start */}
            <CtaAreaThree />
            {/* cta area end */}
          </main>

          {/* Footer area start */}
          <FooterTwo />
          {/* Footer area end */}
        </MarketingAgencyWrapper>
      </MainWrapper>
      {/* Main wrapper end */}
    </>
  );
}
