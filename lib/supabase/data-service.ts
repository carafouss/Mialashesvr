"use client"

import { createClient } from "@/lib/supabase/client"

function getSupabaseClient() {
  return createClient()
}

// ============ ADMIN USERS ============
export interface AdminUser {
  id: string
  username: string
  password: string
  role: "super_admin" | "admin"
  created_at: string
  created_by?: string
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("admin_users").select("*").order("created_at", { ascending: true })
  if (error) {
    console.error("Error fetching admin users:", error)
    return []
  }
  return data || []
}

export async function createAdminUser(user: Omit<AdminUser, "id" | "created_at">): Promise<AdminUser | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("admin_users").insert([user]).select().single()
  if (error) {
    console.error("Error creating admin user:", error)
    return null
  }
  return data
}

export async function deleteAdminUser(id: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from("admin_users").delete().eq("id", id)
  if (error) {
    console.error("Error deleting admin user:", error)
    return false
  }
  return true
}

export async function authenticateUser(username: string, password: string): Promise<AdminUser | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single()
  if (error || !data) {
    return null
  }
  return data
}

// ============ CATEGORIES ============
export interface Category {
  id: string
  name: string
  created_at: string
}

export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true })
  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }
  return data || []
}

export async function createCategory(name: string): Promise<Category | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("categories").insert([{ name }]).select().single()
  if (error) {
    console.error("Error creating category:", error)
    return null
  }
  return data
}

export async function deleteCategory(id: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from("categories").delete().eq("id", id)
  if (error) {
    console.error("Error deleting category:", error)
    return false
  }
  return true
}

// ============ PRODUCTS ============
export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  images?: string[]
  category: string
  stock: number
  created_at: string
}

export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })
  if (error) {
    console.error("Error fetching products:", error)
    return []
  }
  return data || []
}

export async function createProduct(product: Omit<Product, "id" | "created_at">): Promise<Product | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("products").insert([product]).select().single()
  if (error) {
    console.error("Error creating product:", error)
    return null
  }
  return data
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("products").update(product).eq("id", id).select().single()
  if (error) {
    console.error("Error updating product:", error)
    return null
  }
  return data
}

export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) {
    console.error("Error deleting product:", error)
    return false
  }
  return true
}

// ============ SERVICES ============
export interface PriceDetail {
  label: string
  price: string
}

export interface Service {
  id: string
  title: string
  description: string
  price: string
  price_details?: PriceDetail[]
  image: string
  created_at: string
}

export async function getServices(): Promise<Service[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("services").select("*").order("created_at", { ascending: true })
  if (error) {
    console.error("Error fetching services:", error)
    return []
  }
  return data || []
}

export async function createService(service: Omit<Service, "id" | "created_at">): Promise<Service | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("services").insert([service]).select().single()
  if (error) {
    console.error("Error creating service:", error)
    return null
  }
  return data
}

export async function updateService(id: string, service: Partial<Service>): Promise<Service | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("services").update(service).eq("id", id).select().single()
  if (error) {
    console.error("Error updating service:", error)
    return null
  }
  return data
}

export async function deleteService(id: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from("services").delete().eq("id", id)
  if (error) {
    console.error("Error deleting service:", error)
    return false
  }
  return true
}

// ============ PROMOTIONS ============
export interface Promotion {
  id: string
  title: string
  description: string
  badge?: string
  image?: string
  active: boolean
  created_at: string
}

export async function getPromotions(): Promise<Promotion[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("promotions").select("*").order("created_at", { ascending: false })
  if (error) {
    console.error("Error fetching promotions:", error)
    return []
  }
  return data || []
}

export async function createPromotion(promotion: Omit<Promotion, "id" | "created_at">): Promise<Promotion | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("promotions").insert([promotion]).select().single()
  if (error) {
    console.error("Error creating promotion:", error)
    return null
  }
  return data
}

export async function updatePromotion(id: string, promotion: Partial<Promotion>): Promise<Promotion | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("promotions").update(promotion).eq("id", id).select().single()
  if (error) {
    console.error("Error updating promotion:", error)
    return null
  }
  return data
}

export async function deletePromotion(id: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from("promotions").delete().eq("id", id)
  if (error) {
    console.error("Error deleting promotion:", error)
    return false
  }
  return true
}

// ============ ABOUT CONTENT ============
export interface AboutContent {
  id: string
  image: string
  title: string
  subtitle: string
  paragraph1: string
  paragraph2: string
  paragraph3: string
  badge_text: string
  updated_at: string
}

export async function getAboutContent(): Promise<AboutContent | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("about_content").select("*").single()
  if (error) {
    console.error("Error fetching about content:", error)
    return null
  }
  return data
}

export async function updateAboutContent(content: Partial<AboutContent>): Promise<AboutContent | null> {
  const supabase = getSupabaseClient()
  const { data: existing } = await supabase.from("about_content").select("id").single()
  
  if (existing) {
    const { data, error } = await supabase
      .from("about_content")
      .update({ ...content, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select()
      .single()
    if (error) {
      console.error("Error updating about content:", error)
      return null
    }
    return data
  } else {
    const { data, error } = await supabase
      .from("about_content")
      .insert([content])
      .select()
      .single()
    if (error) {
      console.error("Error creating about content:", error)
      return null
    }
    return data
  }
}

// ============ HERO CONTENT ============
export interface HeroContent {
  id: string
  image: string
  images?: string[]
  title: string
  subtitle: string
  updated_at: string
}

export async function getHeroContent(): Promise<HeroContent | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("hero_content").select("*").single()
  if (error) {
    console.error("Error fetching hero content:", error)
    return null
  }
  return data
}

export async function updateHeroContent(content: Partial<HeroContent>): Promise<HeroContent | null> {
  const supabase = getSupabaseClient()
  const { data: existing } = await supabase.from("hero_content").select("id").single()
  
  if (existing) {
    const { data, error } = await supabase
      .from("hero_content")
      .update({ ...content, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select()
      .single()
    if (error) {
      console.error("Error updating hero content:", error)
      return null
    }
    return data
  } else {
    const { data, error } = await supabase
      .from("hero_content")
      .insert([content])
      .select()
      .single()
    if (error) {
      console.error("Error creating hero content:", error)
      return null
    }
    return data
  }
}

// ============ GALLERY ============
export interface GalleryItem {
  id: string
  title: string
  description: string
  media_url: string
  media_type: "image" | "video"
  thumbnail_url: string
  category: string
  display_order: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("is_visible", true)
    .order("display_order", { ascending: true })
  if (error) {
    console.error("Error fetching gallery:", error)
    return []
  }
  return data || []
}

export async function getGalleryItemsByCategory(category: string): Promise<GalleryItem[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("is_visible", true)
    .eq("category", category)
    .order("display_order", { ascending: true })
  if (error) {
    console.error("Error fetching gallery by category:", error)
    return []
  }
  return data || []
}

export async function createGalleryItem(item: Omit<GalleryItem, "id" | "created_at" | "updated_at">): Promise<GalleryItem | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("gallery").insert([item]).select().single()
  if (error) {
    console.error("Error creating gallery item:", error)
    return null
  }
  return data
}

export async function updateGalleryItem(id: string, item: Partial<GalleryItem>): Promise<GalleryItem | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("gallery")
    .update({ ...item, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()
  if (error) {
    console.error("Error updating gallery item:", error)
    return null
  }
  return data
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from("gallery").delete().eq("id", id)
  if (error) {
    console.error("Error deleting gallery item:", error)
    return false
  }
  return true
}

// ============ PROMO VIDEO ============
export interface PromoVideo {
  id: string
  title: string
  video_url: string
  thumbnail_url: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function getPromoVideo(): Promise<PromoVideo | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("promo_video")
    .select("*")
    .eq("is_active", true)
    .single()
  if (error) {
    console.error("Error fetching promo video:", error)
    return null
  }
  return data
}

export async function updatePromoVideo(content: Partial<PromoVideo>): Promise<PromoVideo | null> {
  const supabase = getSupabaseClient()
  const { data: existing } = await supabase.from("promo_video").select("id").single()
  
  if (existing) {
    const { data, error } = await supabase
      .from("promo_video")
      .update({ ...content, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select()
      .single()
    if (error) {
      console.error("Error updating promo video:", error)
      return null
    }
    return data
  }
  return null
}

// ============ SERVICE BY ID ============
export async function getServiceById(id: string): Promise<Service | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .or(`id.eq.${id},slug.eq.${id}`)
    .single()
  if (error) {
    console.error("Error fetching service:", error)
    return null
  }
  return data
}

// ============ PRODUCT BY ID ============
export async function getProductById(id: string): Promise<Product | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .or(`id.eq.${id},slug.eq.${id}`)
    .single()
  if (error) {
    console.error("Error fetching product:", error)
    return null
  }
  return data
}

// ============ SALES ============
export interface SaleItem {
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total: number
}

export interface Sale {
  id: string
  items: SaleItem[]
  total_amount: number
  client_name: string
  client_phone?: string
  payment_method: string
  created_by: string
  created_at: string
}

export async function getSales(): Promise<Sale[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("sales").select("*").order("created_at", { ascending: false })
  if (error) {
    console.error("Error fetching sales:", error)
    return []
  }
  return data || []
}

export async function createSale(sale: Omit<Sale, "id" | "created_at">): Promise<Sale | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("sales").insert([sale]).select().single()
  if (error) {
    console.error("Error creating sale:", error)
    return null
  }
  return data
}

export async function deleteSale(id: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from("sales").delete().eq("id", id)
  if (error) {
    console.error("Error deleting sale:", error)
    return false
  }
  return true
}
