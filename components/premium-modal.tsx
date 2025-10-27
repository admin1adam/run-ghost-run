"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Crown, X, Sparkles, Zap, Star } from "lucide-react"

interface PremiumModalProps {
  onClose: () => void
  onPurchase: () => void
  coins: number
}

export function PremiumModal({ onClose, onPurchase, coins }: PremiumModalProps) {
  const premiumPrice = 999

  const features = [
    { icon: X, text: "Remove all ads", color: "text-red-400" },
    { icon: Zap, text: "Unlimited continues", color: "text-yellow-400" },
    { icon: Crown, text: "10 exclusive premium skins", color: "text-yellow-400" },
    { icon: Sparkles, text: "5 exclusive trail effects", color: "text-purple-400" },
    { icon: Star, text: "Double XP & coin rewards", color: "text-cyan-400" },
    { icon: Zap, text: "Unlock all powerups", color: "text-orange-400" },
    { icon: Crown, text: "Premium badge & profile", color: "text-yellow-400" },
    { icon: Sparkles, text: "Early access to new levels", color: "text-purple-400" },
  ]

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card className="max-w-lg w-full bg-card border-2 border-yellow-400 p-6 md:p-8 space-y-6 relative neon-glow-gold animate-slide-up overflow-y-auto max-h-[90vh]">
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X size={20} />
        </Button>

        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-yellow-400/20 p-4 rounded-full animate-pulse">
              <Crown className="text-yellow-400" size={48} />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 premium-shimmer">GO PREMIUM</h2>
          <p className="text-muted-foreground text-sm md:text-base">Unlock the full TIME LOOP experience</p>
        </div>

        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3 text-foreground text-sm md:text-base">
              <div className="bg-neon-cyan/20 rounded-full p-1.5 flex-shrink-0">
                <feature.icon className={feature.color} size={16} />
              </div>
              <span>{feature.text}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-6 space-y-4">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">One-time purchase</div>
            <div className="text-3xl md:text-4xl font-bold text-yellow-400 font-mono">{premiumPrice} COINS</div>
            <div className="text-xs text-muted-foreground mt-2">Lifetime access • No subscriptions</div>
          </div>

          {coins >= premiumPrice ? (
            <Button
              onClick={onPurchase}
              className="w-full h-12 md:h-14 bg-yellow-400 text-black hover:bg-yellow-400/80 text-base md:text-lg font-bold neon-glow-gold"
            >
              <Crown className="mr-2" size={20} />
              UNLOCK PREMIUM
            </Button>
          ) : (
            <div className="space-y-3">
              <Button disabled className="w-full h-12 md:h-14 bg-muted text-muted-foreground text-base md:text-lg">
                NOT ENOUGH COINS
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                You need {premiumPrice - coins} more coins
              </div>
              <div className="text-center text-xs text-neon-cyan">Complete more levels to earn coins!</div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
