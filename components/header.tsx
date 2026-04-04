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
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Mia Lashes" width={180} height={60} className="h-12 w-auto" priority />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#services" className="text-sm font-medium hover:text-accent transition-colors">
              Services
            </Link>
            <Link href="#products" className="text-sm font-medium hover:text-accent transition-colors">
              Produits
            </Link>
            <Link href="#location" className="text-sm font-medium hover:text-accent transition-colors">
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
              href="#services"
              className="text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="#products"
              className="text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Produits
            </Link>
            <Link
              href="#location"
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
