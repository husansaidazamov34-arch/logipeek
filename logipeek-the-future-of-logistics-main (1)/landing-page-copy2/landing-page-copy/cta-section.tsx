"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"

interface CTASectionProps {
    onOpenAuth: (mode: 'login' | 'register') => void
}

export function CTASection({ onOpenAuth }: CTASectionProps) {
    const { t } = useSettings()

    return (
        <section className="py-24 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white relative overflow-hidden">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
            />

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                        {t("heroTitle")}
                    </h2>
                    <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                        {t("heroSubtitle")}
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255, 255, 255, 0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onOpenAuth('register')}
                            className="px-10 py-5 bg-white text-primary rounded-xl shadow-2xl text-lg font-bold flex items-center gap-3"
                        >
                            {t("startFree")}
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
