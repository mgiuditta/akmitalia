import gsap from "gsap";

export const approachAnimation = () => {
  if (document.querySelectorAll(".approach-area").length > 0) {

    const boxes = document.querySelectorAll(".approach-area .approach-box");

    gsap.from(boxes, {
      x: "100%",
      duration: 1,
      stagger: 0.3,
      ease: "power2.out",
      scrollTrigger: {
        scrub: 2,
        trigger: ".approach-wrapper-box",
        start: "top 100%",
        end: "bottom 40%",
        toggleActions: "play none none reverse",
      }
    });
  }
}

export const approachAnimationTwo = () => {
  if (document.querySelectorAll(".approach-area-service-details-page").length > 0) {
    const boxes = document.querySelectorAll(".approach-box");
    gsap.from(boxes, {
      x: "100%",
      duration: 1,
      stagger: 0.3,
      ease: "power2.out",
      scrollTrigger: {
        scrub: 2,
        trigger: ".approach-wrapper-box",
        start: "top 100%",
        end: "bottom 40%",
        toggleActions: "play none none reverse",
      }
    });
  }
}