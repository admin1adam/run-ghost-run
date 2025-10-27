"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Clock, Trophy, Star } from "lucide-react"

interface DailyChallengeScreenProps {
  onBack: () => void
  onStartChallenge: () => void
}

export function DailyChallengeScreen({ onBack, onStartChallenge }: DailyChallengeScreenProps) {
  const [timeUntilReset, setTimeUntilReset] = useState("")
  const [hasCompleted, setHasCompleted] = useState(false)

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      const diff = tomorrow.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeUntilReset(`${hours}h ${minutes}m ${seconds}s`)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  const todaysChallenges = [
    {
      id: 1,
      title: "Speed Runner",
      description: "Complete Level 3 in under 15 seconds",
      reward: 100,
      difficulty: "Medium",
      completed: false,
    },
    {
      id: 2,
      title: "Perfect Run",
      description: "Complete any level without dying",
      reward: 150,
      difficulty: "Hard",
      completed: false,
    },
    {
      id: 3,
      title: "Coin Collector",
      description: "Collect all coins in 3 different levels",
      reward: 75,
      difficulty: "Easy",
      completed: hasCompleted,
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-400"
      case "Medium":
        return "text-neon-orange"
      case "Hard":
        return "text-red-400"
      default:
        return "text-neon-cyan"
    }
  }

  return (
    <div className="max-w-4xl w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Calendar className="text-neon-cyan" size={32} />
          <h2 className="text-3xl font-bold text-neon-cyan">DAILY CHALLENGE</h2>
        </div>
        <Button onClick={onBack} variant="outline" className="border-neon-cyan text-neon-cyan bg-transparent">
          BACK
        </Button>
      </div>

      <Card className="bg-card border-2 border-neon-purple p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Clock className="text-neon-orange" size={32} />
            <div>
              <div className="text-sm text-muted-foreground">Time Until Reset</div>
              <div className="text-2xl font-mono text-neon-orange">{timeUntilReset}</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-muted-foreground">Completed Today</div>
            <div className="text-2xl font-mono text-neon-cyan">
              {todaysChallenges.filter((c) => c.completed).length}/{todaysChallenges.length}
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-neon-purple">Today's Challenges</h3>

        {todaysChallenges.map((challenge) => (
          <Card
            key={challenge.id}
            className={`p-6 border-2 ${
              challenge.completed ? "bg-neon-cyan/10 border-neon-cyan" : "bg-card border-neon-purple"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h4 className="text-xl font-bold text-neon-cyan">{challenge.title}</h4>
                  <span className={`text-sm font-mono ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <p className="text-muted-foreground">{challenge.description}</p>
                <div className="flex items-center gap-2 text-neon-purple">
                  <Trophy size={16} />
                  <span className="font-mono">+{challenge.reward} COINS</span>
                </div>
              </div>

              <div>
                {challenge.completed ? (
                  <Button disabled className="bg-neon-cyan text-black">
                    <Star size={16} className="mr-2" />
                    COMPLETED
                  </Button>
                ) : (
                  <Button onClick={onStartChallenge} className="bg-neon-purple text-white hover:bg-neon-purple/80">
                    START
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="bg-neon-purple/10 border-2 border-neon-purple p-6">
        <div className="flex items-start gap-4">
          <Star className="text-neon-purple mt-1" size={24} />
          <div className="space-y-2">
            <h4 className="font-bold text-neon-purple">Daily Streak Bonus</h4>
            <p className="text-sm text-muted-foreground">
              Complete all daily challenges for 7 days in a row to unlock exclusive rewards!
            </p>
            <div className="flex gap-2 mt-4">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div
                  key={day}
                  className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-mono ${
                    day <= 2 ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan" : "border-muted text-muted-foreground"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
