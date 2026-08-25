"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase, ScrollToPlugin, ScrollTrigger, SplitText } from "gsap/all";
import {
  charAnimation,
  fadeAnimation,
  RRTitleAnimation,
  textInvertWithScrollAnimation,
  titleAnimation,
} from "@/utils/title-anim";
import { movingTestimonial } from "@/utils/testimonial-anim";
import { circularAnim } from "@/utils/circular-anim";
import { serviceAnimation } from "@/utils/service-anim";
import { ctaAnim } from "@/utils/cta-anim";
import { aboutAnim } from "@/utils/about-anim";
import { workAnimation } from "@/utils/work-anim";

type Props = {
  children: React.ReactNode;
};

export default function CreativeAgencyWrapper({ children }: Props) {
  useGSAP(() => {
    gsap.registerPlugin(CustomEase, ScrollToPlugin, SplitText, ScrollTrigger);
    const timer = setTimeout(() => {
      RRTitleAnimation();
      charAnimation();
      movingTestimonial();
      circularAnim();
      serviceAnimation();
      ctaAnim();
      aboutAnim();
      workAnimation();
      titleAnimation();
      fadeAnimation();
      textInvertWithScrollAnimation();
    }, 100);
    return () => clearTimeout(timer);
  }, {});
  return children;
}
