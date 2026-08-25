import gsap from "gsap";


export const circularAnim = () => {
  if (document.querySelectorAll(".circular-shape-wrapper").length > 0) {
    const cs = gsap.timeline({
      ease: "power2.in",
      backgroundColor: "#FCF7F3",
      scrollTrigger: {
        trigger: ".circular-shape-wrapper",
        start: "bottom bottom",
        end: "bottom top",
        pin: true,
        scrub: 1,
      }
    })
    cs.to(".shape-thumb img", { scale: 100, rotation: 90, autoAlpha: 1, delay: 0.1 })
  }
}