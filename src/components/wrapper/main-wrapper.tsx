'use client';
import { useEffect } from "react";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
import ScrollToTop from "../common/scroll-to-top";

type IProps = {
  children: React.ReactNode;
  bodyCls?: string[];
};

export default function MainWrapper({ children, bodyCls }: IProps) {
  useEffect(() => {
    if (bodyCls?.length) {
      document.body.classList.add(...bodyCls);
    }
    return () => {
      if (bodyCls) {
        document.body.classList.remove(...bodyCls);
      }
    };
  }, [bodyCls]);

  // Run animations on component mount

  // Smooth scrolling
  useScrollSmooth();
  return (
    <>
      {/* scroll to top start */}
      <ScrollToTop />
      {/* scroll to top end */}

      <div className="has-smooth" id="has_smooth"></div>
      <div id="smooth-wrapper">
        <div id="smooth-content">

          {children}

        </div>
      </div>
    </>
  )
}
