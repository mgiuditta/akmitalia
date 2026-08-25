import gsap from "gsap";

export const parallaxSliderAnimation = (): void => {
  if (document.querySelectorAll(".parallax-slider-wrapper").length > 0) {
    const selectAll = (e: string): NodeListOf<Element> => document.querySelectorAll(e);

    const tracks: NodeListOf<Element> = selectAll(".parallax-slider-wrapper");

    tracks.forEach((track: Element) => {
      const trackWrapper: NodeListOf<HTMLElement> = track.querySelectorAll<HTMLElement>(".parallax-slider");
      const allImgs: NodeListOf<HTMLElement> = track.querySelectorAll<HTMLElement>(".image");

      const trackWrapperWidth = (): number => {
        let width = 0;
        trackWrapper.forEach((el) => (width += el.offsetWidth));
        return width;
      };

      gsap.defaults({ ease: "none" });
      const gap: number = window.innerWidth * 0.05;

      const scrollTween = gsap.to(trackWrapper, {
        x: (): number => -trackWrapperWidth() + window.innerWidth + gap,
        scrollTrigger: {
          trigger: track,
          pin: true,
          scrub: 3,
          start: "center center",
          end: (): string => "+=" + (track.scrollWidth - window.innerWidth),
          onRefresh: (self: ScrollTrigger) => self.getTween()?.resetTo("totalProgress", 0),
          invalidateOnRefresh: true
        }
      });

      allImgs.forEach((img: HTMLElement) => {
        gsap.fromTo(
          img,
          { transform: "translateX(-10vw)" },
          {
            transform: "translateX(5vw)",
            scrollTrigger: {
              trigger: img.parentNode as Element,
              containerAnimation: scrollTween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          }
        );
      });
    });
  }
};
