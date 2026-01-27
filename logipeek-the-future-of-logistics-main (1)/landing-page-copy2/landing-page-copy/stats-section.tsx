"use client"

import { motion } from "framer-motion"
import { Users, Package, Star, Clock } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"

export function StatsSection() {
    const { t } = useSettings()

    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-green-50 to-primary/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {[
                        { number: '500+', label: t("availableDrivers"), icon: Users },
                        { number: '1,200+', label: t("completedTrips"), icon: Package },
                        { number: '98%', label: t("success"), icon: Star },
                        { number: '24/7', label: t("support247"), icon: Clock },
                    ].map((stat, index) => {
                        const Icon = stat.icon

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="text-center group"
                            >
                                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-primary to-primary/80 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                                </div>
                                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80 mb-1 sm:mb-2 tracking-tight">
                                    {stat.number}
                                </div>
                                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground font-medium px-1">{stat.label}</p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
