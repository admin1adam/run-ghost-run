"use client"

import { useEffect, useRef, useState } from "react"

interface AdSenseBannerProps {
  slot: string
  format?: "auto" | "rectangle" | "vertical" | "horizontal"
  responsive?: boolean
  className?: string
}

export function AdSenseBanner({ slot, format = "auto", responsive = true, className = "" }: AdSenseBannerProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const checkDimensions = () => {
      if (adRef.current) {
        const { width, height } = adRef.current.getBoundingClientRect()
        if (width > 0 && height > 0) {
          setIsReady(true)
        }
      }
    }

    // Check dimensions after a short delay to ensure layout is complete
    const timer = setTimeout(checkDimensions, 100)

    // Also check on resize
    window.addEventListener("resize", checkDimensions)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", checkDimensions)
    }
  }, [])

  useEffect(() => {
    if (!isReady) return

    try {
      if (typeof window !== "undefined" && (window as any).adsbygoogle) {
        const adContainer = adRef.current
        if (adContainer) {
          const { width } = adContainer.getBoundingClientRect()
          if (width > 0) {
            ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
          }
        }
      }
    } catch (error) {
      console.error("AdSense error:", error)
    }
  }, [isReady])

  return (
    <div
      ref={adRef}
      className={`adsense-container ${className}`}
      style={{
        minWidth: "300px",
        minHeight: "50px",
        width: "100%",
        maxWidth: "100%",
        display: "block",
        margin: "0 auto",
      }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          minWidth: "300px",
          minHeight: "50px",
        }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  )
}
