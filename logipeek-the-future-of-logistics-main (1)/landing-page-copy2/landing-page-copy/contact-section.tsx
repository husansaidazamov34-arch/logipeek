"use client"

import { motion } from "framer-motion"
import { Phone, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useSettings } from "@/contexts/settings-context"

export function ContactSection() {
    const { t } = useSettings()

    return (
        <section id="contact" className="py-16 sm:py-20 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-4 sm:mb-6">
                            {t("contact")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">{t("with")}</span>
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
                            {t("support247Desc")}
                        </p>

                        <div className="space-y-4 sm:space-y-6">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary to-primary/80 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                                    <Phone className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{t("phoneNumber")}</p>
                                    <p className="text-base sm:text-lg text-gray-900 font-medium">+998 90 449 08 90</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                                    <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{t("email")}</p>
                                    <p className="text-base sm:text-lg text-gray-900 font-medium">info@logipeek.uz</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                                    <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{t("address")}</p>
                                    <p className="text-base sm:text-lg text-gray-900 font-medium">{t("tashkentUzbekistan")}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg"
                    >
                        <form
                            className="space-y-4 sm:space-y-6"
                            onSubmit={(e) => {
                                e.preventDefault()
                                toast.success(t("messageSentSuccess"))
                                const target = e.target as HTMLFormElement
                                target.reset()
                            }}
                        >
                            <div>
                                <Label htmlFor="contact-name" className="text-sm sm:text-base">{t("yourName")}</Label>
                                <Input
                                    id="contact-name"
                                    type="text"
                                    placeholder={t("fullNamePlaceholder")}
                                    className="mt-1 sm:mt-2 h-11 sm:h-12"
                                />
                            </div>

                            <div>
                                <Label htmlFor="contact-email" className="text-sm sm:text-base">{t("email")}</Label>
                                <Input
                                    id="contact-email"
                                    type="email"
                                    placeholder={t("emailPlaceholder")}
                                    className="mt-1 sm:mt-2 h-11 sm:h-12"
                                />
                            </div>

                            <div>
                                <Label htmlFor="contact-phone" className="text-sm sm:text-base">{t("phoneNumber")}</Label>
                                <Input
                                    id="contact-phone"
                                    type="tel"
                                    placeholder={t("phonePlaceholder")}
                                    className="mt-1 sm:mt-2 h-11 sm:h-12"
                                />
                            </div>

                            <div>
                                <Label htmlFor="contact-message" className="text-sm sm:text-base">{t("message")}</Label>
                                <textarea
                                    id="contact-message"
                                    rows={4}
                                    className="mt-1 sm:mt-2 w-full px-3 py-2 sm:px-4 sm:py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm sm:text-base"
                                    placeholder={t("writeMessagePlaceholder")}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-4 sm:py-6 btn-tesla text-sm sm:text-base"
                            >
                                {t("send")}
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
