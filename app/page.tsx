"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { GameCanvas } from "@/components/game-canvas"
import { ShopScreen } from "@/components/shop-screen"
import { LeaderboardScreen } from "@/components/leaderboard-screen"
import { DailyChallengeScreen } from "@/components/daily-challenge-screen"
import { DeathScreen } from "@/components/death-screen"
import { PremiumModal } from "@/components/premium-modal"
import { InterstitialAd } from "@/components/interstitial-ad"
import { AdSenseBanner } from "@/components/adsense-banner"
import { LevelLockedModal } from "@/components/level-locked-modal"
import { LEVELS } from "@/lib/levels"
import { LEVEL_TIERS } from "@/lib/level-tiers"
import { AdManager } from "@/lib/ad-manager"
import { LevelLockoutManager } from "@/lib/level-lockout"
import { Play, Trophy, ShoppingBag, Calendar, Crown, Lock } from "lucide-react"

export default function Home() {
  const [gameState, setGameState] = useState<
    | "menu"
    | "levelSelect"
    | "playing"
    | "complete"
    | "death"
    | "shop"
    | "leaderboard"
    | "daily"
    | "interstitial"
    | "levelLocked"
  >("menu")
  const [currentLevel, setCurrentLevel] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [totalCoins, setTotalCoins] = useState(150)
  const [totalXP, setTotalXP] = useState(0)
  const [hasPremium, setHasPremium] = useState(false)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [levelsCompletedInSession, setLevelsCompletedInSession] = useState(0)
  const [lockedLevelId, setLockedLevelId] = useState<number | null>(null)

  useEffect(() => {
    AdManager.initialize()
    setHasPremium(AdManager.hasPremium())
  }, [])

  const handleLevelComplete = (coins: number, xp: number) => {
    setTotalCoins((prev) => prev + coins)
    setTotalXP((prev) => prev + xp)
    setLevelsCompletedInSession((prev) => prev + 1)

    if (!hasPremium && levelsCompletedInSession > 0 && levelsCompletedInSession % 3 === 0) {
      setGameState("interstitial")
    } else {
      setGameState("complete")
    }
  }

  const handlePlayerDeath = () => {
    setGameState("death")
  }

  const handleContinue = () => {
    setGameState("playing")
  }

  const handleRestart = () => {
    setGameState("playing")
  }

  const startLevel = (levelIndex: number) => {
    const levelId = levelIndex + 1
    if (LevelLockoutManager.isLevelLocked(levelId)) {
      setLockedLevelId(levelId)
      setGameState("levelLocked")
    } else {
      setCurrentLevel(levelIndex)
      setGameState("playing")
    }
  }

  const handlePurchase = (itemId: string, cost: number) => {
    setTotalCoins((prev) => prev - cost)
  }

  const handlePremiumPurchase = () => {
    const premiumPrice = 999
    if (totalCoins >= premiumPrice) {
      setTotalCoins((prev) => prev - premiumPrice)
      AdManager.activatePremium()
      setHasPremium(true)
      setShowPremiumModal(false)
    }
  }

  const handleLevelUnlock = () => {
    setGameState("levelSelect")
    setLockedLevelId(null)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      {gameState === "menu" && (
        <div className="text-center space-y-8 max-w-md w-full">
          {!hasPremium && (
            <div className="mb-4">
              <AdSenseBanner slot="1234567890" format="horizontal" className="mb-4" />
            </div>
          )}

          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-neon-cyan tracking-wider glitch">TIME LOOP</h1>
            <p className="text-neon-purple text-lg">Break the cycle. Master the loop.</p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => setGameState("levelSelect")}
              className="w-full h-14 text-lg bg-neon-cyan text-black hover:bg-neon-cyan/80 neon-glow-cyan"
            >
              <Play className="mr-2" />
              PLAY
            </Button>

            <div className="grid grid-cols-3 gap-4">
              <Button
                onClick={() => setGameState("shop")}
                variant="outline"
                className="h-12 border-neon-purple text-neon-purple hover:bg-neon-purple/20 bg-transparent"
              >
                <ShoppingBag className="mr-1" size={18} />
                SHOP
              </Button>

              <Button
                onClick={() => setGameState("leaderboard")}
                variant="outline"
                className="h-12 border-neon-orange text-neon-orange hover:bg-neon-orange/20 bg-transparent"
              >
                <Trophy className="mr-1" size={18} />
                RANKS
              </Button>

              <Button
                onClick={() => setGameState("daily")}
                variant="outline"
                className="h-12 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/20 bg-transparent"
              >
                <Calendar className="mr-1" size={18} />
                DAILY
              </Button>
            </div>

            {!hasPremium && (
              <Button
                onClick={() => setShowPremiumModal(true)}
                className="w-full h-12 bg-yellow-400 text-black hover:bg-yellow-400/80 font-bold"
              >
                <Crown className="mr-2" size={18} />
                GET PREMIUM
              </Button>
            )}
          </div>

          <div className="flex justify-center gap-8 text-sm">
            <div className="text-center">
              <div className="text-neon-purple font-mono text-2xl">{totalCoins}</div>
              <div className="text-muted-foreground">COINS</div>
            </div>
            <div className="text-center">
              <div className="text-neon-orange font-mono text-2xl">{totalXP}</div>
              <div className="text-muted-foreground">XP</div>
            </div>
          </div>

          {hasPremium && (
            <div className="flex items-center justify-center gap-2 text-yellow-400 text-sm">
              <Crown size={16} />
              <span className="font-bold">PREMIUM MEMBER</span>
            </div>
          )}
        </div>
      )}

      {gameState === "levelSelect" && (
        <div className="max-w-6xl w-full space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-neon-cyan">SELECT LEVEL</h2>
            <Button
              onClick={() => setGameState("menu")}
              variant="outline"
              className="border-neon-cyan text-neon-cyan bg-transparent"
            >
              BACK
            </Button>
          </div>

          {LEVEL_TIERS.map((tier) => (
            <div key={tier.name} className="space-y-4">
              <div className="flex items-center gap-4">
                <h3 className="text-2xl font-bold" style={{ color: tier.color }}>
                  {tier.name}
                </h3>
                <p className="text-sm text-muted-foreground">{tier.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {LEVELS.filter((level) => level.id >= tier.startLevel && level.id <= tier.endLevel).map((level) => {
                  const isLocked = LevelLockoutManager.isLevelLocked(level.id)

                  return (
                    <button
                      key={level.id}
                      onClick={() => startLevel(level.id - 1)}
                      className="aspect-square bg-card border-2 rounded-lg p-4 hover:bg-opacity-20 transition-all flex flex-col items-center justify-center gap-2 relative"
                      style={{
                        borderColor: tier.color,
                        boxShadow: `0 0 10px ${tier.color}40`,
                        opacity: isLocked ? 0.5 : 1,
                      }}
                    >
                      {isLocked && (
                        <div className="absolute top-2 right-2">
                          <Lock size={20} className="text-neon-orange" />
                        </div>
                      )}
                      <div className="text-4xl font-bold" style={{ color: tier.color }}>
                        {level.id}
                      </div>
                      <div className="text-xs text-center" style={{ color: tier.color }}>
                        {level.name}
                      </div>
                      <div className="text-xs text-muted-foreground">{level.duration}s</div>
                    </button>
                  )
                })}
              </div>

              {!hasPremium && tier.endLevel !== 30 && (
                <div className="py-4">
                  <AdSenseBanner slot="0987654321" format="horizontal" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {gameState === "playing" && (
        <div className="space-y-4 w-full max-w-6xl">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-2xl font-bold text-neon-cyan">
              LEVEL {LEVELS[currentLevel].id}: {LEVELS[currentLevel].name}
            </h3>
            <Button
              onClick={() => setGameState("menu")}
              variant="outline"
              className="border-neon-orange text-neon-orange bg-transparent"
            >
              EXIT
            </Button>
          </div>

          <GameCanvas
            level={LEVELS[currentLevel]}
            onLevelComplete={handleLevelComplete}
            onPlayerDeath={handlePlayerDeath}
            isPaused={isPaused}
          />

          <div className="text-center text-sm text-muted-foreground">
            TAP or SWIPE UP to jump • SWIPE LEFT/RIGHT to move
          </div>

          {!hasPremium && (
            <div className="mt-4">
              <AdSenseBanner slot="1122334455" format="horizontal" />
            </div>
          )}
        </div>
      )}

      {gameState === "complete" && (
        <div className="text-center space-y-6 max-w-md">
          <h2 className="text-4xl font-bold text-neon-cyan glitch">LEVEL COMPLETE!</h2>

          <div className="space-y-4 bg-card border-2 border-neon-purple rounded-lg p-6 neon-glow-purple">
            <div className="text-neon-purple text-lg">REWARDS</div>
            <div className="flex justify-around">
              <div>
                <div className="text-3xl font-bold text-neon-cyan">{LEVELS[currentLevel].coinReward}</div>
                <div className="text-sm text-muted-foreground">COINS</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-neon-orange">{LEVELS[currentLevel].xpReward}</div>
                <div className="text-sm text-muted-foreground">XP</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => {
                if (currentLevel < LEVELS.length - 1) {
                  startLevel(currentLevel + 1)
                } else {
                  setGameState("menu")
                }
              }}
              className="w-full h-12 bg-neon-cyan text-black hover:bg-neon-cyan/80 neon-glow-cyan"
            >
              {currentLevel < LEVELS.length - 1 ? "NEXT LEVEL" : "FINISH"}
            </Button>

            <Button
              onClick={() => setGameState("levelSelect")}
              variant="outline"
              className="w-full h-12 border-neon-purple text-neon-purple bg-transparent"
            >
              LEVEL SELECT
            </Button>
          </div>
        </div>
      )}

      {gameState === "death" && (
        <DeathScreen
          onContinue={handleContinue}
          onRestart={handleRestart}
          onMenu={() => setGameState("menu")}
          hasPremium={hasPremium}
        />
      )}

      {gameState === "interstitial" && <InterstitialAd onComplete={() => setGameState("complete")} />}

      {gameState === "shop" && (
        <ShopScreen coins={totalCoins} onBack={() => setGameState("menu")} onPurchase={handlePurchase} />
      )}

      {gameState === "leaderboard" && (
        <LeaderboardScreen playerScore={totalXP} playerLevel={currentLevel + 1} onBack={() => setGameState("menu")} />
      )}

      {gameState === "daily" && (
        <DailyChallengeScreen
          onBack={() => setGameState("menu")}
          onStartChallenge={() => setGameState("levelSelect")}
        />
      )}

      {gameState === "levelLocked" && lockedLevelId && (
        <LevelLockedModal
          levelId={lockedLevelId}
          onClose={() => setGameState("levelSelect")}
          onUnlock={handleLevelUnlock}
          coins={totalCoins}
          onSpendCoins={(amount) => setTotalCoins((prev) => prev - amount)}
        />
      )}

      {showPremiumModal && (
        <PremiumModal
          onClose={() => setShowPremiumModal(false)}
          onPurchase={handlePremiumPurchase}
          coins={totalCoins}
        />
      )}
    </main>
  )
}
