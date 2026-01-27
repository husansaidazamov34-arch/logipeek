"use client"

import { Truck, Send, Bot, Instagram, Linkedin, Youtube, Phone, Mail, MapPin } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"

export function Footer() {
    const { t } = useSettings()

    return (
        <footer className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-gray-300 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                                <Truck className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl text-white">LogiPeek</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">
                            {t("centralAsiaFreightPlatform")}
                        </p>
                        <div className="flex gap-3">
                            {/* Social icons */}
                            <a href="https://t.me/logipeek_logistika" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center transition-all group">
                                <Send className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                            </a>
                            <a href="https://t.me/logi_peek_bot" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center transition-all group">
                                <Bot className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                            </a>
                            <a href="https://www.instagram.com/logi_peek/?next=%2F" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center transition-all group">
                                <Instagram className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                            </a>
                            <a href="https://www.linkedin.com/in/logi-peek-62b269387/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center transition-all group">
                                <Linkedin className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                            </a>
                            <a href="#" className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center transition-all group">
                                <Youtube className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white mb-4">{t("platform")}</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-primary transition-colors">{t("aboutUs")}</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">{t("services")}</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">{t("pricing")}</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">{t("blog")}</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white mb-4">{t("help")}</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-primary transition-colors">{t("faq")}</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">{t("support")}</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">{t("terms")}</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">{t("privacy")}</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white mb-4">{t("contact")}</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary" />
                                <span>{t("contactPhone")}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary" />
                                <span>{t("contactEmail")}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span>{t("centralAsiaInternationalOffice")}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-center">&copy; 2025 LogiPeek. {t("allRightsReserved")}</p>
                        <div className="flex gap-6 text-sm">
                            <a href="#" className="hover:text-primary transition-colors">{t("privacy")}</a>
                            <a href="#" className="hover:text-primary transition-colors">{t("terms")}</a>
                            <a href="#" className="hover:text-primary transition-colors">{t("cookies")}</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
