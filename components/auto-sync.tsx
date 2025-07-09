"use client"

import { useEffect } from "react"
import { startAutoSync } from "@/lib/supabase"

export default function AutoSync() {
  useEffect(() => {
    startAutoSync()
  }, [])

  return null
}
