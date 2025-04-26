"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { seedDatabaseAction } from "../actions/seed-database"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSeedDatabase = async () => {
    setIsLoading(true)
    try {
      const result = await seedDatabaseAction()
      setResult(result)
    } catch (error) {
      setResult({ success: false, message: "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Database Management</CardTitle>
            <CardDescription>Seed the database with sample data for testing</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This will create a demo user account and sample downloads. Only use this for testing purposes.
            </p>
            {result && (
              <Alert variant={result.success ? "default" : "destructive"} className="mb-4">
                {result.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>{result.message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSeedDatabase} disabled={isLoading}>
              {isLoading ? "Seeding..." : "Seed Database"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
