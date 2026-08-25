import Link from "next/link";
import React from "react";

export default function CtaArea() {
  return (
    <div className="p-relative overflow-hidden">
      <section className="cta-area">
        <div className="cta-area-inner section-spacing">
          <div className="area-bg"></div>
          <div className="container large">
            <div className="section-content">
              <div className="section-title-wrapper">
                <div className="title-wrapper">
                  <h2 className="section-title font-instrumentsans-medium char-anim">
                    <Link href="/contact">Let’s Work</Link>
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
