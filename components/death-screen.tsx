"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SkullIcon, PlayIcon, TvIcon, HomeIcon } from "lucide-react"
import { AdManager } from "@/lib/ad-manager"

interface DeathScreenProps {
  onContinue: () => void
  onRestart: () => void
  onMenu: () => void
  hasPremium: boolean
}

export function DeathScreen({ onContinue, onRestart, onMenu, hasPremium }: DeathScreenProps) {
  const [isWatchingAd, setIsWatchingAd] = useState(false)
  const [adProgress, setAdProgress] = useState(0)

  const handleWatchAd = async () => {
    setIsWatchingAd(true)
    setAdProgress(0)

    // Simulate ad progress
    const interval = setInterval(() => {
      setAdProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 3.33 // 30 steps to reach 100%
      })
    }, 100)

    const success = await AdManager.showRewardedAd()

    clearInterval(interval)
    setAdProgress(100)

    if (success) {
      setTimeout(() => {
        setIsWatchingAd(false)
        onContinue()
      }, 500)
    } else {
      setIsWatchingAd(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full bg-card border-2 border-neon-orange p-8 space-y-6 neon-glow-orange">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <SkullIcon className="text-neon-orange" size={64} />
          </div>
          <h2 className="text-4xl font-bold text-neon-orange">TIME LOOP FAILED</h2>
          <p className="text-muted-foreground">The cycle continues...</p>
        </div>

        {isWatchingAd ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-neon-cyan text-lg font-mono mb-2">Watching Ad...</div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-neon-cyan transition-all duration-100 neon-glow-cyan"
                  style={{ width: `${adProgress}%` }}
                />
              </div>
              <div className="text-sm text-muted-foreground mt-2">{Math.floor(adProgress)}%</div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {!hasPremium && (
              <Button
                onClick={handleWatchAd}
                className="w-full h-14 bg-neon-cyan text-black hover:bg-neon-cyan/80 neon-glow-cyan text-lg"
              >
                <TvIcon className="mr-2" size={20} />
                WATCH AD TO CONTINUE
              </Button>
            )}

            {hasPremium && (
              <Button
                onClick={onContinue}
                className="w-full h-14 bg-neon-cyan text-black hover:bg-neon-cyan/80 neon-glow-cyan text-lg"
              >
                <PlayIcon className="mr-2" size={20} />
                CONTINUE
              </Button>
            )}

            <Button
              onClick={onRestart}
              variant="outline"
              className="w-full h-12 border-neon-purple text-neon-purple hover:bg-neon-purple/20 bg-transparent"
            >
              RESTART LEVEL
            </Button>

            <Button
              onClick={onMenu}
              variant="outline"
              className="w-full h-12 border-muted text-muted-foreground hover:bg-muted/20 bg-transparent"
            >
              <HomeIcon className="mr-2" size={18} />
              MAIN MENU
            </Button>
          </div>
        )}

        {!hasPremium && !isWatchingAd && (
          <div className="text-center text-xs text-muted-foreground">
            Get Premium to remove ads and unlock unlimited continues
          </div>
        )}
      </Card>
    </div>
  )
}
