"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { CheckCircle, Shield, Clock, Star } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"

export function SecuritySection() {
    const { t } = useSettings()

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Image
                    src="/assets/logistics-mobile.png"
                    alt={t("transport")}
                    fill
                    className="object-cover object-center opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/30 to-white/60" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl text-gray-900 mb-6">
                            {t("safeShipping")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">{t("security")}</span>
                        </h2>
                        <p className="text-xl text-gray-600 mb-8">
                            {t("safeShippingDesc")}
                        </p>

                        <div className="space-y-4">
                            {[
                                t("realTimeGPSTracking"),
                                t("verifiedDriversCompanies"),
                                t("paymentSecurityGuarantee"),
                                t("insuranceProtection"),
                                t("support247Service")
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                                    <span className="text-gray-700 text-lg">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-10 text-white shadow-2xl">
                            <h3 className="text-3xl font-bold mb-6 tracking-tight">{t("ourGuarantees")}</h3>
                            <div className="space-y-6">
                                {[
                                    { icon: Shield, title: t("security"), desc: t("fullDataEncryption") },
                                    { icon: Clock, title: t("speedQuality"), desc: t("driverInMinutes") },
                                    { icon: Star, title: t("quality"), desc: t("customerSatisfaction") }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                                            <p className="text-white/80">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
