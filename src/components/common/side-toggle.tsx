import React from "react";
import Link from "next/link";
import logo from "@/assets/imgs/logo-akm/akm-italia-nero-240.png";
import Image from "next/image";
import menuData from "@/data/menu-data";

type IProps = {
  isOpen: boolean;
  onSideToggle: () => void;
};

export default function SideToggle({ isOpen, onSideToggle }: IProps) {
  const [navTitle, setNavTitle] = React.useState<string>("");

  //openMobileMenu
  const openMobileMenu = (menu: string) => {
    if (navTitle === menu) {
      setNavTitle("");
    } else {
      setNavTitle(menu);
    }
  };
  return (
    <React.Fragment>
      <aside className="fix">
        <div className={`side-info ${isOpen ? "info-open" : ""}`}>
          <div className="side-info-content">
            <div className="offset-widget offset-header">
              <div className="offset-logo">
                <Link href="/">
                  <Image
                    src={logo}
                    alt="AKM Italia"
                    style={{ height: "auto" }}
                  />
                </Link>
              </div>
              <button
                onClick={onSideToggle}
                id="side-info-close"
                className="side-info-close"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            {/* mobile menu */}
            <div className="mobile-menu d-xl-none fix mean-container">
              <div className="mean-bar">
                <nav className="mean-nav">
                  <ul>
                    {menuData.map((menu, index) => (
                      <li
                        key={index}
                        className={`${
                          menu.children ? "menu-item-has-children" : ""
                        }`}
                      >
                        <Link href={menu.href}>{menu.title}</Link>
                        {menu.children && (
                          <ul
                            className="dp-menu"
                            style={{
                              display:
                                navTitle === menu.title ? "block" : "none",
                            }}
                          >
                            {menu.children.map((subMenu, subIndex) => (
                              <li key={subIndex}>
                                <Link href={subMenu.href}>{subMenu.title}</Link>
                              </li>
                            ))}
                          </ul>
                        )}
                        {menu.children && (
                          <a
                            className="mean-expand"
                            href="#"
                            onClick={() => openMobileMenu(menu.title)}
                            style={{ fontSize: "28px" }}
                          >
                            {navTitle === menu.title ? "-" : "+"}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
            {/* mobile menu */}
            <div className="offset-button">
              <Link href="/contact" className="rr-btn hover-bg-theme">
                <span className="btn-wrap">
                  <span className="text-one">Preiscriviti</span>
                  <span className="text-two">Preiscriviti</span>
                </span>
              </Link>
            </div>
            <div className="offset-widget-box">
              <h2 className="title">Contatti</h2>
              <div className="contact-meta">
                <div className="contact-item">
                  <span className="icon">
                    <i className="fa-solid fa-location-dot"></i>
                  </span>
                  <span className="text">Oltre 20 centri in Lombardia</span>
                </div>
                <div className="contact-item">
                  <span className="icon">
                    <i className="fa-solid fa-envelope"></i>
                  </span>
                  <span className="text">
                    <a href="mailto:info@akm-italia.it">
                      info@akm-italia.it
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
      <div
        className={`offcanvas-overlay ${isOpen ? "overlay-open" : ""}`}
      ></div>
    </React.Fragment>
  );
}
