"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/assets/imgs/logo/logo-2-light.png';
import icon from '@/assets/imgs/icon/icon-1.webp';

interface NavItem {
  title: string;
  link: string;
}

const companyLinks: NavItem[] = [
  { title: 'agency', link: '#' },
  { title: 'Solutions', link: '#' },
  { title: 'Community', link: '#' },
  { title: 'Work', link: '#' },
  { title: 'Contact', link: '#' },
];

const socialLinks: NavItem[] = [
  { title: 'Facebook', link: '#' },
  { title: 'Twitter', link: '#' },
  { title: 'Dribbble', link: '#' },
  { title: 'Instagram', link: '#' },
  { title: 'Awwwards', link: '#' },
  { title: 'YouTube', link: '#' },
];

const officeLinks: NavItem[] = [
  { title: 'New York', link: '#' },
  { title: 'Toronto', link: '#' },
  { title: 'Berlin', link: '#' },
  { title: 'London', link: '#' },
];

const FooterInner: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    // Handle subscription logic here (e.g., API call)
    alert(`Subscribed with email: ${email}`);
    setEmail(''); // Clear the input field after subscribing
  };

  return (
    <footer className="footer-area-inner-page section-spacing-top">
      <div className="container large">
        <div className="footer-top-inner">
          <div className="footer-logo">
            <Link href="/">
              <Image src={logo} alt="site-logo" />
            </Link>
          </div>
          <div className="info-text">
            <div className="text-wrapper">
              <p className="text">
                Redox is a startup digital agency of design, development and marketing that works friendly with global client
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
              <div className="subscribe-form">
                <div className="input-field">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button type="button" className="subscribe-btn" onClick={handleSubscribe}>
                    <Image src={icon} alt="image" />
                  </button>
                </div>
              </div>
              <div className="subscription-text">
                <div className="text-wrapper">
                  <p className="text">
                    By subscribing you agree with our{' '}
                    <a href="#">Privacy Policy</a>
                  </p>
                </div>
              </div>
            </div>
            <div className="footer-widget-box">
              <h2 className="title">Company</h2>
              <ul className="footer-nav-list">
                {companyLinks.map((item, index) => (
                  <li key={index}>
                    <Link href={item.link}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-widget-box">
              <h2 className="title">Social</h2>
              <ul className="footer-nav-list">
                {socialLinks.map((item, index) => (
                  <li key={index}>
                    <Link href={item.link}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-widget-box">
              <h2 className="title">Office</h2>
              <ul className="footer-nav-list">
                {officeLinks.map((item, index) => (
                  <li key={index}>
                    <Link href={item.link}>{item.title}</Link>
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
              © {new Date().getFullYear()} <a href="https://themeforest.net/user/ravextheme">RavexTheme.</a> All right reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterInner;