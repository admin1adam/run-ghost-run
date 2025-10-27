import type { Obstacle, Player, Platform } from "./types"

export class EnemyAI {
  private patrolDirection: Map<string, number> = new Map()
  private jumpCooldown: Map<string, number> = new Map()
  private readonly CHASE_ACTIVATION_DISTANCE = 200
  private readonly CHASE_DEACTIVATION_DISTANCE = 300

  updateEnemy(enemy: Obstacle, player: Player, platforms: Platform[], deltaTime = 1): void {
    if (enemy.type !== "enemy") return

    switch (enemy.enemyType) {
      case "patrol":
        this.updatePatrol(enemy)
        break
      case "chase":
        this.updateChase(enemy, player)
        break
      case "jump":
        this.updateJump(enemy, player, platforms)
        break
    }
  }

  private updatePatrol(enemy: Obstacle): void {
    const speed = (enemy.speed || 1.5) * 0.8
    const enemyId = `${enemy.x}-${enemy.y}`

    if (!this.patrolDirection.has(enemyId)) {
      this.patrolDirection.set(enemyId, 1)
    }

    let direction = this.patrolDirection.get(enemyId)!

    enemy.x += speed * direction

    const patrolMin = Math.max(50, enemy.x - 150)
    const patrolMax = Math.min(750, enemy.x + 150)

    if (enemy.x <= patrolMin || enemy.x >= patrolMax) {
      direction *= -1
      this.patrolDirection.set(enemyId, direction)
    }
  }

  private updateChase(enemy: Obstacle, player: Player): void {
    const speed = (enemy.speed || 2) * 0.6
    const dx = player.x - enemy.x
    const dy = player.y - enemy.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    // Only chase if player is within activation range
    if (distance < this.CHASE_ACTIVATION_DISTANCE && distance > 10) {
      enemy.x += (dx / distance) * speed
      enemy.y += (dy / distance) * speed
    } else if (distance >= this.CHASE_DEACTIVATION_DISTANCE) {
      // Return to patrol behavior when player is far
      this.updatePatrol(enemy)
    }
  }

  private updateJump(enemy: Obstacle, player: Player, platforms: Platform[]): void {
    const speed = (enemy.speed || 1.5) * 0.8
    const enemyId = `${enemy.x}-${enemy.y}`
    const now = Date.now()

    if (!this.patrolDirection.has(enemyId)) {
      this.patrolDirection.set(enemyId, 1)
    }

    let direction = this.patrolDirection.get(enemyId)!
    enemy.x += speed * direction

    if (enemy.x <= 50 || enemy.x >= 750) {
      direction *= -1
      this.patrolDirection.set(enemyId, direction)
    }

    const lastJump = this.jumpCooldown.get(enemyId) || 0
    if (now - lastJump > 3000) {
      const dx = Math.abs(player.x - enemy.x)
      if (dx < 150) {
        enemy.y -= 80
        this.jumpCooldown.set(enemyId, now)
      }
    }

    for (const platform of platforms) {
      if (
        enemy.x < platform.x + platform.width &&
        enemy.x + enemy.width > platform.x &&
        enemy.y + enemy.height >= platform.y &&
        enemy.y + enemy.height <= platform.y + platform.height + 10
      ) {
        enemy.y = platform.y - enemy.height
      }
    }
  }

  reset(): void {
    this.patrolDirection.clear()
    this.jumpCooldown.clear()
  }
}
