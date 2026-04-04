export interface HeroData {
  image: string
  title: string
  subtitle: string
}

const HERO_STORAGE_KEY = "mia_lashes_hero_data"

const defaultHeroData: HeroData = {
  image: "/salon-interior.jpg",
  title: "L'art de sublimer votre regard",
  subtitle:
    "Extensions de cils, micropigmentation des sourcils et soins du visage haut de gamme pour révéler une beauté naturelle et élégante",
}

export function getHeroData(): HeroData {
  if (typeof window === "undefined") return defaultHeroData

  const stored = localStorage.getItem(HERO_STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return defaultHeroData
    }
  }
  return defaultHeroData
}

export function saveHeroData(data: HeroData): void {
  if (typeof window === "undefined") return
  localStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(data))
}
