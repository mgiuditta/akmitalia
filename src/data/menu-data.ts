import { MenuItem } from "@/types/menu-d-type";

const menuData: MenuItem[] = [
  {
    title: 'Home',
    href: '#',
    children: [
      { title: 'Digital Agency', href: '/' },
      { title: 'Creative Agency', href: '/creative-agency' },
      { title: 'Marketing Agency', href: '/marketing-agency' },
      { title: 'Design Agency', href: '/design-agency' },
      { title: 'Startup Agency', href: '/startup-agency' },
      { title: 'Modern Agency', href: '/modern-agency' },
      { title: 'Agency Portfolio', href: '/agency-portfolio' },
      { title: 'Portfolio Horizontal', href: '/portfolio-horizontal' },
      { title: 'Portfolio Line Effect', href: '/portfolio-line-effect' },
      { title: 'Portfolio Box Effect', href: '/portfolio-box-effect' },
      { title: 'Portfolio Vertical', href: '/portfolio-vertical' },
      { title: 'Portfolio Slicer', href: '/portfolio-slicer' },
      { title: 'Parallax Carousal', href: '/parallax-carousal' },
      { title: 'Portfolio Showcase', href: '/portfolio-showcase' },
    ],
  },
  { title: 'About Us', href: '/about' },
  {
    title: 'Service',
    href: '#',
    children: [
      { title: 'Core Services', href: '/services' },
      { title: 'Services ST. Pulse', href: '/services-2' },
      { title: 'Services ST. Morph', href: '/services-3' },
      { title: 'Services ST. Nova', href: '/services-4' },
      { title: 'Services ST. Zenith', href: '/services-5' },
      { title: 'Services ST. Prism', href: '/services-6' },
      { title: 'Service Details', href: '/service-details' },
    ],
  },
  {
    title: 'Blog',
    href: '#',
    children: [
      { title: 'Blog', href: '/blog' },
      { title: 'Blog Details', href: '/blog-details/1' },
    ],
  },
  {
    title: 'Pages',
    href: '#',
    children: [
      { title: 'Core Portfolio', href: '/portfolio' },
      { title: 'Portfolio ST. Classic', href: '/portfolio-2' },
      { title: 'Portfolio ST. Minimal', href: '/portfolio-3' },
      { title: 'Portfolio ST. Modern', href: '/portfolio-4' },
      { title: 'Portfolio ST. Interactive', href: '/portfolio-5' },
      { title: 'Portfolio ST. Metro', href: '/portfolio-6' },
      { title: 'Portfolio Details', href: '/portfolio-details' },
      { title: 'Team', href: '/team' },
      { title: 'Team Details', href: '/team-details' },
      { title: 'FAQ Page', href: '/faq' },
      { title: '404 Page', href: '/404' },
    ],
  },
  { title: 'Contact', href: '/contact' },
];

export default menuData;