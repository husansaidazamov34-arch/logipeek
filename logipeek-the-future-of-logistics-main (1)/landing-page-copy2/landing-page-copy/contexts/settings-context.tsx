"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { type Language, translations } from "@/lib/i18n"
import { formatCurrency, formatDate, formatTime } from "@/lib/utils"

type Theme = "light" | "dark"

interface SettingsContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string, params?: Record<string, string | number>) => string
    formatCurrency: (amount: number) => string
    formatDate: (date: Date | string) => string
    formatTime: (date: Date | string) => string
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("light")
    const [language, setLanguage] = useState<Language>("uz")

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as Theme
        const savedLang = localStorage.getItem("language") as Language
        if (savedTheme) setTheme(savedTheme)
        if (savedLang) setLanguage(savedLang)
    }, [])

    useEffect(() => {
        localStorage.setItem("theme", theme)
        document.documentElement.classList.toggle("dark", theme === "dark")
    }, [theme])

    useEffect(() => {
        localStorage.setItem("language", language)
    }, [language])

    const translate = useCallback((key: string, params?: Record<string, string | number>) => {
        let text = translations[language][key as keyof typeof translations[typeof language]] || key
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                text = text.replace(new RegExp(`{${k}}`, 'g'), String(v))
            })
        }
        return text
    }, [language])

    const localizedFormatCurrency = useCallback((amount: number) => {
        const locale = language === "uz" ? "uz-UZ" : language === "ru" ? "ru-RU" : "en-US"
        return formatCurrency(amount, locale)
    }, [language])

    const localizedFormatDate = useCallback((date: Date | string) => {
        const locale = language === "uz" ? "uz-UZ" : language === "ru" ? "ru-RU" : "en-US"
        return formatDate(date, locale)
    }, [language])

    const localizedFormatTime = useCallback((date: Date | string) => {
        const locale = language === "uz" ? "uz-UZ" : language === "ru" ? "ru-RU" : "en-US"
        return formatTime(date, locale)
    }, [language])

    return (
        <SettingsContext.Provider value={{
            theme,
            setTheme,
            language,
            setLanguage,
            t: translate,
            formatCurrency: localizedFormatCurrency,
            formatDate: localizedFormatDate,
            formatTime: localizedFormatTime
        }}>
            {children}
        </SettingsContext.Provider>
    )
}

export function useSettings() {
    const context = useContext(SettingsContext)
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider")
    }
    return context
}
