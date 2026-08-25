import type { Metadata } from "next";
import { DM_Sans,Instrument_Sans } from "next/font/google";
import localFont from "next/font/local";
import "swiper/css/bundle";
import "@/assets/vendor/effect-slicer.min.css";
import "@/assets/vendor/fontawesome.min.css";
import "@/assets/vendor/spacing.css";
import "@/assets/vendor/meanmenu.min.css";
import "bootstrap/scss/bootstrap.scss";
import "./globals.scss";

const dm_sans = DM_Sans({
  weight: ["400","500", "600", "700","800"],
  subsets: ["latin"],
  variable: "--font_dmsans",
});

const instrument_sans = Instrument_Sans({
  weight: ["400","500", "600", "700"],
  subsets: ["latin"],
  variable: "--font_instrumentsans",
});

const bdogrotesk = localFont({
  src: [
    {
      path: "../../../public/assets/fonts/BDOGrotesk-DemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../public/assets/fonts/BDOGrotesk-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/assets/fonts/BDOGrotesk-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font_bdogrotesk",
});

const tartufffo_trial = localFont({
  src: [
    {
      path: "../../../public/assets/fonts/Tartuffo_Trial-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../../public/assets/fonts/Tartuffo_Trial-LightItalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../../public/assets/fonts/Tartuffo_Trial-Light.otf",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font_tartuffotrial",
});

const tartuffo = localFont({
  src: [
    {
      path: "../../../public/assets/fonts/Tartuffo_Trial-MediumItalic.otf",
      weight: "500",
      style: "italic",
    },
  ],
  variable: "--font-tartuffo",
});


const times_now = localFont({
  src: [
    {
      path: "../../../public/assets/fonts/TimesNow-SemiLightItalic.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font_timesnow",
});
const thunder = localFont({
  src: [
    {
      path: "../../../public/assets/fonts/Thunder-BoldLC.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../public/assets/fonts/Thunder-SemiBoldLC.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../public/assets/fonts/Thunder-MediumLC.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/assets/fonts/Thunder-LC.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font_thunder",
});
const Sequel_sans_roman = localFont({
  src: [
    {
      path: "../../../public/assets/fonts/Sequel Sans Roman Body.otf",
      weight: "310",
      style: "normal",
    },
  ],
  variable: "--font_sequelsansromanbody",
});
const Sequel_sans_medium = localFont({
  src: [
    {
      path: "../../../public/assets/fonts/Sequel Sans Roman Body.otf",
      weight: "315",
      style: "normal",
    },
  ],
  variable: "--font_sequelsansmediumbody",
});

export const metadata: Metadata = {
  title: "AKM Italia",
  description: "Accademia Krav Maga Italia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={`${dm_sans.variable} ${instrument_sans.variable} ${bdogrotesk.variable} ${tartuffo.variable} ${tartufffo_trial.variable} ${times_now.variable} ${thunder.variable} ${Sequel_sans_roman.variable} ${Sequel_sans_medium.variable}`}>
        {children}
      </body>
    </html>
  );
}
