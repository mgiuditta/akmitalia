"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollToPlugin, ScrollTrigger } from "gsap/all";
import { fadeAnimation } from "@/utils/title-anim";
import { movingGallery } from "@/utils/moving-anim";

type Props = {
  children: React.ReactNode;
};

export default function AboutWrapper({ children }: Props) {
  useGSAP(() => {
    gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);
    const timer = setTimeout(() => {
      fadeAnimation();
      movingGallery();
    }, 100);
    return () => clearTimeout(timer);
  }, {});
  return children;
}
