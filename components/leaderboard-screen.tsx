"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trophy, Medal, Award, Crown } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  username: string
  score: number
  level: number
  isPlayer?: boolean
}

interface LeaderboardScreenProps {
  playerScore: number
  playerLevel: number
  onBack: () => void
}

export function LeaderboardScreen({ playerScore, playerLevel, onBack }: LeaderboardScreenProps) {
  const [selectedTab, setSelectedTab] = useState<"global" | "friends" | "daily">("global")
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    // Generate mock leaderboard data
    const mockData: LeaderboardEntry[] = [
      { rank: 1, username: "TimeLooper", score: 15420, level: 10 },
      { rank: 2, username: "GhostMaster", score: 14890, level: 10 },
      { rank: 3, username: "LoopBreaker", score: 13750, level: 10 },
      { rank: 4, username: "CycleKing", score: 12980, level: 9 },
      { rank: 5, username: "PhantomRun", score: 11560, level: 9 },
      { rank: 6, username: "TimeWarp", score: 10340, level: 8 },
      { rank: 7, username: "LoopLegend", score: 9870, level: 8 },
      { rank: 8, username: "GhostRider", score: 8920, level: 7 },
      { rank: 9, username: "CyclePro", score: 7650, level: 7 },
      { rank: 10, username: "You", score: playerScore, level: playerLevel, isPlayer: true },
    ]

    setLeaderboard(
      mockData
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
        })),
    )
  }, [playerScore, playerLevel])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-400" size={24} />
      case 2:
        return <Medal className="text-gray-400" size={24} />
      case 3:
        return <Award className="text-orange-400" size={24} />
      default:
        return <div className="text-neon-cyan font-mono text-xl w-6 text-center">{rank}</div>
    }
  }

  return (
    <div className="max-w-4xl w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Trophy className="text-neon-orange" size={32} />
          <h2 className="text-3xl font-bold text-neon-orange">LEADERBOARD</h2>
        </div>
        <Button onClick={onBack} variant="outline" className="border-neon-cyan text-neon-cyan bg-transparent">
          BACK
        </Button>
      </div>

      <div className="flex gap-4 border-b border-border pb-4">
        <Button
          onClick={() => setSelectedTab("global")}
          variant={selectedTab === "global" ? "default" : "outline"}
          className={selectedTab === "global" ? "bg-neon-orange text-black" : "border-neon-orange text-neon-orange"}
        >
          GLOBAL
        </Button>
        <Button
          onClick={() => setSelectedTab("friends")}
          variant={selectedTab === "friends" ? "default" : "outline"}
          className={selectedTab === "friends" ? "bg-neon-purple text-white" : "border-neon-purple text-neon-purple"}
        >
          FRIENDS
        </Button>
        <Button
          onClick={() => setSelectedTab("daily")}
          variant={selectedTab === "daily" ? "default" : "outline"}
          className={selectedTab === "daily" ? "bg-neon-cyan text-black" : "border-neon-cyan text-neon-cyan"}
        >
          DAILY
        </Button>
      </div>

      <div className="space-y-2">
        {leaderboard.map((entry) => (
          <Card
            key={entry.rank}
            className={`p-4 border-2 ${
              entry.isPlayer ? "bg-neon-cyan/10 border-neon-cyan neon-glow-cyan" : "bg-card border-neon-purple"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 flex justify-center">{getRankIcon(entry.rank)}</div>
                <div className="flex-1">
                  <div className={`font-bold text-lg ${entry.isPlayer ? "text-neon-cyan" : "text-foreground"}`}>
                    {entry.username}
                  </div>
                  <div className="text-sm text-muted-foreground">Level {entry.level}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-neon-purple font-mono text-xl">{entry.score.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">XP</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedTab === "friends" && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Connect with friends to see their scores!</p>
        </div>
      )}
    </div>
  )
}
