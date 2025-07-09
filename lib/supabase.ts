import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auto-sync function to check connection every 3 minutes
export const startAutoSync = () => {
  setInterval(
    async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          // User is connected, sync data if needed
          console.log("User connected, syncing data...")
          // Add your sync logic here
        }
      } catch (error) {
        console.error("Auto-sync error:", error)
      }
    },
    3 * 60 * 1000,
  ) // 3 minutes
}
