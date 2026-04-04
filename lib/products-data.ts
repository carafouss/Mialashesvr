export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
}

export const productsData: Product[] = [
  {
    id: "1",
    name: "Colle Extensions de Cils",
    description:
      "Rétention 12 semaines, hypoallergénique, longue durée, résistant à l'eau et l'huile. Couleur noire. Volume: 5ml",
    price: 15000,
    image: "/colle-15000.jpg",
    category: "Extensions",
    stock: 25,
  },
  {
    id: "2",
    name: "Lash Bonder",
    description:
      "Adapté pour les finitions après la pose, renforce l'efficacité de la colle et maximise la durée des cils. Volume: 15ml",
    price: 10000,
    image: "/bonder-10000.jpeg",
    category: "Extensions",
    stock: 30,
  },
  {
    id: "3",
    name: "Sealant",
    description: "Gel pratique pour faciliter les effets wispy. Volume: 5ml",
    price: 8000,
    image: "/sealant-8000.jpg",
    category: "Extensions",
    stock: 20,
  },
  {
    id: "4",
    name: "Sérum pour Cils",
    description: "Pour la pousse des cils naturels. Volume: 5ml",
    price: 7000,
    image: "/serum-7000.jpeg",
    category: "Soins",
    stock: 15,
  },
  {
    id: "5",
    name: "Shampooing Mousse",
    description: "Pour le nettoyage des extensions de cils, pour une hygiène impeccable. Volume: 60ml",
    price: 5000,
    image: "/shampooing-5000.jpeg",
    category: "Soins",
    stock: 40,
  },
  {
    id: "6",
    name: "Remover Crème",
    description: "Une crème qui enlève les extensions de cils. Volume: 5g",
    price: 5000,
    image: "/remover-5000.jpeg",
    category: "Soins",
    stock: 35,
  },
]

export function getProducts(): Product[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("mialashes_products")
    if (stored) {
      return JSON.parse(stored)
    }
  }
  return productsData
}

export function saveProducts(products: Product[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("mialashes_products", JSON.stringify(products))
  }
}
