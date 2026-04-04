export interface User {
  id: string
  username: string
  password: string
  role: "super_admin" | "admin"
  createdBy?: string
  createdAt: string
}

export interface AdminCredentials {
  username: string
  password: string
}

const SUPER_ADMIN: User = {
  id: "super_admin_1",
  username: "Mialashes",
  password: "Mia@admin@4532",
  role: "super_admin",
  createdAt: new Date().toISOString(),
}

export function getUsers(): User[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("mialashes_users")
    if (stored) {
      return JSON.parse(stored)
    }
    // Initialize with super admin
    const users = [SUPER_ADMIN]
    localStorage.setItem("mialashes_users", JSON.stringify(users))
    return users
  }
  return [SUPER_ADMIN]
}

export function saveUsers(users: User[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("mialashes_users", JSON.stringify(users))
  }
}

export function addUser(user: User): void {
  const users = getUsers()
  users.push(user)
  saveUsers(users)
}

export function updateUser(id: string, updates: Partial<User>): void {
  const users = getUsers()
  const index = users.findIndex((u) => u.id === id)
  if (index !== -1) {
    users[index] = { ...users[index], ...updates }
    saveUsers(users)
  }
}

export function deleteUser(id: string): void {
  const users = getUsers().filter((u) => u.id !== id && u.role !== "super_admin")
  saveUsers(users)
}

export function validateAdmin(username: string, password: string): User | null {
  const users = getUsers()
  const user = users.find((u) => u.username === username && u.password === password)
  return user || null
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem("mialashes_current_user")
  if (stored) {
    return JSON.parse(stored)
  }
  return null
}

export function setCurrentUser(user: User | null): void {
  if (typeof window !== "undefined") {
    if (user) {
      localStorage.setItem("mialashes_current_user", JSON.stringify(user))
      localStorage.setItem("mialashes_admin_logged_in", "true")
    } else {
      localStorage.removeItem("mialashes_current_user")
      localStorage.removeItem("mialashes_admin_logged_in")
    }
  }
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("mialashes_admin_logged_in") === "true"
}

export function setAdminLoggedIn(value: boolean): void {
  if (typeof window !== "undefined") {
    if (value) {
      localStorage.setItem("mialashes_admin_logged_in", "true")
    } else {
      localStorage.removeItem("mialashes_admin_logged_in")
      localStorage.removeItem("mialashes_current_user")
    }
  }
}

export function isSuperAdmin(): boolean {
  const user = getCurrentUser()
  return user?.role === "super_admin"
}
