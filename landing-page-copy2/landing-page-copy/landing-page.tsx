"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useSettings } from "@/contexts/settings-context"
import { useGeolocation } from "@/hooks/use-geolocation"
import { AuthModal } from "@/components/auth/auth-modal"
import { GPSPermissionModal } from "@/components/location/gps-permission-modal"
import { toast } from "sonner"
import { LandingNavbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { StatsSection } from "@/components/landing/stats-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { SecuritySection } from "@/components/landing/security-section"
import { CTASection } from "@/components/landing/cta-section"
import { LocationSection } from "@/components/landing/location-section"
import { ContactSection } from "@/components/landing/contact-section"
import { Footer } from "@/components/landing/footer"

export function LandingPage() {
  const { t } = useSettings()
  const {
    latitude,
    longitude,
    checkPermission
  } = useGeolocation()

  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [showGPSModal, setShowGPSModal] = useState(false)

  // Initial permission check
  useState(() => {
    checkPermission()
  })

  // Auth Modal Handler
  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  // GPS Permission Handlers
  const handleGPSPermission = () => {
    setShowGPSModal(true)
  }

  const handleAllowGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          toast.success(`${t("locationDetected")}: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
          setShowGPSModal(false)
        },
        (error) => {
          toast.error(t("locationError"))
          setShowGPSModal(false)
        }
      )
    } else {
      toast.error(t("gpsNotSupported"))
      setShowGPSModal(false)
    }
  }

  const handleDenyGPS = () => {
    toast.info(t("locationDenied"))
    setShowGPSModal(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar onOpenAuth={handleOpenAuth} />

      <HeroSection onOpenAuth={handleOpenAuth} />

      <StatsSection />

      <FeaturesSection />

      <HowItWorksSection />

      <SecuritySection />

      <CTASection onOpenAuth={handleOpenAuth} />

      <LocationSection
        latitude={latitude}
        longitude={longitude}
        onOpenGPS={handleGPSPermission}
      />

      <ContactSection />

      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />

      {/* GPS Permission Modal */}
      <GPSPermissionModal
        isOpen={showGPSModal}
        onClose={() => setShowGPSModal(false)}
        onAllow={handleAllowGPS}
        onDeny={handleDenyGPS}
      />
    </div>
  )
}
