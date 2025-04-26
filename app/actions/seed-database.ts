"use server"

import { seedDatabase } from "@/lib/seed-db"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"

export async function seedDatabaseAction() {
  try {
    const session = await getServerSession(authOptions)

    // In a real app, you might want to restrict this to admins only
    if (!session?.user) {
      return { success: false, message: "Unauthorized" }
    }

    const result = await seedDatabase()

    if (result.success) {
      // Revalidate relevant paths
      revalidatePath("/downloads")
      revalidatePath("/history")
      revalidatePath("/settings")
    }

    return result
  } catch (error) {
    console.error("Error in seedDatabaseAction:", error)
    return { success: false, message: "Error seeding database", error }
  }
}
