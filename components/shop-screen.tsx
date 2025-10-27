"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShoppingBag, Check, Lock } from "lucide-react"

interface ShopItem {
  id: string
  name: string
  description: string
  price: number
  type: "skin" | "trail" | "powerup" | "pet" | "ghost"
  unlocked: boolean
  equipped?: boolean
  emoji?: string
}

interface ShopScreenProps {
  coins: number
  onBack: () => void
  onPurchase: (itemId: string, cost: number) => void
}

export function ShopScreen({ coins, onBack, onPurchase }: ShopScreenProps) {
  const [selectedTab, setSelectedTab] = useState<"skins" | "trails" | "powerups" | "pets" | "ghosts">("skins")
  const [items, setItems] = useState<ShopItem[]>([
    // Skins
    {
      id: "skin-default",
      name: "Default",
      description: "Classic cyan cube",
      price: 0,
      type: "skin",
      unlocked: true,
      equipped: true,
    },
    {
      id: "skin-purple",
      name: "Void Walker",
      description: "Purple phantom cube",
      price: 100,
      type: "skin",
      unlocked: false,
    },
    {
      id: "skin-orange",
      name: "Fire Breaker",
      description: "Blazing orange cube",
      price: 150,
      type: "skin",
      unlocked: false,
    },
    {
      id: "skin-green",
      name: "Time Keeper",
      description: "Emerald time cube",
      price: 200,
      type: "skin",
      unlocked: false,
    },
    {
      id: "skin-pink",
      name: "Neon Dream",
      description: "Hot pink glowing cube",
      price: 250,
      type: "skin",
      unlocked: false,
    },
    {
      id: "skin-blue",
      name: "Ocean Depths",
      description: "Deep blue water cube",
      price: 300,
      type: "skin",
      unlocked: false,
    },
    {
      id: "skin-red",
      name: "Crimson Fury",
      description: "Blood red cube",
      price: 350,
      type: "skin",
      unlocked: false,
    },
    {
      id: "skin-yellow",
      name: "Solar Flare",
      description: "Bright yellow sun cube",
      price: 400,
      type: "skin",
      unlocked: false,
    },
    {
      id: "skin-white",
      name: "Pure Light",
      description: "Brilliant white cube",
      price: 450,
      type: "skin",
      unlocked: false,
    },
    {
      id: "skin-gold",
      name: "Golden Loop",
      description: "Legendary gold cube",
      price: 500,
      type: "skin",
      unlocked: false,
    },
    {
      id: "skin-rainbow",
      name: "Prismatic",
      description: "Rainbow shifting cube",
      price: 600,
      type: "skin",
      unlocked: false,
    },
    {
      id: "skin-shadow",
      name: "Shadow Form",
      description: "Dark matter cube",
      price: 700,
      type: "skin",
      unlocked: false,
    },
    {
      id: "skin-crystal",
      name: "Crystal Core",
      description: "Transparent crystal cube",
      price: 800,
      type: "skin",
      unlocked: false,
    },
    {
      id: "skin-neon",
      name: "Neon Pulse",
      description: "Pulsing neon cube",
      price: 900,
      type: "skin",
      unlocked: false,
    },
    {
      id: "skin-cosmic",
      name: "Cosmic Entity",
      description: "Galaxy pattern cube",
      price: 1000,
      type: "skin",
      unlocked: false,
    },
    {
      id: "skin-lava",
      name: "Molten Core",
      description: "Lava flowing cube",
      price: 1100,
      type: "skin",
      unlocked: false,
    },
    {
      id: "skin-electric",
      name: "Tesla Coil",
      description: "Electric charged cube",
      price: 1200,
      type: "skin",
      unlocked: false,
    },
    {
      id: "skin-toxic",
      name: "Toxic Waste",
      description: "Radioactive green cube",
      price: 1300,
      type: "skin",
      unlocked: false,
    },
    {
      id: "skin-diamond",
      name: "Diamond Edge",
      description: "Sparkling diamond cube",
      price: 1500,
      type: "skin",
      unlocked: false,
    },
    {
      id: "skin-ultimate",
      name: "Infinity Cube",
      description: "Ultimate legendary cube",
      price: 2000,
      type: "skin",
      unlocked: false,
    },

    // Trails
    {
      id: "trail-none",
      name: "No Trail",
      description: "Clean movement",
      price: 0,
      type: "trail",
      unlocked: true,
      equipped: true,
    },
    {
      id: "trail-cyan",
      name: "Neon Trail",
      description: "Cyan light trail",
      price: 75,
      type: "trail",
      unlocked: false,
    },
    {
      id: "trail-rainbow",
      name: "Rainbow Trail",
      description: "Colorful path",
      price: 150,
      type: "trail",
      unlocked: false,
    },
    {
      id: "trail-stars",
      name: "Star Trail",
      description: "Cosmic particles",
      price: 200,
      type: "trail",
      unlocked: false,
    },
    {
      id: "trail-fire",
      name: "Fire Trail",
      description: "Blazing flames",
      price: 250,
      type: "trail",
      unlocked: false,
    },
    {
      id: "trail-ice",
      name: "Ice Trail",
      description: "Frozen crystals",
      price: 250,
      type: "trail",
      unlocked: false,
    },
    {
      id: "trail-lightning",
      name: "Lightning Trail",
      description: "Electric sparks",
      price: 300,
      type: "trail",
      unlocked: false,
    },
    {
      id: "trail-shadow",
      name: "Shadow Trail",
      description: "Dark energy",
      price: 350,
      type: "trail",
      unlocked: false,
    },
    {
      id: "trail-hearts",
      name: "Love Trail",
      description: "Floating hearts",
      price: 400,
      type: "trail",
      unlocked: false,
    },
    {
      id: "trail-bubbles",
      name: "Bubble Trail",
      description: "Floating bubbles",
      price: 400,
      type: "trail",
      unlocked: false,
    },
    {
      id: "trail-smoke",
      name: "Smoke Trail",
      description: "Mysterious smoke",
      price: 450,
      type: "trail",
      unlocked: false,
    },
    {
      id: "trail-sparkles",
      name: "Sparkle Trail",
      description: "Glittering sparkles",
      price: 500,
      type: "trail",
      unlocked: false,
    },
    {
      id: "trail-toxic",
      name: "Toxic Trail",
      description: "Radioactive glow",
      price: 550,
      type: "trail",
      unlocked: false,
    },
    {
      id: "trail-galaxy",
      name: "Galaxy Trail",
      description: "Cosmic nebula",
      price: 600,
      type: "trail",
      unlocked: false,
    },
    {
      id: "trail-portal",
      name: "Portal Trail",
      description: "Dimensional rifts",
      price: 700,
      type: "trail",
      unlocked: false,
    },

    // Powerups
    {
      id: "powerup-shield",
      name: "Energy Shield",
      description: "Absorbs one hit from enemies",
      price: 50,
      type: "powerup",
      unlocked: true,
    },
    {
      id: "powerup-armor",
      name: "Nano Armor",
      description: "Reduces damage by 50%",
      price: 100,
      type: "powerup",
      unlocked: true,
    },
    {
      id: "powerup-regen",
      name: "Health Regen",
      description: "Slowly regenerate health",
      price: 125,
      type: "powerup",
      unlocked: true,
    },
    {
      id: "powerup-timeslow",
      name: "Time Slow",
      description: "Slow down enemies and obstacles",
      price: 75,
      type: "powerup",
      unlocked: true,
    },
    {
      id: "powerup-doublejump",
      name: "Double Jump",
      description: "Jump twice in air",
      price: 100,
      type: "powerup",
      unlocked: true,
    },
    {
      id: "powerup-dash",
      name: "Speed Dash",
      description: "Quick burst of speed",
      price: 125,
      type: "powerup",
      unlocked: true,
    },
    {
      id: "powerup-invincible",
      name: "Invincibility",
      description: "10 seconds of immunity",
      price: 150,
      type: "powerup",
      unlocked: true,
    },
    {
      id: "powerup-magnet",
      name: "Coin Magnet",
      description: "Auto-collect nearby coins",
      price: 100,
      type: "powerup",
      unlocked: true,
    },
    {
      id: "powerup-ghost",
      name: "Ghost Form",
      description: "Phase through enemies",
      price: 175,
      type: "powerup",
      unlocked: true,
    },
    {
      id: "powerup-reflect",
      name: "Damage Reflect",
      description: "Reflect damage back to enemies",
      price: 200,
      type: "powerup",
      unlocked: true,
    },
    {
      id: "powerup-freeze",
      name: "Freeze Enemies",
      description: "Freeze all enemies for 5 seconds",
      price: 150,
      type: "powerup",
      unlocked: true,
    },
    {
      id: "powerup-teleport",
      name: "Teleport",
      description: "Instantly teleport forward",
      price: 175,
      type: "powerup",
      unlocked: true,
    },
    {
      id: "powerup-size",
      name: "Size Shift",
      description: "Become smaller to dodge easier",
      price: 125,
      type: "powerup",
      unlocked: true,
    },
    {
      id: "powerup-gravity",
      name: "Low Gravity",
      description: "Jump higher and fall slower",
      price: 150,
      type: "powerup",
      unlocked: true,
    },
    {
      id: "powerup-vision",
      name: "Future Vision",
      description: "See upcoming obstacles",
      price: 200,
      type: "powerup",
      unlocked: true,
    },
    {
      id: "powerup-revive",
      name: "Auto Revive",
      description: "Revive once when you die",
      price: 250,
      type: "powerup",
      unlocked: true,
    },
    {
      id: "powerup-boost",
      name: "XP Boost",
      description: "Double XP for one level",
      price: 100,
      type: "powerup",
      unlocked: true,
    },
    {
      id: "powerup-coinboost",
      name: "Coin Boost",
      description: "Double coins for one level",
      price: 100,
      type: "powerup",
      unlocked: true,
    },
    {
      id: "powerup-lucky",
      name: "Lucky Charm",
      description: "Increased rare drop chance",
      price: 150,
      type: "powerup",
      unlocked: true,
    },
    {
      id: "powerup-ultimate",
      name: "God Mode",
      description: "All powerups combined for 30 seconds",
      price: 500,
      type: "powerup",
      unlocked: true,
    },

    // Pets
    {
      id: "pet-none",
      name: "No Pet",
      description: "Solo adventure",
      price: 0,
      type: "pet",
      unlocked: true,
      equipped: true,
      emoji: "🚫",
    },
    {
      id: "pet-dog",
      name: "Cyber Dog",
      description: "Loyal companion that collects coins",
      price: 200,
      type: "pet",
      unlocked: false,
      emoji: "🐕",
    },
    {
      id: "pet-cat",
      name: "Neon Cat",
      description: "Agile friend that warns of danger",
      price: 200,
      type: "pet",
      unlocked: false,
      emoji: "🐈",
    },
    {
      id: "pet-bird",
      name: "Phoenix",
      description: "Flying companion that scouts ahead",
      price: 250,
      type: "pet",
      unlocked: false,
      emoji: "🦅",
    },
    {
      id: "pet-dragon",
      name: "Mini Dragon",
      description: "Breathes fire to destroy obstacles",
      price: 400,
      type: "pet",
      unlocked: false,
      emoji: "🐉",
    },
    {
      id: "pet-unicorn",
      name: "Cyber Unicorn",
      description: "Magical friend that grants speed boost",
      price: 350,
      type: "pet",
      unlocked: false,
      emoji: "🦄",
    },
    {
      id: "pet-robot",
      name: "Nano Bot",
      description: "Tech companion that repairs shields",
      price: 300,
      type: "pet",
      unlocked: false,
      emoji: "🤖",
    },
    {
      id: "pet-ghost",
      name: "Spirit Guide",
      description: "Ethereal friend that phases through walls",
      price: 450,
      type: "pet",
      unlocked: false,
      emoji: "👻",
    },
    {
      id: "pet-alien",
      name: "Space Buddy",
      description: "Alien companion with teleport ability",
      price: 500,
      type: "pet",
      unlocked: false,
      emoji: "👽",
    },
    {
      id: "pet-panda",
      name: "Pixel Panda",
      description: "Cute friend that increases XP gain",
      price: 300,
      type: "pet",
      unlocked: false,
      emoji: "🐼",
    },
    {
      id: "pet-fox",
      name: "Cyber Fox",
      description: "Clever companion that finds secrets",
      price: 350,
      type: "pet",
      unlocked: false,
      emoji: "🦊",
    },
    {
      id: "pet-wolf",
      name: "Neon Wolf",
      description: "Fierce friend that attacks enemies",
      price: 400,
      type: "pet",
      unlocked: false,
      emoji: "🐺",
    },
    {
      id: "pet-owl",
      name: "Wisdom Owl",
      description: "Wise companion that reveals hidden paths",
      price: 350,
      type: "pet",
      unlocked: false,
      emoji: "🦉",
    },
    {
      id: "pet-turtle",
      name: "Time Turtle",
      description: "Ancient friend that slows time",
      price: 450,
      type: "pet",
      unlocked: false,
      emoji: "🐢",
    },
    {
      id: "pet-monkey",
      name: "Cyber Monkey",
      description: "Playful companion that doubles coins",
      price: 500,
      type: "pet",
      unlocked: false,
      emoji: "🐵",
    },

    // Special Ghosts
    {
      id: "ghost-default",
      name: "Default Ghost",
      description: "Standard ghost appearance",
      price: 0,
      type: "ghost",
      unlocked: true,
      equipped: true,
    },
    {
      id: "ghost-fire",
      name: "Fire Ghost",
      description: "Blazing trail ghost with flames",
      price: 150,
      type: "ghost",
      unlocked: false,
    },
    {
      id: "ghost-ice",
      name: "Ice Ghost",
      description: "Frozen ghost with icy particles",
      price: 150,
      type: "ghost",
      unlocked: false,
    },
    {
      id: "ghost-electric",
      name: "Electric Ghost",
      description: "Charged ghost with lightning",
      price: 200,
      type: "ghost",
      unlocked: false,
    },
    {
      id: "ghost-shadow",
      name: "Shadow Ghost",
      description: "Dark matter ghost",
      price: 250,
      type: "ghost",
      unlocked: false,
    },
    {
      id: "ghost-rainbow",
      name: "Rainbow Ghost",
      description: "Colorful shifting ghost",
      price: 300,
      type: "ghost",
      unlocked: false,
    },
    {
      id: "ghost-gold",
      name: "Golden Ghost",
      description: "Legendary gold ghost",
      price: 400,
      type: "ghost",
      unlocked: false,
    },
    {
      id: "ghost-cosmic",
      name: "Cosmic Ghost",
      description: "Galaxy pattern ghost",
      price: 450,
      type: "ghost",
      unlocked: false,
    },
    {
      id: "ghost-crystal",
      name: "Crystal Ghost",
      description: "Transparent crystal ghost",
      price: 500,
      type: "ghost",
      unlocked: false,
    },
    {
      id: "ghost-ultimate",
      name: "Infinity Ghost",
      description: "Ultimate legendary ghost",
      price: 600,
      type: "ghost",
      unlocked: false,
    },
  ])

  useEffect(() => {
    const savedItems = localStorage.getItem("shopItems")
    if (savedItems) {
      setItems(JSON.parse(savedItems))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("shopItems", JSON.stringify(items))
  }, [items])

  const filteredItems = items.filter((item) => item.type === selectedTab)

  const handlePurchase = (item: ShopItem) => {
    if (coins >= item.price && !item.unlocked) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, unlocked: true } : i)))
      onPurchase(item.id, item.price)
    }
  }

  const handleEquip = (item: ShopItem) => {
    setItems((prev) => prev.map((i) => (i.type === item.type ? { ...i, equipped: i.id === item.id } : i)))

    if (item.type === "skin") {
      localStorage.setItem("equippedSkin", item.id)
    } else if (item.type === "pet") {
      localStorage.setItem("equippedPet", item.id)
    } else if (item.type === "ghost") {
      localStorage.setItem("equippedGhost", item.id)
    }
  }

  return (
    <div className="max-w-6xl w-full space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <ShoppingBag className="text-neon-purple" size={32} />
          <h2 className="text-3xl font-bold text-neon-purple">SHOP</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-card border-2 border-neon-cyan px-6 py-3 rounded-lg">
            <div className="text-neon-cyan font-mono text-xl">{coins} COINS</div>
          </div>
          <Button onClick={onBack} variant="outline" className="border-neon-cyan text-neon-cyan bg-transparent">
            BACK
          </Button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-border pb-4 flex-wrap">
        <Button
          onClick={() => setSelectedTab("skins")}
          variant={selectedTab === "skins" ? "default" : "outline"}
          className={selectedTab === "skins" ? "bg-neon-cyan text-black" : "border-neon-cyan text-neon-cyan"}
        >
          SKINS
        </Button>
        <Button
          onClick={() => setSelectedTab("trails")}
          variant={selectedTab === "trails" ? "default" : "outline"}
          className={selectedTab === "trails" ? "bg-neon-purple text-white" : "border-neon-purple text-neon-purple"}
        >
          TRAILS
        </Button>
        <Button
          onClick={() => setSelectedTab("powerups")}
          variant={selectedTab === "powerups" ? "default" : "outline"}
          className={selectedTab === "powerups" ? "bg-neon-orange text-black" : "border-neon-orange text-neon-orange"}
        >
          POWERUPS
        </Button>
        <Button
          onClick={() => setSelectedTab("pets")}
          variant={selectedTab === "pets" ? "default" : "outline"}
          className={selectedTab === "pets" ? "bg-green-500 text-black" : "border-green-500 text-green-500"}
        >
          PETS
        </Button>
        <Button
          onClick={() => setSelectedTab("ghosts")}
          variant={selectedTab === "ghosts" ? "default" : "outline"}
          className={selectedTab === "ghosts" ? "bg-pink-500 text-black" : "border-pink-500 text-pink-500"}
        >
          GHOSTS
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
        {filteredItems.map((item) => (
          <Card key={item.id} className="bg-card border-2 border-neon-purple p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {item.emoji && <span className="text-3xl">{item.emoji}</span>}
                <h3 className="text-xl font-bold text-neon-cyan">{item.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-neon-purple font-mono text-lg">
                {item.price === 0 ? "FREE" : `${item.price} COINS`}
              </div>

              {item.unlocked ? (
                item.equipped ? (
                  <Button disabled className="bg-neon-cyan text-black">
                    <Check size={16} className="mr-2" />
                    EQUIPPED
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleEquip(item)}
                    variant="outline"
                    className="border-neon-cyan text-neon-cyan"
                  >
                    EQUIP
                  </Button>
                )
              ) : coins >= item.price ? (
                <Button
                  onClick={() => handlePurchase(item)}
                  className="bg-neon-purple text-white hover:bg-neon-purple/80"
                >
                  BUY
                </Button>
              ) : (
                <Button disabled variant="outline" className="border-muted text-muted-foreground bg-transparent">
                  <Lock size={16} className="mr-2" />
                  LOCKED
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
