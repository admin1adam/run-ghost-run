export interface Vector2 {
  x: number
  y: number
}

export interface Platform {
  x: number
  y: number
  width: number
  height: number
  type: "static" | "moving" | "switch" | "breakable"
  movingPath?: Vector2[]
  isActive?: boolean
}

export interface Obstacle {
  x: number
  y: number
  width: number
  height: number
  type: "spike" | "laser" | "moving" | "boss" | "enemy"
  movingPath?: Vector2[]
  enemyType?: "patrol" | "chase" | "jump"
  speed?: number
  health?: number
}

export interface Pickup {
  x: number
  y: number
  type: "coin" | "xp" | "powerup"
  collected: boolean
}

export interface PlayerInput {
  timestamp: number
  x: number
  y: number
  velocityX: number
  velocityY: number
  isJumping: boolean
  action?: "jump" | "interact"
}

export interface Ghost {
  id: string
  inputs: PlayerInput[]
  currentFrame: number
  opacity: number
  color: string
}

export interface LevelData {
  id: number
  name: string
  duration: number // seconds
  platforms: Platform[]
  obstacles: Obstacle[]
  pickups: Pickup[]
  spawnPoint: Vector2
  exitPoint: Vector2
  maxGhosts: number
  coinReward: number
  xpReward: number
  storyFragment?: string
  hasChoice?: boolean
}

export interface GameState {
  currentLevel: number
  coins: number
  xp: number
  unlockedLevels: number[]
  completedLevels: number[]
  isPremium: boolean
  skins: string[]
  currentSkin: string
  trails: string[]
  currentTrail: string
  effects: string[]
  currentEffect: string
}

export interface Player {
  x: number
  y: number
  width: number
  height: number
  velocityX: number
  velocityY: number
  isGrounded: boolean
  isJumping: boolean
  health: number
}

export interface LevelTier {
  name: string
  startLevel: number
  endLevel: number
  color: string
  description: string
}
