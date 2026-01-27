"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Menu,
    X,
    Truck,
    LogOut,
    User,
    LayoutDashboard
} from "lucide-react"
import { LogisticsLocationIcon } from "@/components/icons/logistics-icons"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useSettings } from "@/contexts/settings-context"
import { useGeolocation } from "@/hooks/use-geolocation"
import { cn } from "@/lib/utils"

interface LandingNavbarProps {
    onOpenAuth: (mode: 'login' | 'register') => void
}

export function LandingNavbar({ onOpenAuth }: LandingNavbarProps) {
    const { user, isAuthenticated } = useAuth()
    const { language, setLanguage, t } = useSettings()
    const {
        latitude,
        longitude,
        permission: geoPermission,
        checkPermission
    } = useGeolocation()

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Initialize geo check
    useState(() => {
        checkPermission()
    })

    const locationText = useMemo(() => {
        if (geoPermission === "denied") return t("locationNotFound")
        if (latitude && longitude) return `${t("yourLocation")}: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
        return t("location")
    }, [latitude, longitude, geoPermission, t])

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-sm z-50"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    <motion.div
                        className="flex items-center gap-2 sm:gap-3"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                            <Truck className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                                LogiPeek
                            </h1>
                            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium tracking-wide">{t("platform")}</p>
                        </div>
                    </motion.div>

                    <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                        <a href="#features" className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm tracking-wide">{t("services")}</a>
                        <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm tracking-wide">{t("howItWorks")}</a>
                        <a href="#location" className="hidden lg:flex items-center gap-2 lg:gap-3 px-3 py-1.5 lg:px-4 lg:py-2 bg-accent/5 rounded-full border border-border/50 hover:bg-accent/10 transition-all duration-300 cursor-pointer group">
                            <div className="w-5 h-5 lg:w-6 lg:h-6 bg-primary rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                                <LogisticsLocationIcon size={10} className="text-primary-foreground lg:w-3 lg:h-3" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] lg:text-[10px] text-primary font-bold uppercase tracking-wider leading-none">{locationText}</span>
                                <span className="text-[11px] lg:text-xs font-bold text-foreground leading-tight">{latitude && longitude ? t("yourLocation") : t("tashkentUzbekistan")}</span>
                            </div>
                        </a>
                        <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm tracking-wide">{t("contact")}</a>
                    </nav>

                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Language Switcher */}
                        <div className="hidden sm:flex items-center bg-accent/10 rounded-full p-1 border border-border/50">
                            {(["uz", "ru", "en"] as const).map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setLanguage(lang)}
                                    className={cn(
                                        "px-2 py-1 sm:px-3 sm:py-1.5 text-xs font-bold rounded-full transition-all",
                                        language === lang
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <span className="uppercase">{lang}</span>
                                </button>
                            ))}
                        </div>

                        <div className="hidden md:flex gap-2 lg:gap-3">
                            {isAuthenticated ? (
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(16, 185, 129, 0.3)" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        window.location.href = '/dashboard'
                                    }}
                                    className="btn-tesla text-sm px-3 py-2 sm:px-4 sm:py-2.5"
                                >
                                    {t("dashboard")}
                                </motion.button>
                            ) : (
                                <>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => onOpenAuth('login')}
                                        className="px-3 py-2 sm:px-5 sm:py-2.5 text-primary hover:bg-primary/10 rounded-full transition-colors font-medium text-sm"
                                    >
                                        {t("login")}
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(1, 57, 39, 0.3)" }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => onOpenAuth('register')}
                                        className="btn-tesla text-sm px-3 py-2 sm:px-4 sm:py-2.5"
                                    >
                                        {t("signUp")}
                                    </motion.button>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-foreground"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label={mobileMenuOpen ? t("closeMenu") : t("openMenu")}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-border/50 overflow-hidden"
                    >
                        <div className="px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
                            <a
                                href="#features"
                                className="block text-base sm:text-lg font-medium text-foreground"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t("services")}
                            </a>
                            <a
                                href="#how-it-works"
                                className="block text-base sm:text-lg font-medium text-foreground"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t("howItWorks")}
                            </a>
                            <a
                                href="#location"
                                className="block text-base sm:text-lg font-medium text-foreground"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t("location")}
                            </a>
                            <a
                                href="#contact"
                                className="block text-base sm:text-lg font-medium text-foreground"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t("contact")}
                            </a>

                            <div className="pt-3 sm:pt-4 flex flex-col gap-2 sm:gap-3">
                                {isAuthenticated ? (
                                    <Button
                                        className="w-full py-4 sm:py-6 rounded-xl btn-tesla"
                                        onClick={() => {
                                            window.location.href = '/dashboard'
                                        }}
                                    >
                                        {t("dashboard")}
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            variant="outline"
                                            className="w-full py-4 sm:py-6 rounded-xl"
                                            onClick={() => {
                                                onOpenAuth('login')
                                                setMobileMenuOpen(false)
                                            }}
                                        >
                                            {t("login")}
                                        </Button>
                                        <Button
                                            className="w-full py-4 sm:py-6 rounded-xl btn-tesla"
                                            onClick={() => {
                                                onOpenAuth('register')
                                                setMobileMenuOpen(false)
                                            }}
                                        >
                                            {t("signUp")}
                                        </Button>
                                    </>
                                )}
                            </div>

                            {/* Language Switcher Mobile */}
                            <div className="pt-3 sm:pt-4 flex items-center justify-center gap-3 sm:gap-4">
                                {(["uz", "ru", "en"] as const).map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => setLanguage(lang)}
                                        className={cn(
                                            "px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-bold rounded-xl transition-all",
                                            language === lang
                                                ? "bg-primary text-white shadow-lg"
                                                : "bg-accent/10 text-muted-foreground"
                                        )}
                                    >
                                        <span className="uppercase">{lang}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    )
}
