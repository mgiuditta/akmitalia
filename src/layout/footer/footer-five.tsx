import Image from "next/image";
import logo from '@/assets/imgs/shape/logo-6.svg';
import Link from "next/link";

export default function FooterFive() {
  return (
    <footer className="footer-area-6">
        <div className="footer-area-6-inner">
            <div className="container large">
                <div className="footer-widget-wrapper">
                    <div className="footer-widget__media">
                        <Image src={logo} alt="shape-20" style={{height:'auto'}}/>
                    </div>
                    <div className="footer-widget__content">
                        <h2 className="footer-widget-title">Redox® — A design and brand studio, based in Canada.
                        </h2>
                        <div className="footer-widget__content-wrapper">
                            <div className="footer-widget__content-item">
                                <span>(01) Who we are</span>
                                <p className="description">We help brands and company in digital solution. As a
                                    cause-led digital
                                    marketing and brand agency.</p>
                            </div>
                            <div className="footer-widget__content-item">
                                <span>(02) Services</span>
                                <ul className="footer-widget-nav-list">
                                    <li><Link href="/contact">Art Direction</Link></li>
                                    <li><Link href="/contact">Web Design</Link></li>
                                    <li><Link href="/contact">Web Development</Link></li>
                                    <li><Link href="/contact">Brand Identity</Link></li>
                                    <li><Link href="/contact">Motion Design</Link></li>
                                    <li><Link href="/contact">3D Design</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="copyright-area">
                <div className="container large">
                    <div className="copyright-area-inner">
                        <ul className="copyright-socail-list">
                            <li><Link href="/contact">Dribbble</Link></li>
                            <li><Link href="/contact">Behance</Link></li>
                            <li><Link href="/contact">Facebook</Link></li>
                            <li><Link href="/contact">LinkedIn</Link></li>
                        </ul>
                        <div className="copyright-text">
                            <p className="text">© 2019 - {new Date().getFullYear()} <br/>
                                All rights reserved by <a href="https://themeforest.net/user/ravextheme">RavexTheme.</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  )
}
