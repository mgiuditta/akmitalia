"use client";
import { useGSAP } from "@gsap/react";
import { fadeAnimation } from "@/utils/title-anim";

type Props = {
  children: React.ReactNode;
};

export default function BlogWrapper({ children }: Props) {
  useGSAP(() => {
    const timer = setTimeout(() => {
      fadeAnimation();
    }, 100);
    return () => clearTimeout(timer);
  }, {});
  return children;
}
