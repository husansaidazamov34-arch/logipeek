import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return ""
  return input.replace(/[<>]/g, "").trim()
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, locale = "uz-UZ", currency = "UZS") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string, locale = "uz-UZ") {
  const d = new Date(date)
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatTime(date: Date | string, locale = "uz-UZ") {
  const d = new Date(date)
  return d.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in kilometers
  return Math.round(distance * 100) / 100
}

export function getStatusColor(status: string) {
  const colors = {
    pending: "yellow",
    confirmed: "blue",
    "in-progress": "purple",
    completed: "green",
    cancelled: "red",
    delivered: "green",
    "in-transit": "blue",
    delayed: "orange",
  }
  return colors[status as keyof typeof colors] || "gray"
}

export function truncateText(text: string, length: number) {
  if (text.length <= length) return text
  return text.substring(0, length) + "..."
}

export function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function validatePhone(phone: string) {
  const re = /^\+998\d{9}$/
  return re.test(phone)
}

export function formatPhoneNumber(phone: string) {
  const cleaned = phone.replace(/\D/g, "")
  if (cleaned.startsWith("998")) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`
  }
  return phone
}

export function exportToCSV(data: any[], filename: string) {
  if (!data || !data.length) return

  const headers = Object.keys(data[0])
  const csvRows = []

  // Add header row
  csvRows.push(headers.join(","))

  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header]
      const escaped = ('' + val).replace(/"/g, '\\"')
      return `"${escaped}"`
    })
    csvRows.push(values.join(","))
  }

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export function exportToJSON(data: any[], filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const link = document.createElement("a")
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.json`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}