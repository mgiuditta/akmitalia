/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import gsap from "gsap";
import { CustomEase, ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger, CustomEase);

// moving testimonial
export const movingTestimonial = () => {
  if (document.querySelectorAll(".moving-testimonial").length > 0) {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1200px)", () => {
      const e: any = document.querySelector(".moving-testimonial"),
        t = e.querySelector(".pin"),
        o = e.querySelectorAll(".t-card");
      ScrollTrigger.create({ trigger: t, start: "top top", end: "bottom center", pin: !0, pinSpacing: !1, scrub: !0, markers: false }), gsap.set(o, { yPercent: 50, y: 0.5 * window.innerHeight + 1 });
      const n = gsap.timeline({ paused: !0, scrollTrigger: { trigger: e, start: "top top", end: "bottom center", scrub: !0 } });
      n.to(o, { yPercent: -50, y: -0.5 * window.innerHeight, duration: 1, stagger: -0.12, ease: CustomEase.create("custom", "M0,0 C0,0 0.098,0.613 0.5,0.5 0.899,0.386 1,1 1,1") }, "sameStep"),
        n.to(o, { rotation: () => 20 * (Math.random() - 0.5), stagger: -0.12, duration: 0.5, ease: "power3.out" }, "sameStep"),
        n.to(o, { rotation: 0, stagger: -0.12, duration: 0.5, ease: "power3.in" }, "sameStep+=0.5");
    });
  };
};
