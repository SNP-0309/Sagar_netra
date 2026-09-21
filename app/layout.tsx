import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sagarnetra.in";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "SagarNetra AI — Sonar-Based Marine Debris Detection",
    template: "%s | SagarNetra AI",
  },
  description:
    "SagarNetra AI uses side-scan sonar imagery and deep learning to detect, classify, and map marine debris and underwater anomalies in real time. Built for oceanographers, port authorities, and coast guard operations.",
  keywords: [
    "marine debris detection",
    "side-scan sonar",
    "underwater anomaly detection",
    "ocean AI",
    "sonar image analysis",
    "marine pollution",
    "underwater mapping",
    "coast guard technology",
  ],
  authors: [{ name: "SagarNetra AI Team" }],
  creator: "SagarNetra AI",
  publisher: "SagarNetra AI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: APP_URL,
    siteName: "SagarNetra AI",
    title: "SagarNetra AI — Eye of the Ocean",
    description:
      "Side-scan sonar meets deep learning. Detect marine debris and underwater anomalies with centimetre-scale precision.",
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "SagarNetra AI — Sonar-Based Marine Debris Detection Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SagarNetra AI — Eye of the Ocean",
    description:
      "Side-scan sonar meets deep learning. Detect marine debris and underwater anomalies with centimetre-scale precision.",
    images: [`${APP_URL}/og-image.png`],
    creator: "@sagarnetra_ai",
  },
  alternates: {
    canonical: APP_URL,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#060E1A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
