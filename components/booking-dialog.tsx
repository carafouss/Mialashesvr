"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface BookingDialogProps {
  serviceName: string
  servicePrice: string
  children?: React.ReactNode
}

export function BookingDialog({ serviceName, servicePrice, children }: BookingDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const message = `🌟 *NOUVELLE RÉSERVATION - MIA LASHES* 🌟

📋 *Service demandé:* ${serviceName}
💰 *Tarif:* ${servicePrice}

👤 *Informations client:*
• Nom: ${formData.name}
• Téléphone: ${formData.phone}
• Date souhaitée: ${formData.date}
• Heure souhaitée: ${formData.time}

${formData.notes ? `📝 *Notes:*\n${formData.notes}` : ""}

Merci de confirmer la disponibilité! ✨`

    const whatsappUrl = `https://wa.me/2250777812489?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
    setOpen(false)

    // Reset form
    setFormData({
      name: "",
      phone: "",
      date: "",
      time: "",
      notes: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="default" className="bg-primary hover:bg-primary/90">
            Réserver
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Réserver votre rendez-vous</DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            Service: <span className="font-semibold text-foreground">{serviceName}</span> - {servicePrice}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Votre nom complet"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Numéro de téléphone *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+225 XX XX XX XX XX"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date souhaitée *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Heure souhaitée *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes ou demandes spéciales (optionnel)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Ajoutez des détails supplémentaires..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            Confirmer sur WhatsApp
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
