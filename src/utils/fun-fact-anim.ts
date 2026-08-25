import gsap from "gsap";

export const funFactAnimation = () => {
  if (document.querySelectorAll(".funfact-area-2").length > 0) {
    gsap.to(".funfact-area-2 .thumb img", {
      scale: "1",
      scrollTrigger: {
        trigger: ".funfact-area-2 .thumb",
        start: "top top",
        end: "70% top",
        pin: true,
        scrub: 2,
      }
    })
  }
}