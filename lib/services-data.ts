export interface Service {
  id: string
  icon: string
  title: string
  description: string
  image: string
  price: string
}

const STORAGE_KEY = "mia_services_data"

export function getServices(): Service[] {
  if (typeof window === "undefined") return getDefaultServices()

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  return getDefaultServices()
}

export function saveServices(services: Service[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(services))
}

export function getDefaultServices(): Service[] {
  return [
    {
      id: "1",
      icon: "Eye",
      title: "Extensions de Cils",
      description: "Nous vous proposons tous les nouvelles poses et effets tendances.",
      image: "/eyelash-extensions-service.jpg",
      price: "À partir de 30 000 FCFA",
    },
    {
      id: "2",
      icon: "Brush",
      title: "Soins des sourcils",
      description: "Brow wax, lifting, brow tint, Microblading, Microshading etc.",
      image: "/african-woman-eyebrow-micropigmentation.jpg",
      price: "À partir de 5 000 FCFA",
    },
    {
      id: "3",
      icon: "Sparkles",
      title: "Soins du Visage",
      description:
        "Soins personnalisés adaptés à votre type de peau. Nettoyage en profondeur, hydratation et rajeunissement.",
      image: "/african-woman-facial-treatment.jpg",
      price: "À partir de 20 000 FCFA",
    },
  ]
}
