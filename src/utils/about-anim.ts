import gsap from "gsap"

export const aboutAnim = () => {
  const mm = gsap.matchMedia();

  mm.add("(min-width: 1400px)", () => {

    if (document.querySelectorAll(".about-area-2").length > 0) {
      const ab2 = gsap.timeline({
        scrollTrigger: {
          trigger: ".about-area-2 .section-content",
          pin: ".about-area-2",
          pinSpacing: false,
          start: "top top",
          end: "bottom",
          scrub: 0.2,
        },
      });
      ab2.to(".year-since", {
        right: "0",
        ease: "power1.inOut",
        delay: 0.15,
        duration: 0.75,
      });
      ab2.to([".about-area-2 .text-wrapper", ".about-area-2 .btn-wrapper"], {
        x: "100",
        opacity: 0,
        duration: 0.25,
      }, "-=0.40");
      ab2.to(".is-fading", {
        opacity: 0,
        duration: 0.15,
      });
      ab2.to(".year-since .last-text", {
        fontSize: 30,
        lineHeight: "27px",
        letterSpacing: "-0.1em",
        position: "absolute",
        top: 0,
        right: 0,
        ease: "none",
        duration: 0.40,
      });
    }
  });
}