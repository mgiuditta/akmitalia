"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase, ScrollToPlugin, ScrollTrigger, SplitText } from "gsap/all";
import { charAnimation, fadeAnimation, goVisibleAnimation, titleAnimation } from "@/utils/title-anim";
import { growAnimation, scaleAnim } from "@/utils/img-anim";
import { wordAnimation } from "@/utils/word-anim";
import { throwableAnimation } from "@/utils/throwable-anim";
import { ctaAnim } from "@/utils/cta-anim";

type Props = {
  children: React.ReactNode;
};

export default function DigitalAgencyWrapper({ children }: Props) {
  useGSAP(() => {
    gsap.registerPlugin(CustomEase, ScrollToPlugin,SplitText,ScrollTrigger);
    const timer = setTimeout(() => {
      titleAnimation();
      fadeAnimation();
      scaleAnim();
      growAnimation()
      goVisibleAnimation();
      wordAnimation();
      throwableAnimation();
      charAnimation();
      ctaAnim();
    }, 100);
    return () => clearTimeout(timer);
  }, {});
  return children;
}
