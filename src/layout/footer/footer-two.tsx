import React from "react";
import Link from "next/link";
import icon from '@/assets/imgs/icon/icon-1.webp';
import Image from "next/image";

const footerWidgets = [
  {
    title: "Company",
    links: [
      { label: "agency", href: "/contact" },
      { label: "Solutions", href: "/contact" },
      { label: "Community", href: "/contact" },
      { label: "Work", href: "/contact" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "Facebook", href: "/contact" },
      { label: "Twitter", href: "/contact" },
      { label: "Dribbble", href: "/contact" },
      { label: "Instagram", href: "/contact" },
      { label: "Awwwards", href: "/contact" },
      { label: "YouTube", href: "/contact" },
    ],
  },
  {
    title: "Office",
    links: [
      { label: "New York", href: "/contact" },
      { label: "Toronto", href: "/contact" },
      { label: "Berlin", href: "/contact" },
      { label: "London", href: "/contact" },
    ],
  },
];

export default function FooterTwo() {
  return (
    <footer className="footer-area-2">
      <div className="container large">
        <div className="footer-widget-wrapper-box">
          <div className="footer-widget-wrapper">
            <div className="footer-widget-box newsletter">
              <form action="#" className="subscribe-form">
                <div className="input-field">
                  <input type="email" placeholder="Enter your email" />
                  <button type="submit" className="subscribe-btn">
                    <Image src={icon} alt="subscribe" />
                  </button>
                </div>
              </form>
              <div className="subscription-text">
                <div className="text-wrapper">
                  <p className="text">
                    By subscribing you agree with our{" "}
                    <a href="/contact">Privacy Policy</a>
                  </p>
                </div>
              </div>
            </div>
            {footerWidgets.map((widget, idx) => (
              <div className="footer-widget-box" key={widget.title + idx}>
                <h2 className="title">{widget.title}</h2>
                <ul className="footer-nav-list">
                  {widget.links.map((link, i) => (
                    <li key={link.label + i}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="copyright-area">
        <div className="copyright-area-inner">
          <div className="copyright-text">
            <p className="text">
              © {new Date().getFullYear()}{" "}
              <a href="https://themeforest.net/user/ravextheme">
                RavexTheme.
              </a>{" "}
              All right reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}