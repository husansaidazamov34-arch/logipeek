// Real-time data simulation for Central Asian logistics

export interface RealTimeTraffic {
  routeId: string
  congestionLevel: "low" | "medium" | "high"
  averageSpeed: number
  incidents: TrafficIncident[]
  borderWaitTime?: number
}

export interface TrafficIncident {
  id: string
  type: "accident" | "construction" | "border_delay" | "weather" | "checkpoint"
  location: string
  description: string
  severity: "minor" | "moderate" | "major"
  estimatedDelay: number // minutes
  coordinates: { lat: number; lng: number }
}

export interface WeatherCondition {
  location: string
  temperature: number
  condition: "clear" | "cloudy" | "rain" | "snow" | "fog"
  visibility: number // km
  windSpeed: number // km/h
  impact: "none" | "minor" | "moderate" | "severe"
}

export interface BorderCrossing {
  name: string
  country1: string
  country2: string
  coordinates: { lat: number; lng: number }
  currentWaitTime: number // minutes
  averageWaitTime: number
  status: "open" | "closed" | "limited"
  workingHours: string
  requiredDocuments: string[]
}

// Real-time traffic data
export const getCurrentTraffic = (): RealTimeTraffic[] => {
  return [
    {
      routeId: "tashkent-almaty",
      congestionLevel: "medium",
      averageSpeed: 65,
      borderWaitTime: 45,
      incidents: [
        {
          id: "inc1",
          type: "border_delay",
          location: "Chernyaevka Border Crossing",
          description: "Increased document checks due to new regulations",
          severity: "moderate",
          estimatedDelay: 45,
          coordinates: { lat: 42.8, lng: 71.2 }
        },
        {
          id: "inc2", 
          type: "construction",
          location: "M32 Highway, km 234",
          description: "Road repair work, single lane traffic",
          severity: "minor",
          estimatedDelay: 15,
          coordinates: { lat: 42.5, lng: 70.1 }
        }
      ]
    },
    {
      routeId: "tashkent-bishkek",
      congestionLevel: "low",
      averageSpeed: 75,
      incidents: [
        {
          id: "inc3",
          type: "weather",
          location: "Kamchik Pass",
          description: "Light snow, reduced visibility",
          severity: "minor",
          estimatedDelay: 20,
          coordinates: { lat: 41.0, lng: 71.5 }
        }
      ]
    }
  ]
}

// Weather conditions
export const getCurrentWeather = (): WeatherCondition[] => {
  return [
    {
      location: "Tashkent",
      temperature: 12,
      condition: "cloudy",
      visibility: 8,
      windSpeed: 15,
      impact: "none"
    },
    {
      location: "Almaty",
      temperature: 5,
      condition: "snow",
      visibility: 3,
      windSpeed: 25,
      impact: "moderate"
    },
    {
      location: "Bishkek",
      temperature: 8,
      condition: "clear",
      visibility: 10,
      windSpeed: 10,
      impact: "none"
    },
    {
      location: "Shymkent",
      temperature: 10,
      condition: "rain",
      visibility: 6,
      windSpeed: 20,
      impact: "minor"
    }
  ]
}

// Border crossings
export const getBorderCrossings = (): BorderCrossing[] => {
  return [
    {
      name: "Chernyaevka-Gisht Kuprik",
      country1: "Kazakhstan 🇰🇿",
      country2: "Uzbekistan 🇺🇿", 
      coordinates: { lat: 42.8123, lng: 71.2456 },
      currentWaitTime: 45,
      averageWaitTime: 30,
      status: "open",
      workingHours: "24/7",
      requiredDocuments: ["Passport", "Vehicle Registration", "Insurance", "CMR"]
    },
    {
      name: "Dostyk-Alashankou",
      country1: "Kazakhstan 🇰🇿",
      country2: "China 🇨🇳",
      coordinates: { lat: 45.1833, lng: 82.5667 },
      currentWaitTime: 120,
      averageWaitTime: 90,
      status: "open", 
      workingHours: "09:00-18:00",
      requiredDocuments: ["Passport", "Visa", "Vehicle Permit", "Cargo Declaration"]
    },
    {
      name: "Kordai-Ak-Jol",
      country1: "Kazakhstan 🇰🇿",
      country2: "Kyrgyzstan 🇰🇬",
      coordinates: { lat: 43.6667, lng: 75.9167 },
      currentWaitTime: 25,
      averageWaitTime: 20,
      status: "open",
      workingHours: "24/7",
      requiredDocuments: ["Passport", "Vehicle Registration", "Insurance"]
    }
  ]
}

// Fuel prices by region
export const getFuelPrices = () => {
  return {
    uzbekistan: {
      diesel: 8500, // som per liter
      gasoline: 9200,
      currency: "UZS"
    },
    kazakhstan: {
      diesel: 280, // tenge per liter  
      gasoline: 290,
      currency: "KZT"
    },
    kyrgyzstan: {
      diesel: 65, // som per liter
      gasoline: 70,
      currency: "KGS"
    }
  }
}

// Real-time driver locations (mock data)
export const getActiveDrivers = () => {
  return [
    {
      id: "driver1",
      name: "Aziz Rahimov",
      vehicle: "Kamaz 5320 (25t)",
      currentLocation: { lat: 41.3111, lng: 69.2797 },
      destination: "Almaty",
      status: "en_route",
      estimatedArrival: "2024-12-15T18:30:00Z",
      cargoType: "Electronics",
      speed: 68 // km/h
    },
    {
      id: "driver2", 
      name: "Bekzod Aliyev",
      vehicle: "Volvo FH16 (40t)",
      currentLocation: { lat: 42.1234, lng: 70.5678 },
      destination: "Bishkek", 
      status: "loading",
      estimatedArrival: "2024-12-16T10:15:00Z",
      cargoType: "Textiles",
      speed: 0
    }
  ]
}

// Calculate real-time route information
export const calculateRouteInfo = (from: string, to: string) => {
  const routes = {
    "tashkent-almaty": {
      distance: 687,
      baseTime: 525, // minutes
      fuelConsumption: 180, // liters
      tollCosts: 85000, // som
      borderCrossings: 1
    },
    "tashkent-bishkek": {
      distance: 456,
      baseTime: 420,
      fuelConsumption: 120,
      tollCosts: 45000,
      borderCrossings: 1
    }
  }
  
  const routeKey = `${from.toLowerCase()}-${to.toLowerCase()}`
  const baseRoute = routes[routeKey as keyof typeof routes]
  
  if (!baseRoute) return null
  
  const traffic = getCurrentTraffic().find(t => t.routeId === routeKey)
  const weather = getCurrentWeather()
  
  // Calculate delays
  let totalDelay = 0
  if (traffic) {
    totalDelay += traffic.incidents.reduce((sum, inc) => sum + inc.estimatedDelay, 0)
    if (traffic.borderWaitTime) totalDelay += traffic.borderWaitTime
  }
  
  // Weather impact
  const weatherImpact = weather.reduce((impact, w) => {
    if (w.impact === "moderate") return impact + 30
    if (w.impact === "severe") return impact + 60
    return impact
  }, 0)
  
  return {
    ...baseRoute,
    estimatedTime: baseRoute.baseTime + totalDelay + weatherImpact,
    trafficDelay: totalDelay,
    weatherDelay: weatherImpact,
    currentTraffic: traffic?.congestionLevel || "low"
  }
}