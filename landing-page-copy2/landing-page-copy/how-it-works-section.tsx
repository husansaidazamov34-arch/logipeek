"use client"

import { motion } from "framer-motion"
import { MapPin, Shield, Clock, Package, Truck } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"

export function HowItWorksSection() {
    const { t } = useSettings()

    return (
        <section id="how-it-works" className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl text-gray-900 mb-4">
                        {t("howItWorksTitle")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">{t("howItWorks")}?</span>
                    </h2>
                </motion.div>

                {/* Feature Cards Row */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-3xl p-8 shadow-2xl">
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: MapPin,
                                    title: t("realTimeGPSTracking"),
                                    desc: t("gpsMonitoring247"),
                                    gradient: 'from-green-400 to-emerald-500'
                                },
                                {
                                    icon: Shield,
                                    title: t("paymentSecurityGuarantee"),
                                    desc: t("verifiedDriversCompanies"),
                                    gradient: 'from-primary to-primary/80'
                                },
                                {
                                    icon: Clock,
                                    title: t("speedQuality"),
                                    desc: t("driverInMinutes"),
                                    gradient: 'from-purple-400 to-pink-500'
                                }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-gray-600/50 backdrop-blur-sm rounded-2xl p-6 hover:bg-gray-600/70 transition-colors"
                                >
                                    <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                                        <item.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl text-white mb-2">{item.title}</h3>
                                    <p className="text-gray-300">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Cargo Owners */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                                <Package className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-3xl text-gray-900">{t("cargoOwner")}</h3>
                        </div>

                        <div className="space-y-6">
                            {[
                                { step: '01', title: t("registerStep"), desc: t("registerStepDesc") },
                                { step: '02', title: t("placeCargoStep"), desc: t("placeCargoStepDesc") },
                                { step: '03', title: t("selectDriverStep"), desc: t("selectDriverStepDesc") },
                                { step: '04', title: t("trackStep"), desc: t("trackStepDesc") },
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex gap-6 items-start group"
                                >
                                    <div className="flex-shrink-0">
                                        <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/20 text-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform font-bold text-lg">
                                            {item.step}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h4>
                                        <p className="text-gray-600">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Drivers */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <Truck className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-3xl text-gray-900">{t("driver")}</h3>
                        </div>

                        <div className="space-y-6">
                            {[
                                { step: '01', title: t("createProfileStep"), desc: t("createProfileStepDesc") },
                                { step: '02', title: t("viewCargosStep"), desc: t("viewCargosStepDesc") },
                                { step: '03', title: t("sendOfferStep"), desc: t("sendOfferStepDesc") },
                                { step: '04', title: t("transportCargoStep"), desc: t("transportCargoStepDesc") },
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex gap-6 items-start group"
                                >
                                    <div className="flex-shrink-0">
                                        <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 text-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform font-bold text-lg">
                                            {item.step}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h4>
                                        <p className="text-gray-600">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
