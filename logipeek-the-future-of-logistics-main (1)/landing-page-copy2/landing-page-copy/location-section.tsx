"use client"

import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { MapPin, Phone, Clock, Globe, Shield, Zap } from "lucide-react"
import { LogisticsLocationIcon } from "@/components/icons/logistics-icons"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/contexts/settings-context"

// Dynamically import LeafletMap with no SSR
const LeafletMap = dynamic(() => import("@/components/maps/leaflet-map").then(mod => mod.LeafletMap), {
    ssr: false,
    loading: () => <div className="h-full bg-gray-100 flex items-center justify-center">Xarita yuklanmoqda...</div>
})

interface LocationSectionProps {
    latitude: number | null
    longitude: number | null
    onOpenGPS: () => void
}

export function LocationSection({ latitude, longitude, onOpenGPS }: LocationSectionProps) {
    const { t } = useSettings()

    return (
        <section id="location" className="py-16 sm:py-24 bg-accent/5 relative overflow-hidden border-y border-border/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6 lg:space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/10 rounded-full border border-primary/20">
                            <LogisticsLocationIcon size={16} className="text-primary sm:w-[18px] sm:h-[18px]" />
                            <span className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wider">{t("location")}</span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight tracking-tight">
                            {t("locationTitle")}
                        </h2>

                        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                            {t("locationDescription")}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                            <div className="premium-card p-4 sm:p-6 space-y-3 sm:space-y-4 hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-sm sm:text-base font-bold text-foreground">{t("mainOffice")}</h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground">{t("tashkentUzbekistan")}</p>
                                </div>
                            </div>

                            <div className="premium-card p-4 sm:p-6 space-y-3 sm:space-y-4 hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                                </div>
                                <div>
                                    <h3 className="text-sm sm:text-base font-bold text-foreground">{t("contact")}</h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground">{t("contactPhone")}</p>
                                </div>
                            </div>

                            <div className="premium-card p-4 sm:p-6 space-y-3 sm:space-y-4 hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                                </div>
                                <div>
                                    <h3 className="text-sm sm:text-base font-bold text-foreground">{t("workingHours")}</h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground">24/7 {t("available")}</p>
                                </div>
                            </div>

                            <div className="premium-card p-4 sm:p-6 space-y-3 sm:space-y-4 hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="text-sm sm:text-base font-bold text-foreground">{t("coverage")}</h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground">{t("centralAsia")}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-lg border border-green-500/20 backdrop-blur-sm shadow-sm transition-all hover:shadow-md hover:scale-105">
                                <Shield className="w-4 h-4 text-green-600" />
                                <span className="text-xs sm:text-sm font-semibold text-green-700 tracking-wide">{t("secureLogistics")}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg border border-primary/20 backdrop-blur-sm shadow-sm transition-all hover:shadow-md hover:scale-105">
                                <Zap className="w-4 h-4 text-primary" />
                                <span className="text-xs sm:text-sm font-semibold text-primary tracking-wide">{t("fastDelivery")}</span>
                            </div>
                        </div>

                        {/* GPS Permission Button */}
                        <div className="pt-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onOpenGPS}
                                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 font-medium"
                            >
                                <MapPin className="w-5 h-5" />
                                {t("detectCurrentLocation")}
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Right Map */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl"
                    >
                        <LeafletMap
                            fromLocation={latitude && longitude ? { lat: latitude, lng: longitude } : { lat: 39.6270, lng: 66.9749 }}
                            height="h-full"
                            showDrivers={true}
                            showTraffic={true}
                        />

                        {/* Floating Badge */}
                        <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 lg:bottom-6 lg:left-6 lg:right-6 glass p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 z-10 border border-white/20">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center animate-pulse">
                                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                                </div>
                                <div>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-wider">{t("mainOffice")}</p>
                                    <p className="text-xs sm:text-sm font-bold text-foreground">{t("tashkentUzbekistan")}</p>
                                </div>
                            </div>
                            <Button size="sm" className="btn-tesla rounded-lg sm:rounded-xl text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 w-full sm:w-auto">
                                {t("getDirections")}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
