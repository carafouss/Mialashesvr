export interface AboutData {
  image: string
  title: string
  subtitle: string
  description: string[]
  badgeText: string
  badgeSubtext: string
}

const STORAGE_KEY = "mia_about_data"

export function getAboutData(): AboutData {
  if (typeof window === "undefined") return getDefaultAboutData()

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  return getDefaultAboutData()
}

export function saveAboutData(data: AboutData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getDefaultAboutData(): AboutData {
  return {
    image: "/about-image.jpeg",
    title: "Notre Philosophie",
    subtitle: "L'excellence au service de votre beauté naturelle",
    description: [
      "Mia Lashes est spécialisée dans la mise en valeur du visage à travers des prestations haut de gamme. Chaque détail est pensé pour révéler une beauté naturelle, élégante et maîtrisée.",
      "Nos expertises incluent les extensions de cils pour un regard captivant, la micropigmentation des sourcils pour un résultat parfait, et des soins du visage personnalisés pour sublimer votre peau.",
      "Dans un cadre raffiné alliant blanc, noir et beige, nous vous accueillons pour une expérience beauté unique où le luxe rencontre la perfection technique.",
    ],
    badgeText: "Expert",
    badgeSubtext: "En extensions de cils",
  }
}
