import { gsap } from "gsap";

export const ctaAnim = () => {
  if (document.querySelectorAll(".cta-area").length > 0) {
    const tl = gsap.timeline({
      ease: "none",
      scrollTrigger: {
        trigger: ".cta-area",
        pin: true,
        pinSpacing: true,
        scrub: 2,
        start: 'bottom 100%',
        end: "200%",
      }
    });
    tl.to(".cta-area .area-bg", { scale: "10", delay: 0.1, ease: "power2.in" });
    tl.to(".cta-area .section-title", { fontSize: "18vw", ease: "power2.in" }, "<");
  }
}