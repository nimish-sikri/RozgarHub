import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from '@vercel/analytics/react';

import 'tailwindcss/tailwind.css'
import { SpeedInsights } from '@vercel/speed-insights/next';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:{
    default : "Rozgar Hub",
    template : "%s | Rozgar Hub"
  },
  description: "Find your dream developer job",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-55J2QQM62D"></Script>
        <Script id="google-analytics">
          {
            `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
  
            gtag('config', 'G-55J2QQM62D');
            `
          }
        </Script>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8679854690891861"
        crossOrigin="anonymous"></script>
        <Script id="hydro_config" type="text/javascript">
          window.Hydro_tagId = "8aa0f824-8d93-42a3-a8cc-726b792f940d";
        </Script>
        <Script id="hydro_script" src="https://track.hydro.online/"></Script>
      </head>
       <body className={`${inter.className} min-w-[350px]`}>
        <Navbar/>
        {children}
        <Footer/>
        <Analytics />
        <SpeedInsights />
        </body>
    </html>
  );
}
