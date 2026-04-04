export interface Category {
  id: string
  name: string
}

export const defaultCategories: Category[] = [
  { id: "1", name: "Extensions" },
  { id: "2", name: "Soins" },
]

export function getCategories(): Category[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("mialashes_categories")
    if (stored) {
      return JSON.parse(stored)
    }
  }
  return defaultCategories
}

export function saveCategories(categories: Category[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("mialashes_categories", JSON.stringify(categories))
  }
}
