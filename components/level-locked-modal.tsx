"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Lock, Clock, Video, Coins } from "lucide-react"
import { LevelLockoutManager } from "@/lib/level-lockout"
import { AdManager } from "@/lib/ad-manager"

interface LevelLockedModalProps {
  levelId: number
  onClose: () => void
  onUnlock: () => void
  coins: number
  onSpendCoins: (amount: number) => void
}

export function LevelLockedModal({ levelId, onClose, onUnlock, coins, onSpendCoins }: LevelLockedModalProps) {
  const [remainingTime, setRemainingTime] = useState("")
  const [adsWatched, setAdsWatched] = useState(0)
  const [isWatchingAd, setIsWatchingAd] = useState(false)

  const unlockCost = LevelLockoutManager.getUnlockCost()
  const adsRequired = LevelLockoutManager.getAdsRequired()

  useEffect(() => {
    const updateTimer = () => {
      const remaining = LevelLockoutManager.getRemainingTime(levelId)
      const lockoutInfo = LevelLockoutManager.getLockoutInfo(levelId)

      if (lockoutInfo) {
        setAdsWatched(lockoutInfo.adsWatched)
      }

      if (remaining <= 0) {
        onUnlock()
        return
      }

      const minutes = Math.floor(remaining / 60000)
      const seconds = Math.floor((remaining % 60000) / 1000)
      setRemainingTime(`${minutes}:${seconds.toString().padStart(2, "0")}`)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [levelId, onUnlock])

  const handleWatchAd = async () => {
    setIsWatchingAd(true)

    // Show rewarded ad
    const success = await AdManager.showRewardedAd()

    if (success) {
      const unlocked = LevelLockoutManager.watchAdForUnlock(levelId)
      const lockoutInfo = LevelLockoutManager.getLockoutInfo(levelId)

      if (unlocked) {
        onUnlock()
      } else if (lockoutInfo) {
        setAdsWatched(lockoutInfo.adsWatched)
      }
    }

    setIsWatchingAd(false)
  }

  const handleUnlockWithCoins = () => {
    if (coins >= unlockCost) {
      LevelLockoutManager.unlockWithCoins(levelId)
      onSpendCoins(unlockCost)
      onUnlock()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="bg-card border-4 border-neon-orange p-8 max-w-md w-full space-y-6 neon-glow-orange">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Lock className="text-neon-orange" size={64} />
          </div>

          <h2 className="text-3xl font-bold text-neon-orange">LEVEL LOCKED</h2>

          <p className="text-muted-foreground">
            You've reached the maximum number of attempts (10 ghosts). This level is temporarily locked.
          </p>

          <div className="bg-black/40 border-2 border-neon-cyan rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 text-neon-cyan">
              <Clock size={24} />
              <span className="text-2xl font-mono font-bold">{remainingTime}</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">Time remaining</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">Unlock this level now:</div>

          {/* Watch Ads Option */}
          <Button
            onClick={handleWatchAd}
            disabled={isWatchingAd || adsWatched >= adsRequired}
            className="w-full h-14 bg-neon-purple text-white hover:bg-neon-purple/80 text-lg"
          >
            <Video className="mr-2" size={20} />
            {isWatchingAd
              ? "WATCHING AD..."
              : adsWatched >= adsRequired
                ? "ADS COMPLETED"
                : `WATCH AD (${adsWatched}/${adsRequired})`}
          </Button>

          {/* Coin Unlock Option */}
          <Button
            onClick={handleUnlockWithCoins}
            disabled={coins < unlockCost}
            className="w-full h-14 bg-neon-cyan text-black hover:bg-neon-cyan/80 text-lg"
          >
            <Coins className="mr-2" size={20} />
            UNLOCK FOR {unlockCost} COINS
          </Button>

          {coins < unlockCost && (
            <p className="text-sm text-red-400 text-center">Not enough coins (Need {unlockCost - coins} more)</p>
          )}

          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-muted text-muted-foreground bg-transparent"
          >
            CLOSE
          </Button>
        </div>
      </Card>
    </div>
  )
}
