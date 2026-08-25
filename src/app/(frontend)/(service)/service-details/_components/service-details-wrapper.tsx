"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollToPlugin, ScrollTrigger } from "gsap/all";
import { fadeAnimation } from "@/utils/title-anim";
import { approachAnimationTwo } from "@/utils/approach-anim";

type Props = {
  children: React.ReactNode;
};

export default function ServiceDetailsWrapper({ children }: Props) {
  useGSAP(() => {
    gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);
    const timer = setTimeout(() => {
      fadeAnimation();
      approachAnimationTwo();
    }, 100);
    return () => clearTimeout(timer);
  }, {});
  return children;
}
