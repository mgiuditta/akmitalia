"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollToPlugin, ScrollTrigger } from "gsap/all";
import { fadeAnimation, textInvertWithScrollAnimation } from "@/utils/title-anim";
import { throwableAnimation } from "@/utils/throwable-anim";

type Props = {
  children: React.ReactNode;
};

export default function ServiceFiveWrapper({ children }: Props) {
  useGSAP(() => {
    gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);
    const timer = setTimeout(() => {
      fadeAnimation();
      throwableAnimation();
      textInvertWithScrollAnimation();
    }, 100);
    return () => clearTimeout(timer);
  }, {});
  return children;
}
