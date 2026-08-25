"use client";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import icon from "@/assets/imgs/icon/icon-1.webp";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Add subscription logic here (e.g., API call)
    alert(`Subscribed with email: ${email}`);
    setEmail(''); // Clear the input field after subscribing
  };

  return (
    <footer className="footer-area">
      <div className="container large">
        <div className="footer-top-inner">
          <div className="footer-logo">
            <Link href="/">
              <Image
                src="/assets/imgs/logo-akm/akm-italia-nero-240.png"
                alt="AKM Italia"
                width={64}
                height={64}
              />
            </Link>
          </div>
          <div className="info-text">
            <div className="text-wrapper">
              <p className="text">
                Redox is a startup digital agency of design, development and
                marketing that works friendly with global client
              </p>
            </div>
            <div className="info-link">
              <a href="mailto:info@redox.com">info@redox.com</a>
            </div>
          </div>
        </div>
        <div className="footer-widget-wrapper-box">
          <div className="footer-widget-wrapper">
            <div className="footer-widget-box newsletter">
              <form action="#" className="subscribe-form">
                <div className="input-field">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                  <button
                    onClick={handleSubscribe}
                    type="submit"
                    className="subscribe-btn"
                  >
                    <Image src={icon} alt="icon" />
                  </button>
                </div>
              </form>
              <div className="subscription-text">
                <div className="text-wrapper">
                  <p className="text">
                    By subscribing you agree with our
                    <Link href="/contact">Privacy Policy</Link>
                  </p>
                </div>
              </div>
            </div>
            <div className="footer-widget-box">
              <h2 className="title">Company</h2>
              <ul className="footer-nav-list">
                {["agency", "Solutions", "Community", "Work", "Contact"].map(
                  (item) => (
                    <li key={item}>
                      <Link href="/contact">{item}</Link>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="footer-widget-box">
              <h2 className="title">Social</h2>
              <ul className="footer-nav-list">
                {[
                  "Facebook",
                  "Twitter",
                  "Dribbble",
                  "Instagram",
                  "Awwwards",
                  "YouTube",
                ].map((item) => (
                  <li key={item}>
                    <Link href="/contact">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-widget-box">
              <h2 className="title">Office</h2>
              <ul className="footer-nav-list">
                {["New York", "Toronto", "Berlin", "London"].map((item) => (
                  <li key={item}>
                    <Link href="/contact">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright-area">
        <div className="copyright-area-inner">
          <div className="copyright-text">
            <p className="text">
              © {new Date().getFullYear()}{" "}
              <a href="https://themeforest.net/user/ravextheme">RavexTheme.</a>{" "}
              All right reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
