import type { Metadata } from "next"
import { Inter, Inter_Tight } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner" // ✅ import this

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" })

export const metadata: Metadata = {
  title: "Instack",
  description: "Never Miss a Call, Message, or Booking Again.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable}`}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
