"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase, ScrollToPlugin, ScrollTrigger, SplitText } from "gsap/all";
import { approachAnimation } from "@/utils/approach-anim";
import { funFactAnimation } from "@/utils/fun-fact-anim";
import { hoverRevealImageAnimation, scaleAnim } from "@/utils/img-anim";
import { fadeAnimation, RRTitleAnimation } from "@/utils/title-anim";

type Props = {
  children: React.ReactNode;
};

export default function MarketingAgencyWrapper({ children }: Props) {
  useGSAP(() => {
    gsap.registerPlugin(CustomEase, ScrollToPlugin, SplitText, ScrollTrigger);
    const timer = setTimeout(() => {
      RRTitleAnimation();
      fadeAnimation();
      hoverRevealImageAnimation();
      scaleAnim();
      approachAnimation();
      funFactAnimation();
    }, 100);
    return () => clearTimeout(timer);
  }, {});
  return children;
}
