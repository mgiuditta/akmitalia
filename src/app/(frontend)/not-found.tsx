"use client";
import Link from "next/link";
import MainWrapper from "@/components/wrapper/main-wrapper";

export default function NotFound() {
  return (
    <MainWrapper
      bodyCls={[
        "body-wrapper",
        "dark",
        "body-page-inner",
        "font-heading-sequelsans-romanbody",
      ]}
    >
      <section className="error-area">
        <div className="container large">
          <div className="error-area-inner section-spacing">
            <div className="section-content">
              <div className="section-title-wrapper">
                <div className="subtitle-wrapper">
                  <span className="section-subtitle">404</span>
                </div>
                <div className="title-wrapper">
                  <h2 className="section-title font-sequelsans-romanbody">
                    Oops sorry! page {" "}
                    {"didn't"} found
                  </h2>
                </div>
              </div>
              <div className="btn-wrapper">
                <Link href="/" className="rr-btn">
                  <span className="btn-wrap">
                    <span className="text-one">Back - To - Home</span>
                    <span className="text-two">Back - To - Home</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainWrapper>
  );
}
