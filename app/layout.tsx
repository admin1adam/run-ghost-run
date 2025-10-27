import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TIME LOOP - Break the Cycle",
  description:
    "A 2D time-loop platformer with ghost mechanics. Master the loop, break the cycle. 30 challenging levels with enemies and puzzles.",
  generator: "v0.app",
  keywords: ["time loop", "platformer", "mobile game", "puzzle game", "ghost mechanics", "2D game"],
  authors: [{ name: "TIME LOOP Team" }],
  openGraph: {
    title: "TIME LOOP - Break the Cycle",
    description: "Master the loop in this addictive 2D platformer with ghost mechanics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TIME LOOP - Break the Cycle",
    description: "Master the loop in this addictive 2D platformer with ghost mechanics",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TIME LOOP",
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#00FFFF",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
