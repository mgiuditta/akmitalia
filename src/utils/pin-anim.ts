import gsap from "gsap";

export const clientPinAnimation = () => {
 if (document.querySelectorAll(".client-pin-element").length > 0) {
    const pin_fixed = document.querySelector('.client-pin-element');
    const device_width = window.screen.width;
    if (pin_fixed && device_width > 0) {

      gsap.to(".client-pin-element", {
        scrollTrigger: {
          trigger: ".client-pin-element",
          pin: ".client-pin-element",
          start: "bottom bottom",
          endTrigger: ".client-pin-area",
          end: "bottom bottom",
          pinSpacing: false,
        }
      });
    }
  }
}