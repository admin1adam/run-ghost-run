"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface InterstitialAdProps {
  onComplete: () => void
}

export function InterstitialAd({ onComplete }: InterstitialAdProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 5 // 20 steps to reach 100%
      })
    }, 100)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full bg-card border-2 border-neon-purple p-8 space-y-6">
        <div className="text-center space-y-4">
          <Loader2 className="text-neon-purple animate-spin mx-auto" size={48} />
          <h3 className="text-2xl font-bold text-neon-purple">Loading Next Level...</h3>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div className="h-full bg-neon-purple transition-all duration-100" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-sm text-muted-foreground">Ad-free experience with Premium</p>
        </div>
      </Card>
    </div>
  )
}
