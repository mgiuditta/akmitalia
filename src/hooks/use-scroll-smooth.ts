"use client";
import { gsap } from "gsap";
import { useState } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollSmoother, ScrollTrigger } from "gsap/all";

export default function useScrollSmooth() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isScrollSmooth, setIsScrollSmooth] = useState<boolean>(true);

  useGSAP(() => {
    const hasSmooth = document.querySelector("#has_smooth");

    if (isScrollSmooth && hasSmooth?.classList.contains("has-smooth")) {
      gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

      const deviceWidth = window.screen.width;
      if (deviceWidth > 767) {
        ScrollSmoother.create({
          smooth: 0.9,
          effects: deviceWidth < 1025 ? false : true,
          smoothTouch: 0.1,
          normalizeScroll: {
            allowNestedScroll: true,
          },
          ignoreMobileResize: true,
        });
      }
    }
  }, []);
}