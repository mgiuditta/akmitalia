"use client";
import { useEffect } from "react";
import $ from "jquery";
import gsap from "gsap";

interface CursorOptions {
  container?: string;
  speed?: number;
  ease?: string;
  visibleTimeout?: number;
}

interface StickPosition {
  x: number;
  y: number;
}

class Cursor {
  private options: Required<CursorOptions>;
  private body: JQuery<HTMLElement>;
  private el: JQuery<HTMLElement>;
  private text: JQuery<HTMLElement>;
  private pos!: { x: number; y: number };
  private stick: StickPosition | false = false;
  private visible = false;
  private visibleInt?: ReturnType<typeof setTimeout>;

  constructor(options?: CursorOptions) {
    this.options = $.extend(true, {
      container: "body",
      speed: 0.7,
      ease: "expo.out",
      visibleTimeout: 300
    }, options);

    this.body = $(this.options.container);
    this.el = $('<div class="cb-cursor"></div>');
    this.text = $('<div class="cb-cursor-text"></div>');
    this.init();
  }

  private init(): void {
    this.el.append(this.text);
    this.body.append(this.el);
    this.bind();
    this.move(-window.innerWidth, -window.innerHeight, 0);
  }

  private bind(): void {
    this.body
      .on('mouseleave', () => {
        this.hide();
      })
      .on('mouseenter', () => {
        this.show();
      })
      .on('mousemove', (e: JQuery.MouseMoveEvent) => {
        this.pos = {
          x: this.stick ? this.stick.x - ((this.stick.x - e.clientX) * 0.15) : e.clientX,
          y: this.stick ? this.stick.y - ((this.stick.y - e.clientY) * 0.15) : e.clientY
        };
        this.update();
      })
      .on('mousedown', () => {
        this.setState('-active');
      })
      .on('mouseup', () => {
        this.removeState('-active');
      })

      // Extended target elements
      .on('mouseenter', 'a, input, textarea, button, h1, h2, img', () => {
        this.setState('all-element');
      })
      .on('mouseleave', 'a, input, textarea, button, h1, h2, img', () => {
        this.removeState('all-element');
      })
      .on('mouseenter', 'iframe', () => {
        this.hide();
      })
      .on('mouseleave', 'iframe', () => {
        this.show();
      })

      // State & Text management
      .on('mouseenter', '[data-cursor]', (e) => {
        this.setState((e.currentTarget as HTMLElement).dataset.cursor!);
      })
      .on('mouseleave', '[data-cursor]', (e) => {
        this.removeState((e.currentTarget as HTMLElement).dataset.cursor!);
      })
      .on('mouseenter', '[data-cursor-text]', (e) => {
        this.setText($(e.currentTarget).data('cursor-text'));
      })
      .on('mouseleave', '[data-cursor-text]', () => {
        this.removeText();
      })

      // Generic class support
      .on('mouseenter', '[data-cursor-class]', (e) => {
        const classes = ($(e.currentTarget).data('cursor-class') as string).split(' ');
        this.addClasses(classes);
      })
      .on('mouseleave', '[data-cursor-class]', (e) => {
        const classes = ($(e.currentTarget).data('cursor-class') as string).split(' ');
        this.removeClasses(classes);
      })

      // Legacy support for color-based classes
      .on('mouseenter', '[data-cursor-text-green]', (e) => {
        this.setText((e.currentTarget as HTMLElement).dataset.cursorText!);
        this.el.addClass('-green');
      })
      .on('mouseleave', '[data-cursor-text-green]', () => {
        this.removeText();
        this.el.removeClass('-green');
      })
      .on('mouseenter', '[data-cursor-text-red]', (e) => {
        this.setText((e.currentTarget as HTMLElement).dataset.cursorText!);
        this.el.addClass('-red');
      })
      .on('mouseleave', '[data-cursor-text-red]', () => {
        this.removeText();
        this.el.removeClass('-red');
      })
      .on('mouseenter', '[data-cursor-text-portfolio]', (e) => {
        this.setText((e.currentTarget as HTMLElement).dataset.cursorText!);
        this.el.addClass('-portfolio');
      })
      .on('mouseleave', '[data-cursor-text-portfolio]', () => {
        this.removeText();
        this.el.removeClass('-portfolio');
      })

      // Stick-to-element behavior
      .on('mouseenter', '[data-cursor-stick]', (e) => {
        this.setStick((e.currentTarget as HTMLElement).dataset.cursorStick!);
      })
      .on('mouseleave', '[data-cursor-stick]', () => {
        this.removeStick();
      });
  }


  private setState(state: string): void {
    this.el.addClass(state);
  }

  private removeState(state: string): void {
    this.el.removeClass(state);
  }

  private addClasses(classes: string[]): void {
    this.el.addClass(classes.join(' '));
  }

  private removeClasses(classes: string[]): void {
    this.el.removeClass(classes.join(' '));
  }

  private setText(text: string): void {
    this.text.html(text);
    this.el.addClass('-text');
  }

  private removeText(): void {
    this.el.removeClass('-text');
  }

  private setStick(el: string): void {
    const target = $(el);
    const element = target.get(0);

    if (!element) return; // Nothing to stick to, exit safely

    const bound = element.getBoundingClientRect();
    this.stick = {
      y: bound.top + (target.height()! / 2),
      x: bound.left + (target.width()! / 2)
    };
    this.move(this.stick.x, this.stick.y, 5);
  }


  private removeStick(): void {
    this.stick = false;
  }

  private update(): void {
    this.move();
    this.show();
  }

  private move(x?: number, y?: number, duration?: number): void {
    gsap.to(this.el, {
      x: x ?? this.pos.x,
      y: y ?? this.pos.y,
      force3D: true,
      overwrite: true,
      ease: this.options.ease,
      duration: this.visible ? (duration ?? this.options.speed) : 0
    });
  }

  private show(): void {
    if (this.visible) return;
    clearTimeout(this.visibleInt);
    this.el.addClass('-visible');
    this.visibleInt = setTimeout(() => this.visible = true);
  }

  private hide(): void {
    clearTimeout(this.visibleInt);
    this.el.removeClass('-visible');
    this.visibleInt = setTimeout(() => this.visible = false, this.options.visibleTimeout);
  }
}

export default function CustomCursor() {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const cursor = new Cursor();
    return () => {
      $(".cb-cursor").remove();
    };
  }, []);

  return null;
}

