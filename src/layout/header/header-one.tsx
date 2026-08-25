"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/assets/imgs/logo/logo-light.png';
import MainMenu from './main-menu';
import SideToggle from '@/components/common/side-toggle';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
     <header className="header-area">
      <div className="header-main">
        <div className="container large">
          <div className="header-area__inner">
            {/* Logo */}
            <div className="header__logo">
              <Link href="/index">
                <Image
                  src={logo}
                  className="normal-logo"
                  alt="Site Logo"
                  width={95}
                  height={23}
                />
              </Link>
            </div>

            {/* Navigation */}
            <div className="header__nav">
              <MainMenu/>
            </div>

            {/* Button */}
            <div className="header__button">
              <a href="/contact" className="rr-btn hover-bg-theme">
                <span className="btn-wrap">
                  <span className="text-one">Let’s Talk</span>
                  <span className="text-two">Let’s Talk</span>
                </span>
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="header__navicon d-xl-none">
              <button
                className="side-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <i className="fa-solid fa-bars"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    {/* side toggle bar */}
    <SideToggle
      isOpen={isMobileMenuOpen}
      onSideToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    />
    {/* side toggle bar */}
    </>
  );
};

export default Header;