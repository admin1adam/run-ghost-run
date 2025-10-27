import type { Ghost, PlayerInput } from "./types"
import { LevelLockoutManager } from "./level-lockout"

export class GhostStorage {
  private static readonly STORAGE_KEY = "timeloop_ghosts"
  private static readonly MAX_GHOSTS_PER_LEVEL = 10

  // Save ghost recording for a level
  static saveGhost(levelId: number, inputs: PlayerInput[]): void {
    const ghosts = this.getGhostsForLevel(levelId)

    const newGhost: Ghost = {
      id: `ghost-${Date.now()}`,
      inputs: [...inputs],
      currentFrame: 0,
      opacity: 0.4,
      color: this.getGhostColor(ghosts.length),
    }

    ghosts.push(newGhost)

    // Keep only the most recent ghosts
    if (ghosts.length > this.MAX_GHOSTS_PER_LEVEL) {
      ghosts.shift()
    }

    this.saveGhostsForLevel(levelId, ghosts)

    if (ghosts.length >= this.MAX_GHOSTS_PER_LEVEL) {
      LevelLockoutManager.lockLevel(levelId)
      console.log(`[v0] Ghost limit reached for level ${levelId}. Level locked!`)
    }
  }

  // Get all ghosts for a level
  static getGhostsForLevel(levelId: number): Ghost[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      if (!data) return []

      const allGhosts = JSON.parse(data) as Record<string, Ghost[]>
      return allGhosts[levelId.toString()] || []
    } catch (error) {
      console.error("Failed to load ghosts:", error)
      return []
    }
  }

  // Save ghosts for a level
  private static saveGhostsForLevel(levelId: number, ghosts: Ghost[]): void {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      const allGhosts = data ? (JSON.parse(data) as Record<string, Ghost[]>) : {}

      allGhosts[levelId.toString()] = ghosts
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allGhosts))
    } catch (error) {
      console.error("Failed to save ghosts:", error)
    }
  }

  // Clear ghosts for a level
  static clearGhostsForLevel(levelId: number): void {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      if (!data) return

      const allGhosts = JSON.parse(data) as Record<string, Ghost[]>
      delete allGhosts[levelId.toString()]
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allGhosts))
    } catch (error) {
      console.error("Failed to clear ghosts:", error)
    }
  }

  // Get ghost color based on index
  private static getGhostColor(index: number): string {
    const colors = [
      "#00FFFF", // Cyan
      "#9B51E0", // Purple
      "#FF6F3C", // Orange
      "#00FF88", // Green
      "#FF00FF", // Magenta
      "#FFD700", // Gold
      "#FF1493", // Deep Pink
      "#00CED1", // Dark Turquoise
      "#FF4500", // Orange Red
      "#7FFF00", // Chartreuse
    ]
    return colors[index % colors.length]
  }

  // Get best time for a level (shortest recording)
  static getBestTime(levelId: number): number | null {
    const ghosts = this.getGhostsForLevel(levelId)
    if (ghosts.length === 0) return null

    const times = ghosts.map((ghost) => ghost.inputs.length)
    return Math.min(...times)
  }

  // Clear all ghosts
  static clearAll(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
    } catch (error) {
      console.error("Failed to clear all ghosts:", error)
    }
  }

  static getMaxGhosts(): number {
    return this.MAX_GHOSTS_PER_LEVEL
  }
}
