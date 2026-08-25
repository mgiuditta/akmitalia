import Link from "next/link";
import React from "react";

export default function CtaAreaFive() {
  return (
    <section className="cta-area-5">
      <div className="cta-area-5-inner">
        <div className="section-header">
          <div className="section-title-wrapper">
            <div className="title-wrapper fade-anim">
              <h2 className="section-title font-tartuffotrial-thin">
                <Link href="/contact">
                  Let’s work together <span className="line"></span>
                  Let’s work together <span className="line"></span> Let’s work
                  together <span className="line"></span> Let’s work together{" "}
                  <span className="line"></span> Let’s work together
                </Link>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
