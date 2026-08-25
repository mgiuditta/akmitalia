"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/imgs/logo/logo-2-light.png";
import icon from "@/assets/imgs/icon/icon-2.webp";
import SideToggle from "@/components/common/side-toggle";

export default function HeaderThree() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <>
      <header className="header-area-3">
        <div className="header-main">
          <div className="container large">
            <div className="header-area-3__inner">
              <div className="header__logo">
                <Link href="/">
                  <Image
                    src={logo}
                    className="normal-logo"
                    alt="Site Logo"
                    style={{ height: "auto" }}
                  />
                </Link>
              </div>
              <div className="header__nav">
                <nav className="menu d-none d-xl-block">
                  <ul>
                    <li>
                      <Link href="/">Home</Link>
                    </li>
                    <li>
                      <Link href="/about">About Us</Link>
                    </li>
                    <li>
                      <Link href="/services">Service</Link>
                    </li>
                    <li>
                      <Link href="/portfolio">Portfolio</Link>
                    </li>
                    <li>
                      <Link href="/contact">Contact</Link>
                    </li>
                  </ul>
                </nav>
              </div>
              <div className="header__navicon d-xl-none">
                <button onClick={() => setIsMobileMenuOpen(true)} className="side-toggle">
                  <Image src={icon} alt="image" />
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
}
