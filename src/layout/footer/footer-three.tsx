import React from "react";
import Image from "next/image";
import icon1 from "@/assets/imgs/icon/icon-1.webp";
import Link from "next/link";

type FooterLinkSection = {
  title: string;
  links: string[];
};

const footerLinks: FooterLinkSection[] = [
  {
    title: "Company",
    links: ["agency", "Solutions", "Community", "Work", "Contact"],
  },
  {
    title: "Social",
    links: ["Facebook", "Twitter", "Dribbble", "Instagram", "Awwwards", "YouTube"],
  },
  {
    title: "Office",
    links: ["New York", "Toronto", "Berlin", "London"],
  },
];

const FooterThree: React.FC = () => {
  return (
    <footer className="footer-area-3">
      <div className="container large">
        <div className="footer-widget-wrapper-box">
          <div className="footer-widget-wrapper">
            {/* Newsletter Section */}
            <div className="footer-widget-box newsletter">
              <form action="#" className="subscribe-form">
                <div className="input-field">
                  <input type="email" placeholder="Enter your email" />
                  <button type="submit" className="subscribe-btn">
                    <Image src={icon1} alt="subscribe icon" />
                  </button>
                </div>
              </form>
              <div className="subscription-text">
                <div className="text-wrapper">
                  <p className="text">
                    By subscribing you agree with our{" "}
                    <Link href="/contact">Privacy Policy</Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Link Sections */}
            {footerLinks.map((section, idx) => (
              <div key={idx} className="footer-widget-box">
                <h2 className="title">{section.title}</h2>
                <ul className="footer-nav-list">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link href="/contact">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="copyright-area">
        <div className="copyright-area-inner">
          <div className="copyright-text">
            <p className="text">
              © {new Date().getFullYear()}{" "}
              <a href="https://themeforest.net/user/ravextheme" target="_blank" rel="noopener noreferrer">
                RavexTheme.
              </a>{" "}
              All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterThree;
