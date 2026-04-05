import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (client) {
    return client;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log("[v0] Supabase URL exists:", !!supabaseUrl);
  console.log("[v0] Supabase Anon Key exists:", !!supabaseAnonKey);

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Missing Supabase environment variables!");
    throw new Error("Missing Supabase environment variables");
  }

  client = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return client;
}
