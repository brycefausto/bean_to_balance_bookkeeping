"use client"

import { Button } from "@/components/ui/button"
import { Frown, Home } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 md:p-12 text-center max-w-lg w-full">
        <div className="flex justify-center mb-6">
          {/* Frown icon from lucide-react */}
          <Frown className="w-20 h-20 text-red-500 dark:text-red-400" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          404
        </h1>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6">
          Page Not Found
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        {/* Button to navigate back home */}
        <Button variant="default" onClick={() => router.replace("/")}>
          <Home className="mr-2 h-5 w-5" /> {/* Home icon from lucide-react */}
          Go to Homepage
        </Button>
      </div>
    </div>
  )
}
