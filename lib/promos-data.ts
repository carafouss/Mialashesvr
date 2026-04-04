export interface Promo {
  id: string
  title: string
  description: string
  highlight: string
  image?: string
}

export const defaultPromos: Promo[] = [
  {
    id: "1",
    title: "20% de réduction",
    description: "Sur tous les paiements via Wave",
    highlight: "WAVE20",
  },
  {
    id: "2",
    title: "Offre découverte",
    description: "Première visite -15% sur tous les services",
    highlight: "BIENVENUE",
  },
  {
    id: "3",
    title: "Pack Beauté",
    description: "Achetez 3 produits, le 4ème offert",
    highlight: "3+1",
  },
]

export function getPromos(): Promo[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("mialashes_promos")
    if (stored) {
      return JSON.parse(stored)
    }
  }
  return defaultPromos
}

export function savePromos(promos: Promo[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("mialashes_promos", JSON.stringify(promos))
  }
}
