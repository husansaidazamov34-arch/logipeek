"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowRight, Package, Star, Truck } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"

interface HeroSectionProps {
    onOpenAuth: (mode: 'login' | 'register') => void
}

export function HeroSection({ onOpenAuth }: HeroSectionProps) {
    const { t } = useSettings()

    return (
        <section className="relative min-h-[100dvh] flex items-center pt-16 sm:pt-20 overflow-hidden">
            {/* Background with overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/assets/logistics-hero-main.png"
                    alt={t("logistics")}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-gray-900/60" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-4 sm:mb-6 leading-tight">
                                {t("heroTitle").split(" ").slice(0, 1).join(" ")}
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-primary mt-1 sm:mt-2">
                                    {t("heroTitle").split(" ").slice(1).join(" ")}
                                    <span>{t("contactPhone")}</span>
                                </span>
                            </h2>

                            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-10 leading-relaxed">
                                {t("heroSubtitle")}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(1, 57, 39, 0.4)" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onOpenAuth('register')}
                                    className="btn-tesla px-5 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 flex items-center justify-center gap-2 sm:gap-3 group text-sm sm:text-base"
                                >
                                    <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                                    {t("placeOrder")}
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onOpenAuth('register')}
                                    className="px-5 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2 sm:gap-3 font-medium text-sm sm:text-base"
                                >
                                    <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                                    {t("driver")}
                                </motion.button>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-1 sm:-space-x-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-green-400 to-primary border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                                {i}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="ml-1 sm:ml-2">
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-300 font-medium">{t("usersCount")}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Animated scroll indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-10"
            >
                <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5 sm:p-2">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full" />
                </div>
            </motion.div>
        </section>
    )
}
