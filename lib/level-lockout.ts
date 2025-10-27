export interface LevelLockout {
  levelId: number
  lockedUntil: number // timestamp
  adsWatched: number // how many ads watched (need 2 to unlock)
}

export class LevelLockoutManager {
  private static readonly STORAGE_KEY = "timeloop_lockouts"
  private static readonly LOCKOUT_DURATION = 30 * 60 * 1000 // 30 minutes in milliseconds
  private static readonly UNLOCK_COIN_COST = 100 // coins to unlock immediately
  private static readonly ADS_REQUIRED = 2 // number of ads to watch

  // Check if a level is locked
  static isLevelLocked(levelId: number): boolean {
    const lockout = this.getLockout(levelId)
    if (!lockout) return false

    const now = Date.now()
    if (now >= lockout.lockedUntil) {
      // Lockout expired, remove it
      this.removeLockout(levelId)
      return false
    }

    return true
  }

  // Lock a level (when ghost limit reached)
  static lockLevel(levelId: number): void {
    const now = Date.now()
    const lockout: LevelLockout = {
      levelId,
      lockedUntil: now + this.LOCKOUT_DURATION,
      adsWatched: 0,
    }

    this.saveLockout(lockout)
    console.log(`[v0] Level ${levelId} locked for 30 minutes`)
  }

  // Watch an ad to reduce lockout
  static watchAdForUnlock(levelId: number): boolean {
    const lockout = this.getLockout(levelId)
    if (!lockout) return false

    lockout.adsWatched += 1

    if (lockout.adsWatched >= this.ADS_REQUIRED) {
      // Unlock the level
      this.removeLockout(levelId)
      console.log(`[v0] Level ${levelId} unlocked after watching ${this.ADS_REQUIRED} ads`)
      return true
    } else {
      // Save progress
      this.saveLockout(lockout)
      console.log(`[v0] Ad watched for level ${levelId}: ${lockout.adsWatched}/${this.ADS_REQUIRED}`)
      return false
    }
  }

  // Unlock with coins
  static unlockWithCoins(levelId: number): boolean {
    const lockout = this.getLockout(levelId)
    if (!lockout) return false

    this.removeLockout(levelId)
    console.log(`[v0] Level ${levelId} unlocked with coins`)
    return true
  }

  // Get remaining time for lockout
  static getRemainingTime(levelId: number): number {
    const lockout = this.getLockout(levelId)
    if (!lockout) return 0

    const now = Date.now()
    const remaining = lockout.lockedUntil - now
    return Math.max(0, remaining)
  }

  // Get lockout info
  static getLockoutInfo(levelId: number): LevelLockout | null {
    return this.getLockout(levelId)
  }

  // Get unlock coin cost
  static getUnlockCost(): number {
    return this.UNLOCK_COIN_COST
  }

  // Get ads required
  static getAdsRequired(): number {
    return this.ADS_REQUIRED
  }

  // Private methods
  private static getLockout(levelId: number): LevelLockout | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      if (!data) return null

      const lockouts = JSON.parse(data) as LevelLockout[]
      return lockouts.find((l) => l.levelId === levelId) || null
    } catch (error) {
      console.error("Failed to load lockouts:", error)
      return null
    }
  }

  private static saveLockout(lockout: LevelLockout): void {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      let lockouts = data ? (JSON.parse(data) as LevelLockout[]) : []

      // Remove existing lockout for this level
      lockouts = lockouts.filter((l) => l.levelId !== lockout.levelId)

      // Add new lockout
      lockouts.push(lockout)

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(lockouts))
    } catch (error) {
      console.error("Failed to save lockout:", error)
    }
  }

  private static removeLockout(levelId: number): void {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      if (!data) return

      let lockouts = JSON.parse(data) as LevelLockout[]
      lockouts = lockouts.filter((l) => l.levelId !== levelId)

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(lockouts))
    } catch (error) {
      console.error("Failed to remove lockout:", error)
    }
  }
}
