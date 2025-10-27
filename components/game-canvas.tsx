"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { GameEngine } from "@/lib/game-engine"
import { GhostStorage } from "@/lib/ghost-storage"
import { ParticleSystem } from "@/lib/particle-system"
import type { LevelData, Ghost, Platform, Obstacle, Pickup } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { RotateCcw, Trash2 } from "lucide-react"

interface GameCanvasProps {
  level: LevelData
  onLevelComplete: (coins: number, xp: number) => void
  onPlayerDeath: () => void
  isPaused: boolean
}

export function GameCanvas({ level, onLevelComplete, onPlayerDeath, isPaused }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<GameEngine | null>(null)
  const particleSystemRef = useRef<ParticleSystem>(new ParticleSystem())
  const [timeLeft, setTimeLeft] = useState(level.duration)
  const [collectedCoins, setCollectedCoins] = useState(0)
  const [collectedXP, setCollectedXP] = useState(0)
  const animationFrameRef = useRef<number>()
  const startTimeRef = useRef<number>(Date.now())
  const [isRecording, setIsRecording] = useState(true)
  const [ghostCount, setGhostCount] = useState(0)
  const lastJumpTimeRef = useRef<number>(0)
  const [equippedSkin, setEquippedSkin] = useState<string>("skin-default")

  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const updateCanvasSize = () => {
      const maxWidth = Math.min(window.innerWidth - 32, 800)
      const maxHeight = Math.min(window.innerHeight - 200, 500)
      const aspectRatio = 800 / 500

      let width = maxWidth
      let height = width / aspectRatio

      if (height > maxHeight) {
        height = maxHeight
        width = height * aspectRatio
      }

      canvas.width = 800
      canvas.height = 500
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    return () => window.removeEventListener("resize", updateCanvasSize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    engineRef.current = new GameEngine(canvas)
    engineRef.current.initPlayer(level.spawnPoint)

    const savedGhosts = GhostStorage.getGhostsForLevel(level.id)
    engineRef.current.loadGhosts(savedGhosts)
    setGhostCount(savedGhosts.length)

    const ctx = canvas.getContext("2d")!
    const pickups = [...level.pickups]
    const particles = particleSystemRef.current
    const obstacles = level.obstacles.map((obs) => ({ ...obs }))

    const gameLoop = () => {
      if (isPaused) {
        animationFrameRef.current = requestAnimationFrame(gameLoop)
        return
      }

      const engine = engineRef.current!

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#0B0B0F")
      gradient.addColorStop(1, "#1a0a2e")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const player = engine.getPlayer()

      if (Math.abs(player.velocityX) > 1 || Math.abs(player.velocityY) > 1) {
        particles.createTrail(player.x + player.width / 2, player.y + player.height / 2, "#00FFFF")
      }

      const enemies = obstacles.filter((obs) => obs.type === "enemy")
      engine.updatePhysics(level.platforms, enemies)
      engine.updateGhosts()
      particles.update()

      setIsRecording(engine.isCurrentlyRecording())

      for (const platform of level.platforms) {
        drawPlatform(ctx, platform)
      }

      for (const obstacle of obstacles) {
        drawObstacle(ctx, obstacle)
      }

      for (const pickup of pickups) {
        if (!pickup.collected) {
          drawPickup(ctx, pickup)

          if (engine.checkPickupCollision(pickup)) {
            pickup.collected = true
            particles.createCoinEffect(pickup.x + 10, pickup.y + 10)

            if (pickup.type === "coin") {
              setCollectedCoins((prev) => prev + 1)
            } else if (pickup.type === "xp") {
              setCollectedXP((prev) => prev + 10)
            }
          }
        }
      }

      drawExit(ctx, level.exitPoint)

      const ghosts = engine.getGhosts()
      for (const ghost of ghosts) {
        drawGhost(ctx, ghost)
      }

      drawPlayer(ctx, player)

      particles.draw(ctx)

      for (const obstacle of obstacles) {
        if (engine.checkObstacleCollision(obstacle)) {
          particles.createExplosion(player.x + player.width / 2, player.y + player.height / 2, "#FF6F3C", 30)
          setTimeout(() => handleDeath(), 300)
          return
        }
      }

      if (engine.checkExitCollision(level.exitPoint)) {
        particles.createExplosion(player.x + player.width / 2, player.y + player.height / 2, "#00FF88", 40)
        setTimeout(() => handleLevelComplete(), 300)
        return
      }

      const elapsed = (Date.now() - startTimeRef.current) / 1000
      const remaining = Math.max(0, level.duration - elapsed)
      setTimeLeft(Math.ceil(remaining))

      if (remaining <= 0) {
        particles.createExplosion(player.x + player.width / 2, player.y + player.height / 2, "#FF6F3C", 30)
        setTimeout(() => handleDeath(), 300)
        return
      }

      if (player.health <= 0) {
        particles.createExplosion(player.x + player.width / 2, player.y + player.height / 2, "#FF6F3C", 30)
        setTimeout(() => handleDeath(), 300)
        return
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    const handleDeath = () => {
      const engine = engineRef.current
      if (!engine) return

      const recording = engine.getCurrentRecording()
      if (recording.length > 30) {
        GhostStorage.saveGhost(level.id, recording)
      }
      engine.stopRecording()
      onPlayerDeath()
    }

    const handleLevelComplete = () => {
      const engine = engineRef.current
      if (!engine) return

      const recording = engine.getCurrentRecording()
      GhostStorage.saveGhost(level.id, recording)
      engine.stopRecording()
      onLevelComplete(collectedCoins, collectedXP)
    }

    gameLoop()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [level, isPaused, onLevelComplete, onPlayerDeath, collectedCoins, collectedXP])

  useEffect(() => {
    const savedSkin = localStorage.getItem("equippedSkin")
    if (savedSkin) {
      setEquippedSkin(savedSkin)
    }
  }, [])

  const handleClearGhosts = () => {
    GhostStorage.clearGhostsForLevel(level.id)
    if (engineRef.current) {
      engineRef.current.loadGhosts([])
      setGhostCount(0)
    }
  }

  const handleRestart = () => {
    startTimeRef.current = Date.now()
    setTimeLeft(level.duration)
    setCollectedCoins(0)
    setCollectedXP(0)
    particleSystemRef.current.clear()

    if (engineRef.current) {
      engineRef.current.initPlayer(level.spawnPoint)
      const savedGhosts = GhostStorage.getGhostsForLevel(level.id)
      engineRef.current.loadGhosts(savedGhosts)
      setGhostCount(savedGhosts.length)
    }
  }

  const drawPlayer = (ctx: CanvasRenderingContext2D, player: any) => {
    const engine = engineRef.current

    if (engine && engine.isPlayerInvincible()) {
      const shieldRadius = 25
      const shieldProgress = engine.getInvincibilityProgress()

      ctx.strokeStyle = `rgba(0, 255, 255, ${shieldProgress * 0.6})`
      ctx.lineWidth = 3
      ctx.shadowColor = "#00FFFF"
      ctx.shadowBlur = 15

      ctx.beginPath()
      ctx.arc(player.x + player.width / 2, player.y + player.height / 2, shieldRadius, 0, Math.PI * 2)
      ctx.stroke()

      ctx.strokeStyle = `rgba(0, 255, 255, ${shieldProgress * 0.3})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(player.x + player.width / 2, player.y + player.height / 2, shieldRadius - 5, 0, Math.PI * 2)
      ctx.stroke()

      ctx.shadowBlur = 0
    }

    const skinColors: Record<string, string> = {
      "skin-default": "#00FFFF",
      "skin-purple": "#9B51E0",
      "skin-orange": "#FF6F3C",
      "skin-green": "#00FF88",
      "skin-pink": "#FF1493",
      "skin-blue": "#1E90FF",
      "skin-red": "#DC143C",
      "skin-yellow": "#FFD700",
      "skin-white": "#FFFFFF",
      "skin-gold": "#FFD700",
      "skin-rainbow": "#FF00FF",
      "skin-shadow": "#2F2F2F",
      "skin-crystal": "#B0E0E6",
      "skin-neon": "#39FF14",
      "skin-cosmic": "#4B0082",
      "skin-lava": "#FF4500",
      "skin-electric": "#00FFFF",
      "skin-toxic": "#7FFF00",
      "skin-diamond": "#B9F2FF",
      "skin-ultimate": "#FFD700",
    }

    const playerColor = skinColors[equippedSkin] || "#00FFFF"
    const pulseIntensity = 15 + Math.sin(Date.now() / 200) * 5

    // Special rendering for rainbow skin
    if (equippedSkin === "skin-rainbow") {
      const hue = (Date.now() / 10) % 360
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`
      ctx.shadowColor = `hsl(${hue}, 100%, 50%)`
    } else {
      ctx.fillStyle = playerColor
      ctx.shadowColor = playerColor
    }

    ctx.shadowBlur = pulseIntensity
    ctx.fillRect(player.x, player.y, player.width, player.height)
    ctx.shadowBlur = 0

    if (isRecording) {
      ctx.fillStyle = "#FF0000"
      ctx.beginPath()
      ctx.arc(player.x + player.width - 5, player.y + 5, 3, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const drawGhost = (ctx: CanvasRenderingContext2D, ghost: Ghost) => {
    if (ghost.currentFrame >= ghost.inputs.length) return

    const input = ghost.inputs[ghost.currentFrame]
    ctx.globalAlpha = ghost.opacity
    ctx.fillStyle = ghost.color
    ctx.shadowColor = ghost.color
    ctx.shadowBlur = 10
    ctx.fillRect(input.x, input.y, 30, 30)
    ctx.shadowBlur = 0
    ctx.globalAlpha = 1
  }

  const drawPlatform = (ctx: CanvasRenderingContext2D, platform: Platform) => {
    const color = platform.type === "switch" ? "#9B51E0" : "#00FFFF"
    ctx.fillStyle = color
    ctx.shadowColor = color
    ctx.shadowBlur = 8
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height)

    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.globalAlpha = 0.5
    ctx.strokeRect(platform.x, platform.y, platform.width, platform.height)
    ctx.globalAlpha = 1
    ctx.shadowBlur = 0
  }

  const drawObstacle = (ctx: CanvasRenderingContext2D, obstacle: Obstacle) => {
    const pulseIntensity = 12 + Math.sin(Date.now() / 150) * 8

    if (obstacle.type === "enemy") {
      let color = "#FF6F3C"
      if (obstacle.enemyType === "chase") color = "#FF0000"
      if (obstacle.enemyType === "jump") color = "#FF9900"

      ctx.fillStyle = color
      ctx.shadowColor = color
      ctx.shadowBlur = pulseIntensity

      ctx.beginPath()
      ctx.arc(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2, obstacle.width / 2, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#FFFFFF"
      ctx.shadowBlur = 0
      ctx.beginPath()
      ctx.arc(obstacle.x + obstacle.width / 3, obstacle.y + obstacle.height / 3, 3, 0, Math.PI * 2)
      ctx.arc(obstacle.x + (obstacle.width * 2) / 3, obstacle.y + obstacle.height / 3, 3, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.fillStyle = "#FF6F3C"
      ctx.shadowColor = "#FF6F3C"
      ctx.shadowBlur = pulseIntensity

      if (obstacle.type === "spike") {
        ctx.beginPath()
        ctx.moveTo(obstacle.x, obstacle.y + obstacle.height)
        ctx.lineTo(obstacle.x + obstacle.width / 2, obstacle.y)
        ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height)
        ctx.closePath()
        ctx.fill()
      } else {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
      }
    }
    ctx.shadowBlur = 0
  }

  const drawPickup = (ctx: CanvasRenderingContext2D, pickup: Pickup) => {
    const color = pickup.type === "coin" ? "#FFD700" : "#9B51E0"
    const floatOffset = Math.sin(Date.now() / 300 + pickup.x) * 3
    ctx.fillStyle = color
    ctx.shadowColor = color
    ctx.shadowBlur = 10
    ctx.beginPath()
    ctx.arc(pickup.x + 10, pickup.y + 10 + floatOffset, 8, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.globalAlpha = 0.5
    ctx.beginPath()
    ctx.arc(pickup.x + 10, pickup.y + 10 + floatOffset, 12, 0, Math.PI * 2)
    ctx.stroke()
    ctx.globalAlpha = 1
    ctx.shadowBlur = 0
  }

  const drawExit = (ctx: CanvasRenderingContext2D, exitPoint: { x: number; y: number }) => {
    const pulseIntensity = 15 + Math.sin(Date.now() / 200) * 10
    ctx.fillStyle = "#00FF88"
    ctx.shadowColor = "#00FF88"
    ctx.shadowBlur = pulseIntensity
    ctx.fillRect(exitPoint.x, exitPoint.y, 40, 40)

    ctx.fillStyle = "#FFFFFF"
    ctx.globalAlpha = 0.3
    ctx.fillRect(exitPoint.x + 10, exitPoint.y + 10, 20, 20)
    ctx.globalAlpha = 1
    ctx.shadowBlur = 0
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    setTouchStart({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    })
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || !engineRef.current) return

    const touch = e.changedTouches[0]
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const endX = touch.clientX - rect.left
    const endY = touch.clientY - rect.top

    const deltaX = endX - touchStart.x
    const deltaY = endY - touchStart.y

    if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < -30) {
      engineRef.current.jump()
      const player = engineRef.current.getPlayer()
      particleSystemRef.current.createJumpEffect(player.x, player.y)
    } else if (Math.abs(deltaX) > 30) {
      const direction = deltaX > 0 ? 1 : -1
      engineRef.current.move(direction)
    } else if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      engineRef.current.jump()
      const player = engineRef.current.getPlayer()
      particleSystemRef.current.createJumpEffect(player.x, player.y)
    }

    setTouchStart(null)
  }

  useEffect(() => {
    const keysPressed = new Set<string>()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!engineRef.current || isPaused) return

      keysPressed.add(e.key)

      if (e.key === " " || e.key === "ArrowUp" || e.key === "w") {
        const now = Date.now()
        if (now - lastJumpTimeRef.current > 200) {
          engineRef.current.jump()
          const player = engineRef.current.getPlayer()
          particleSystemRef.current.createJumpEffect(player.x, player.y)
          lastJumpTimeRef.current = now
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.delete(e.key)
    }

    // Continuous movement while keys are held
    const movementInterval = setInterval(() => {
      if (!engineRef.current || isPaused) return

      if (keysPressed.has("ArrowLeft") || keysPressed.has("a")) {
        engineRef.current.move(-1)
      }
      if (keysPressed.has("ArrowRight") || keysPressed.has("d")) {
        engineRef.current.move(1)
      }
    }, 16) // ~60fps

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      clearInterval(movementInterval)
    }
  }, [isPaused])

  return (
    <div className="relative w-full flex justify-center">
      <canvas
        ref={canvasRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="border-2 border-neon-cyan rounded-lg neon-glow-cyan max-w-full"
      />

      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
        <div className="space-y-2">
          <div className="bg-black/80 px-4 py-2 rounded-lg border border-neon-cyan backdrop-blur-sm">
            <div className="text-neon-cyan text-sm font-mono">TIME: {timeLeft}s</div>
          </div>

          {isRecording && (
            <div className="bg-black/80 px-4 py-2 rounded-lg border border-red-500 flex items-center gap-2 backdrop-blur-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <div className="text-red-500 text-xs font-mono">RECORDING</div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <div className="bg-black/80 px-4 py-2 rounded-lg border border-neon-purple backdrop-blur-sm">
            <div className="text-neon-purple text-sm font-mono">COINS: {collectedCoins}</div>
          </div>
          <div className="bg-black/80 px-4 py-2 rounded-lg border border-neon-orange backdrop-blur-sm">
            <div className="text-neon-orange text-sm font-mono">XP: {collectedXP}</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
        <div className="bg-black/80 px-4 py-2 rounded-lg border border-neon-cyan backdrop-blur-sm">
          <div className="text-neon-cyan text-sm font-mono">
            GHOSTS: {ghostCount}/{level.maxGhosts}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleRestart}
            size="sm"
            variant="outline"
            className="border-neon-purple text-neon-purple hover:bg-neon-purple/20 bg-transparent backdrop-blur-sm"
          >
            <RotateCcw size={16} />
          </Button>
          {ghostCount > 0 && (
            <Button
              onClick={handleClearGhosts}
              size="sm"
              variant="outline"
              className="border-neon-orange text-neon-orange hover:bg-neon-orange/20 bg-transparent backdrop-blur-sm"
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
