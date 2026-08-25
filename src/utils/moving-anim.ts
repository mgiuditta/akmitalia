import gsap from "gsap";

export const movingTextAnimation = (): void => {
  const sections = document.querySelectorAll<HTMLElement>(".moving-text");

  if (sections.length > 0) {
    gsap.utils.toArray(sections).forEach((section, index) => {
      const el = section as HTMLElement;
      const wrapper = el.querySelector<HTMLElement>(".wrapper-text");

      if (!wrapper) return;

      const sectionWidth = el.offsetWidth;
      const scrollWidth = wrapper.scrollWidth;

      const [xStart, xEnd] = index % 2 === 0
        ? [0, sectionWidth - scrollWidth]
        : [sectionWidth - scrollWidth, 0];

      gsap.fromTo(wrapper, { x: xStart }, {
        x: xEnd,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          scrub: 0.5,
          start: "20% bottom",
          end: "80% top",
        },
      });
    });
  }
};

export const movingGallery = (): void => {
  const sections = document.querySelectorAll<HTMLElement>(".moving-gallery");

  if (sections.length > 0) {
    gsap.utils.toArray<HTMLElement>(".moving-gallery").forEach((section, index) => {
      const w = section.querySelector<HTMLElement>(".wrapper-gallery");
      if (!w) return;

      const [x, xEnd]: [number, number] =
        index % 2
          ? [section.offsetWidth - w.scrollWidth, 0]
          : [0, section.offsetWidth - w.scrollWidth];

      gsap.fromTo(
        w,
        { x },
        {
          x: xEnd,
          scrollTrigger: {
            trigger: section,
            scrub: 0.5,
          },
        }
      );
    });
  }
};
