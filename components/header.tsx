"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, ShoppingCart, Phone } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { BookingDialog } from "@/components/booking-dialog"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { items } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            aria-label="Mia Lashes — accueil"
            className="group relative flex items-center"
          >
            <span
              aria-hidden="true"
              className="absolute -inset-1 rounded-2xl border border-accent/35 transition-transform duration-300 group-hover:scale-105"
            />
            <span className="relative rounded-xl border border-accent/25 bg-white p-1 shadow-[0_6px_20px_rgba(0,0,0,0.12)] ring-1 ring-white/80 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_10px_26px_rgba(0,0,0,0.16)]">
              <Image
                src="/ml-logo.jpeg"
                alt="Mia Lashes"
                width={128}
                height={128}
                className="h-10 w-10 rounded-lg object-contain md:h-11 md:w-11"
                priority
              />
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/services" className="text-sm font-medium hover:text-accent transition-colors">
              Services
            </Link>
            <Link href="/produits" className="text-sm font-medium hover:text-accent transition-colors">
              Produits
            </Link>
            <Link href="/galerie" className="text-sm font-medium hover:text-accent transition-colors">
              Galerie
            </Link>
            <Link href="/localisation" className="text-sm font-medium hover:text-accent transition-colors">
              Localisation
            </Link>
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            <BookingDialog serviceName="Consultation générale" servicePrice="Gratuit">
              <Button className="bg-accent hover:bg-accent/90">
                <Phone className="mr-2 h-4 w-4" />
                Réserver
              </Button>
            </BookingDialog>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4 animate-fade-in-up">
            <Link
              href="/services"
              className="text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/produits"
              className="text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Produits
            </Link>
            <Link
              href="/galerie"
              className="text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Galerie
            </Link>
            <Link
              href="/localisation"
              className="text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Localisation
            </Link>
            <BookingDialog serviceName="Consultation générale" servicePrice="Gratuit">
              <Button className="bg-accent hover:bg-accent/90 w-full">
                <Phone className="mr-2 h-4 w-4" />
                Réserver
              </Button>
            </BookingDialog>
          </nav>
        )}
      </div>
    </header>
  )
}
