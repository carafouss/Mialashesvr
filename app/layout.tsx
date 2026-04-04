import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "./providers"
import "./globals.css"

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mia Lashes - Institut de Beauté Haut de Gamme",
  description:
    "Mia Lashes est spécialisée dans la mise en valeur du visage à travers des prestations haut de gamme : extensions de cils, micropigmentation des sourcils et soins du visage.",
  generator: "v0.app",
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
}

export const viewport = {
  themeColor: "#1a1a1a",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} ${playfair.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
