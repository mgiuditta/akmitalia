"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase, ScrollToPlugin, ScrollTrigger, SplitText } from "gsap/all";
import { charAnimation, fadeAnimation } from "@/utils/title-anim";
import { scaleAnim } from "@/utils/img-anim";

type Props = {
  children: React.ReactNode;
};

export default function ModernAgencyWrapper({ children }: Props) {
  useGSAP(() => {
    gsap.registerPlugin(CustomEase, ScrollToPlugin, SplitText, ScrollTrigger);
    const timer = setTimeout(() => {
      fadeAnimation();
      charAnimation();
      scaleAnim();
    }, 100);
    return () => clearTimeout(timer);
  }, {});
  return children;
}
