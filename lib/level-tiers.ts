import type { LevelTier } from "./types"

export const LEVEL_TIERS: LevelTier[] = [
  {
    name: "BEGINNER LOOPS",
    startLevel: 1,
    endLevel: 10,
    color: "#00FFFF",
    description: "Learn the basics of time manipulation",
  },
  {
    name: "ADVANCED PARADOX",
    startLevel: 11,
    endLevel: 20,
    color: "#9B51E0",
    description: "Face deadly enemies and complex puzzles",
  },
  {
    name: "MASTER TIMELINE",
    startLevel: 21,
    endLevel: 30,
    color: "#FF6F3C",
    description: "Ultimate challenges await the brave",
  },
]

export function getLevelTier(levelId: number): LevelTier {
  return LEVEL_TIERS.find((tier) => levelId >= tier.startLevel && levelId <= tier.endLevel) || LEVEL_TIERS[0]
}
