import gsap from "gsap";

export const workAnimation = () => {
  if (document.querySelectorAll(".works-wrapper-2").length > 0) {
    const workBoxes = document.querySelectorAll(".works-wrapper-2 .work-box");
    gsap.fromTo(
      workBoxes,
      {
        opacity: 0,
        scale: 0.8,
        y: 50,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        stagger: {
          each: 0.2,
          from: "random",
        },
        scrollTrigger: {
          trigger: ".works-wrapper-2",
          start: "top bottom",
          end: "bottom top",
          scrub: false,
        },
      }
    );
  }
}

export const workAnimationTwo = (): void => {
  if (document.querySelectorAll(".works-wrapper-5").length > 0) {
    const cards: NodeListOf<HTMLElement> = document.querySelectorAll(".card-wrap");

    cards.forEach((card: HTMLElement) => {
      const cardElement = card.querySelector<HTMLElement>(".card");
      const cardBg = card.querySelector<HTMLElement>(".card-bg");

      if (!cardElement || !cardBg) return;

      const imageUrl: string | null = card.getAttribute("data-image");
      if (imageUrl) {
        cardBg.style.backgroundImage = `url(${imageUrl})`;
      }

      let requestId: number | null = null;

      card.addEventListener("mousemove", (e: MouseEvent) => {
        if (requestId) cancelAnimationFrame(requestId);
        requestId = requestAnimationFrame(() => {
          const rect: DOMRect = card.getBoundingClientRect();
          const x: number = e.clientX - rect.left - rect.width / 2;
          const y: number = e.clientY - rect.top - rect.height / 2;
          const rotateX: number = (y / rect.height) * -30;
          const rotateY: number = (x / rect.width) * 30;

          cardElement.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
          cardBg.style.transform = `translateX(${x * -0.1}px) translateY(${y * -0.1}px)`;
        });
      });

      card.addEventListener("mouseleave", () => {
        if (requestId) cancelAnimationFrame(requestId);
        cardElement.style.transform = "rotateY(0deg) rotateX(0deg)";
        cardBg.style.transform = "translateX(0px) translateY(0px)";
      });
    });
  }
};
