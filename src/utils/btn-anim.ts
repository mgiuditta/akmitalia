import $ from 'jquery';
import { gsap } from 'gsap';

export const rrBtnAnimation = (): void => {
  // Button circle hover effect
  $(".rr-btn-circle").on("mouseenter", function (e: JQuery.MouseEnterEvent) {
    const offset = $(this).offset();
    if (!offset) return;

    const x = e.pageX - offset.left;
    const y = e.pageY - offset.top;

    $(this).find(".rr-btn-circle-dot").css({
      top: y,
      left: x,
    });
  });

  $(".rr-btn-circle").on("mouseout", function (e: JQuery.MouseOutEvent) {
    const offset = $(this).offset();
    if (!offset) return;

    const x = e.pageX - offset.left;
    const y = e.pageY - offset.top;

    $(this).find(".rr-btn-circle-dot").css({
      top: y,
      left: x,
    });
  });

  // Hover parallax effect
  const hoverBtns = gsap.utils.toArray<HTMLElement>(".rr-hover-btn-wrapper");
  const hoverBtnItems = gsap.utils.toArray<HTMLElement>(".rr-btn-circle");

  hoverBtns.forEach((btn, index) => {
    $(btn).on("mousemove", function (e: JQuery.MouseMoveEvent) {
      callParallax(e, btn, hoverBtnItems[index]);
    });

    function callParallax(
      e: JQuery.MouseMoveEvent,
      wrapper: Element,
      target: Element
    ) {
      parallaxIt(e, wrapper, target, 100);
    }

    function parallaxIt(
      e: JQuery.MouseMoveEvent,
      wrapper: Element,
      target: Element,
      movement: number
    ) {
      const $wrapper = $(wrapper);
      const offset = $wrapper.offset();
      if (!offset) return;

      const relX = e.pageX - offset.left;
      const relY = e.pageY - offset.top;

      gsap.to(target, {
        duration: 0.5,
        x: ((relX - $wrapper.width()! / 2) / $wrapper.width()!) * movement,
        y: ((relY - $wrapper.height()! / 2) / $wrapper.height()!) * movement,
        ease: "power2.out",
      });
    }

    $(btn).on("mouseleave", function () {
      gsap.to(hoverBtnItems[index], {
        duration: 0.5,
        x: 0,
        y: 0,
        ease: "power2.out",
      });
    });
  });
};
