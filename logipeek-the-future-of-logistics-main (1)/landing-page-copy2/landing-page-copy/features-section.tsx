"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Shield, MapPin, Users } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"

export function FeaturesSection() {
    const { t } = useSettings()

    return (
        <section id="features" className="py-24 bg-white relative overflow-hidden">
            {/* Background Map - Very Visible */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/assets/logistics-tracking.png"
                    alt={t("worldMap")}
                    fill
                    className="object-cover object-center opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/20" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl text-gray-900 mb-4">
                        {t("why")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">{t("logipeekQuestion")}</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        {t("heroSubtitle")}
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Shield,
                            title: t("fraudProtection"),
                            desc: t("fraudProtectionDesc"),
                            color: 'from-primary to-primary/80',
                            delay: 0
                        },
                        {
                            icon: MapPin,
                            title: t("gpsTrackingSystem"),
                            desc: t("gpsTrackingSystemDesc"),
                            color: 'from-green-500 to-emerald-500',
                            delay: 0.2
                        },
                        {
                            icon: Users,
                            title: t("withoutDispatchers"),
                            desc: t("withoutDispatchersDesc"),
                            color: 'from-primary/80 to-primary',
                            delay: 0.4
                        },
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: feature.delay }}
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            className="group"
                        >
                            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
                                <motion.div
                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                    transition={{ duration: 0.6 }}
                                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                                >
                                    <feature.icon className="w-8 h-8 text-white" />
                                </motion.div>
                                <h3 className="text-2xl font-bold mb-4 text-gray-900 tracking-tight">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
