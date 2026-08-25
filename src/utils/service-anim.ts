import gsap from "gsap";
import { SplitText } from "gsap/SplitText";


export const serviceAnimation = () => {
  if (document.querySelectorAll(".actually-area").length > 0) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".actually-area",
        pin: true,
        scrub: 1,
        start: "top top",
        end: "bottom+=1500 top",
      }
    });
    const t_line = new SplitText(".t_line", { type: "lines" });
    t_line.lines.forEach((target) => {
      tl.to(target, {
        backgroundPositionX: 0,
        ease: "none",
        scrollTrigger: {
          trigger: target,
          scrub: 1,
          start: 'top 25%',
          end: "center 25%",
        }
      });
    });
    tl.to(".actually-area .section-title", {
      scale: 40,
      opacity: 0,
      ease: "power4.inOut",
      delay: 0.35,
      duration: 0.75,
    });
    tl.to(".actually-area", {
      backgroundColor: "#111111",
      duration: 0.45,
    }, "-=0.50");
  }
}


export const serviceAnimationTwo = () => {
  const section = document.querySelector(".service-area-4");
  if (!section) return;
    
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const container = document.querySelector(".service-area-4") as HTMLElement | null;
      const track = document.querySelector(".services-wrapper-4") as HTMLElement | null;
      if (!container || !track) return;

      // Ensure starting position is reset before measuring
      gsap.set(track, { x: 0 });

      const getScrollAmount = (): number => {
        const scrollWidth = track.scrollWidth;
        const viewWidth = container.offsetWidth;
        const amount = scrollWidth - viewWidth;
        return amount > 0 ? -amount : 0;
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${Math.abs(getScrollAmount())}`,
          scrub: 3,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(track, {
        x: () => getScrollAmount(),
        ease: "power1.inOut",
      }).to(
        ".service-thumb-line-wrapper span",
        {
          scaleX: 0,
          stagger: 0.04,
          ease: "power1.out",
        },
        "<"
      );

      // Cleanup when media query is reverted
      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });
};