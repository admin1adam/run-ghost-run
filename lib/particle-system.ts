export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

export class ParticleSystem {
  private particles: Particle[] = []

  // Create explosion effect
  createExplosion(x: number, y: number, color: string, count = 20) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count
      const speed = 3 + Math.random() * 3
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 60,
        maxLife: 60,
        color,
        size: 3 + Math.random() * 3,
      })
    }
  }

  // Create trail effect
  createTrail(x: number, y: number, color: string) {
    this.particles.push({
      x: x + Math.random() * 10 - 5,
      y: y + Math.random() * 10 - 5,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: 30,
      maxLife: 30,
      color,
      size: 2 + Math.random() * 2,
    })
  }

  // Create coin collect effect
  createCoinEffect(x: number, y: number) {
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10
      const speed = 2 + Math.random() * 2
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 40,
        maxLife: 40,
        color: "#FFD700",
        size: 2 + Math.random() * 2,
      })
    }
  }

  // Create jump effect
  createJumpEffect(x: number, y: number) {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: x + Math.random() * 30,
        y: y + 30,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 2,
        life: 20,
        maxLife: 20,
        color: "#00FFFF",
        size: 2,
      })
    }
  }

  // Update all particles
  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.2 // Gravity
      p.life--

      if (p.life <= 0) {
        this.particles.splice(i, 1)
      }
    }
  }

  // Draw all particles
  draw(ctx: CanvasRenderingContext2D) {
    for (const p of this.particles) {
      const alpha = p.life / p.maxLife
      ctx.globalAlpha = alpha
      ctx.fillStyle = p.color
      ctx.shadowColor = p.color
      ctx.shadowBlur = 5
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
      ctx.globalAlpha = 1
    }
  }

  // Clear all particles
  clear() {
    this.particles = []
  }

  // Get particle count
  getCount(): number {
    return this.particles.length
  }
}
