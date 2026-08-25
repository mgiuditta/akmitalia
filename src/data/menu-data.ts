import { MenuItem } from "@/types/menu-d-type";

// Nav reale AKM Italia (docs/contenuti.md): Corsi, Centri Tecnici, Krav Maga,
// Chi Siamo, News, Contatti. Le route definitive (/corsi, /centri, ecc.) non
// esistono ancora (Fase 3): puntano ai placeholder demo /about e /contact
// finché non vengono costruite.
const menuData: MenuItem[] = [
  {
    title: 'Corsi',
    href: '/about',
    children: [
      { title: 'Krav Maga Adulti', href: '/about' },
      { title: 'Antibullismo Bambini', href: '/about' },
      { title: 'Donna Sicura', href: '/about' },
      { title: 'Kick Boxing', href: '/about' },
      { title: 'Full Contact', href: '/about' },
      { title: 'Corsi Istruttori', href: '/about' },
      { title: 'Corsi Speciali', href: '/about' },
    ],
  },
  { title: 'Centri Tecnici', href: '/contact' },
  { title: 'Krav Maga', href: '/about' },
  { title: 'Chi Siamo', href: '/about' },
  { title: 'News', href: '/about' },
  { title: 'Contatti', href: '/contact' },
];

export default menuData;