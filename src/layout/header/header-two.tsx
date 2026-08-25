"use client";
import { useState } from "react";
import Link from "next/link";
import MainMenu from "./main-menu";
import Image from "next/image";
import logo from "@/assets/imgs/logo/logo-3.png";
import icon from "@/assets/imgs/icon/icon-2.webp";
import SideToggle from "@/components/common/side-toggle";

export default function HeaderTwo() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <>
      <header className="header-area-2">
        <div className="header-main">
          <div className="container large">
            <div className="header-area-2__inner">
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
              <div className="header__nav pos-center">
                <MainMenu />
              </div>
              <div className="header__button">
                <Link href="/contact" className="rr-btn">
                  <span className="btn-wrap">
                    <span className="text-one">Let’s Talk</span>
                    <span className="text-two">Let’s Talk</span>
                  </span>
                </Link>
              </div>
              <div className="header__navicon">
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
