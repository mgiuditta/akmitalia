"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollToPlugin, ScrollTrigger } from "gsap/all";
import { fadeAnimation } from "@/utils/title-anim";
import { workAnimationTwo } from "@/utils/work-anim";

type Props = {
  children: React.ReactNode;
};

export default function PortfolioFourWrapper({ children }: Props) {
  useGSAP(() => {
    gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);
    const timer = setTimeout(() => {
      fadeAnimation();
      workAnimationTwo();
    }, 100);
    return () => clearTimeout(timer);
  }, {});
  return children;
}
