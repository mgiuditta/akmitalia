"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import logo from "@/assets/imgs/logo/logo-2.png";
import SideToggle from "@/components/common/side-toggle";

export default function HeaderFour() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <>
      <header className="header-area-4">
        <div className="header-main">
          <div className="container large">
            <div className="header-area-4__inner">
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
              <div className="header__middel">
                <p>
                  Redox provides user centered <br />
                  Ui and brand identities design <br />
                  [since 2012]
                </p>
              </div>
              <div className="header__navicon">
                <button onClick={() => setIsMobileMenuOpen(true)} className="side-toggle">
                  (Browse — Menu)
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
