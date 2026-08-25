"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollToPlugin, ScrollTrigger } from "gsap/all";
import { fadeAnimation, textInvertWithScrollAnimation } from "@/utils/title-anim";
import { throwableAnimation } from "@/utils/throwable-anim";
import { growAnimation } from "@/utils/img-anim";

type Props = {
  children: React.ReactNode;
};

export default function ServiceWrapper({ children }: Props) {
  useGSAP(() => {
    gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);
    const timer = setTimeout(() => {
      fadeAnimation();
      throwableAnimation();
      growAnimation();
      textInvertWithScrollAnimation();
    }, 100);
    return () => clearTimeout(timer);
  }, {});
  return children;
}
