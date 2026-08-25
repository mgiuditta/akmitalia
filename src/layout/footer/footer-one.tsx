import Link from "next/link";
import React from "react";
import Image from "next/image";

const Footer: React.FC = () => {
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
                AKM Italia è un&apos;accademia di Krav Maga con oltre 20 centri tecnici
                in Lombardia, dedicata all&apos;autodifesa e alla formazione di istruttori.
              </p>
            </div>
            <div className="info-link">
              <a href="mailto:info@akm-italia.it">info@akm-italia.it</a>
            </div>
          </div>
        </div>
        <div className="footer-widget-wrapper-box">
          <div className="footer-widget-wrapper">
            <div className="footer-widget-box">
              <h2 className="title">Il sito</h2>
              <ul className="footer-nav-list">
                <li><Link href="/about">Corsi</Link></li>
                <li><Link href="/contact">Centri Tecnici</Link></li>
                <li><Link href="/about">Chi Siamo</Link></li>
                <li><Link href="/contact">Contatti</Link></li>
              </ul>
            </div>
            <div className="footer-widget-box">
              <h2 className="title">Copertura</h2>
              <ul className="footer-nav-list">
                <li><Link href="/contact">Oltre 20 centri in Lombardia</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright-area">
        <div className="copyright-area-inner">
          <div className="copyright-text">
            <p className="text">
              © {new Date().getFullYear()} AKM Italia. Tutti i diritti riservati.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
