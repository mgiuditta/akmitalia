"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import MainMenu from "./main-menu";
import logo from "@/assets/imgs/logo/logo-2-light.png";
import SideToggle from "@/components/common/side-toggle";


export default function HeaderEight() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    return (
        <>
            <header className="header-area-7">
                <div className="header-main">
                    <div className="container large">
                        <div className="header-area-7__inner">
                            <div className="header__logo">
                                <Link href="/">
                                    <Image src={logo} className="normal-logo" alt="imageSite Logo" style={{ height: "auto" }} />
                                </Link>
                            </div>
                            <div className="header__nav pos-center">
                                <MainMenu />
                            </div>
                            <div className="header__navicon">
                                <button onClick={() => setIsMobileMenuOpen(true)} className="side-toggle">
                                    <Image src="/assets/imgs/icon/icon-11.webp" alt="imageimage" width={30} height={10} />
                                    Menu
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
    )
}
