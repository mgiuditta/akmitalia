import { gsap } from "gsap";

export const scaleAnim = () => {
  const scale = document.querySelectorAll(".scale");
  const image = document.querySelectorAll(".scale img");
  if (!scale.length || !image.length) return;
  scale.forEach((item) => {
    gsap.to(item, {
      scale: 1,
      duration: 1,
      ease: "power1.out",
      scrollTrigger: {
        trigger: item,
        start: 'top bottom',
        end: "bottom top",
        toggleActions: 'play reverse play reverse'
      }
    });
  });
  image.forEach((image) => {
    gsap.set(image, {
      scale: 1.3,
    });
    gsap.to(image, {
      scale: 1,
      duration: 1,
      scrollTrigger: {
        trigger: image,
        start: 'top bottom',
        end: "bottom top",
        toggleActions: 'play reverse play reverse'
      }
    });
  })
}

export const growAnimation = () => {
  const grow = document.querySelectorAll(".grow");
  if (!grow.length) return;
  grow.forEach((item) => {
    gsap.to(item, {
      width: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: item,
        scrub: 2,
        start: 'top 90%',
        end: "top center",
      }
    });
  });
}

export const hoverRevealImageAnimation = () => {
  if (document.querySelectorAll(".hover-image-wrpper").length > 0) {
    const categoriesWrapper = document.querySelector('.hover-image-wrpper');
    const imageHover = document.querySelector('.image-hover');
    if (categoriesWrapper) {
      categoriesWrapper.addEventListener('mousemove', (e) => {
        const { clientX: mouseX, clientY: mouseY } = e as MouseEvent;
        gsap.to(imageHover, {
          x: mouseX,
          y: mouseY,
          xPercent: -50,
          yPercent: -50,
          ease: 'power3.out',
          duration: 0.2,
        });
      });
    }
  }

}

export const goFullAnimation = () => {
   if (document.querySelectorAll(".go_full").length > 0) {
    const go_full = document.querySelectorAll(".go_full");
    go_full.forEach((item) => {
      gsap.set(item, {
        position: "relative",
        left: "50%",
        transform: "translate(-50%, 0)",
        width: "auto",
      });
      gsap.to(item, {
        width: "100vw",
        ease: "none",
        scrollTrigger: {
          trigger: item,
          scrub: 0,
          start: "top bottom",
          end: "bottom bottom",
        }
      });
    });
  }
}

export const thumbAnimation = () => {
  // section-content__thumb image
  if (document.querySelectorAll(".section-content__thumb").length > 0) {
    gsap.fromTo(
      ".section-content__thumb img",
      {
        x: 350,
      },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".section-content__thumb img",
          start: "top 80%",
          toggleActions: "play none none none",
          scrub: 2,
        },
      }
    );
  }
}

export const aboutThreeThumbAnimation = () => {
  if (document.querySelectorAll(".about_3__thumb-anim").length > 0) {
    const about_3_thumb_anim = document.querySelector(".about_3__thumb-anim")
    if (about_3_thumb_anim) {
      const about_3_thumb_1 = document.querySelector(".thumb-1")
      const about_3_thumb_2 = document.querySelector(".thumb-2")
      const about_3_thumb_3 = document.querySelector(".thumb-3")
      const about_3_thumb_4 = document.querySelector(".thumb-4")

      gsap.to(about_3_thumb_1, {
        xPercent: -26,
        yPercent: 0,
        scrollTrigger: {
          trigger: about_3_thumb_anim,
          start: "top bottom",
          end: "bottom center",
          pinSpacing: false,
          scrub: true
        }
      })

      gsap.to(about_3_thumb_2, {
        xPercent: 0,
        yPercent: 10,
        scrollTrigger: {
          trigger: about_3_thumb_anim,
          start: "top bottom",
          end: "bottom center",
          pinSpacing: false,
          scrub: true
        }
      })

      gsap.to(about_3_thumb_3, {
        xPercent: 30,
        yPercent: 0,
        scrollTrigger: {
          trigger: about_3_thumb_anim,
          start: "top bottom",
          end: "bottom center",
          pinSpacing: false,
          scrub: true
        }
      })
      gsap.to(about_3_thumb_4, {
        xPercent: -172,
        yPercent: 34,
        scrollTrigger: {
          trigger: about_3_thumb_anim,
          start: "top bottom",
          end: "bottom center",
          pinSpacing: false,
          scrub: true
        }
      })
    }
  }
}