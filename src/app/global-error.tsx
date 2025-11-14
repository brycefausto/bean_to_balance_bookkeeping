'use client' // Error boundaries must be Client Components

import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="rounded-full bg-destructive/15 p-4">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Something went wrong!</h1>
          <p className="text-muted-foreground">
            We apologize for the inconvenience. Please try again.
          </p>
          <div className="mt-6">
            <Button onClick={() => reset()} variant="default" size="lg">
              Try again
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}