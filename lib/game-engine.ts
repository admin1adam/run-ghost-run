import type { Player, Platform, Obstacle, Pickup, Vector2, PlayerInput, Ghost } from "./types"
import { EnemyAI } from "./enemy-ai"

export class GameEngine {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private player: Player
  private ghosts: Ghost[] = []
  private currentInputs: PlayerInput[] = []
  private frameCount = 0
  private isRecording = true
  private enemyAI: EnemyAI = new EnemyAI()
  private invincibilityFrames = 0
  private readonly INVINCIBILITY_DURATION = 90 // 1.5 seconds at 60fps

  // Physics constants
  private readonly GRAVITY = 0.6
  private readonly JUMP_FORCE = -16 // Increased from -12 to -16 for higher jumps
  private readonly MOVE_SPEED = 5
  private readonly AIR_CONTROL = 0.4 // New: Air control multiplier
  private readonly FRICTION = 0.8
  private readonly MAX_FALL_SPEED = 15

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")!

    // Initialize player
    this.player = {
      x: 50,
      y: 400,
      width: 30,
      height: 30,
      velocityX: 0,
      velocityY: 0,
      isGrounded: false,
      isJumping: false,
      health: 100,
    }
  }

  initPlayer(spawnPoint: Vector2) {
    this.player.x = spawnPoint.x
    this.player.y = spawnPoint.y
    this.player.velocityX = 0
    this.player.velocityY = 0
    this.player.isGrounded = false
    this.player.isJumping = false
    this.player.health = 100
    this.currentInputs = []
    this.frameCount = 0
    this.isRecording = true
    this.enemyAI.reset()
    this.invincibilityFrames = this.INVINCIBILITY_DURATION
  }

  recordInput(action?: "jump" | "interact") {
    if (!this.isRecording) return

    const input: PlayerInput = {
      timestamp: this.frameCount,
      x: this.player.x,
      y: this.player.y,
      velocityX: this.player.velocityX,
      velocityY: this.player.velocityY,
      isJumping: this.player.isJumping,
      action,
    }
    this.currentInputs.push(input)
  }

  getCurrentRecording(): PlayerInput[] {
    return [...this.currentInputs]
  }

  stopRecording() {
    this.isRecording = false
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording
  }

  // Create ghost from recorded inputs
  createGhost(): Ghost {
    const colors = ["#00FFFF", "#9B51E0", "#FF6F3C", "#00FF88", "#FF00FF"]
    return {
      id: `ghost-${Date.now()}`,
      inputs: [...this.currentInputs],
      currentFrame: 0,
      opacity: 0.4,
      color: colors[this.ghosts.length % colors.length],
    }
  }

  loadGhosts(ghosts: Ghost[]) {
    this.ghosts = ghosts.map((ghost) => ({
      ...ghost,
      currentFrame: 0, // Reset playback
    }))
  }

  // Add ghost to the game
  addGhost(ghost: Ghost) {
    this.ghosts.push(ghost)
  }

  // Clear all ghosts
  clearGhosts() {
    this.ghosts = []
  }

  // Get current ghosts
  getGhosts(): Ghost[] {
    return this.ghosts
  }

  updatePhysics(platforms: Platform[], enemies: Obstacle[] = []) {
    if (this.invincibilityFrames > 0) {
      this.invincibilityFrames--
    }

    // Apply gravity
    this.player.velocityY += this.GRAVITY

    // Limit fall speed
    if (this.player.velocityY > this.MAX_FALL_SPEED) {
      this.player.velocityY = this.MAX_FALL_SPEED
    }

    // Apply friction
    this.player.velocityX *= this.FRICTION

    // Update position
    this.player.x += this.player.velocityX
    this.player.y += this.player.velocityY

    // Check ground collision
    this.player.isGrounded = false

    for (const platform of platforms) {
      if (this.checkPlatformCollision(this.player, platform)) {
        // Land on platform
        if (this.player.velocityY > 0) {
          this.player.y = platform.y - this.player.height
          this.player.velocityY = 0
          this.player.isGrounded = true
          this.player.isJumping = false
        }
      }
    }

    // Update enemies
    for (const enemy of enemies) {
      if (enemy.type === "enemy") {
        this.enemyAI.updateEnemy(enemy, this.player, platforms)
      }
    }

    // Boundary checks
    if (this.player.x < 0) this.player.x = 0
    if (this.player.x + this.player.width > this.canvas.width) {
      this.player.x = this.canvas.width - this.player.width
    }
    if (this.player.y > this.canvas.height) {
      this.player.health = 0 // Fall death
    }

    this.recordInput()
    this.frameCount++
  }

  // Check collision with platform
  checkPlatformCollision(entity: Player, platform: Platform): boolean {
    return (
      entity.x < platform.x + platform.width &&
      entity.x + entity.width > platform.x &&
      entity.y + entity.height >= platform.y &&
      entity.y + entity.height <= platform.y + platform.height + 10 &&
      entity.velocityY >= 0
    )
  }

  // Check collision with obstacle
  checkObstacleCollision(obstacle: Obstacle): boolean {
    if (this.isPlayerInvincible()) {
      return false
    }

    return (
      this.player.x < obstacle.x + obstacle.width &&
      this.player.x + this.player.width > obstacle.x &&
      this.player.y < obstacle.y + obstacle.height &&
      this.player.y + this.player.height > obstacle.y
    )
  }

  // Check collision with pickup
  checkPickupCollision(pickup: Pickup): boolean {
    const pickupSize = 20
    return (
      this.player.x < pickup.x + pickupSize &&
      this.player.x + this.player.width > pickup.x &&
      this.player.y < pickup.y + pickupSize &&
      this.player.y + this.player.height > pickup.y
    )
  }

  // Check if player reached exit
  checkExitCollision(exitPoint: Vector2): boolean {
    const exitSize = 40
    return (
      this.player.x < exitPoint.x + exitSize &&
      this.player.x + this.player.width > exitPoint.x &&
      this.player.y < exitPoint.y + exitSize &&
      this.player.y + this.player.height > exitPoint.y
    )
  }

  // Player jump
  jump() {
    if (this.player.isGrounded && !this.player.isJumping) {
      this.player.velocityY = this.JUMP_FORCE
      this.player.isJumping = true
      this.player.isGrounded = false
      this.recordInput("jump")
    }
  }

  // Player move
  move(direction: number) {
    if (this.player.isGrounded) {
      this.player.velocityX = direction * this.MOVE_SPEED
    } else {
      // Air control: allow movement while jumping but with reduced control
      this.player.velocityX += direction * this.MOVE_SPEED * this.AIR_CONTROL
      // Clamp air velocity to prevent excessive speed
      const maxAirSpeed = this.MOVE_SPEED * 1.5
      this.player.velocityX = Math.max(-maxAirSpeed, Math.min(maxAirSpeed, this.player.velocityX))
    }
  }

  // Update ghosts
  updateGhosts() {
    for (const ghost of this.ghosts) {
      if (ghost.currentFrame < ghost.inputs.length) {
        ghost.currentFrame++
      }
    }
  }

  // Get player state
  getPlayer(): Player {
    return this.player
  }

  // Get current frame
  getFrame(): number {
    return this.frameCount
  }

  // Reset frame count
  resetFrame() {
    this.frameCount = 0
  }

  isPlayerInvincible(): boolean {
    return this.invincibilityFrames > 0
  }

  getInvincibilityProgress(): number {
    return this.invincibilityFrames / this.INVINCIBILITY_DURATION
  }
}
