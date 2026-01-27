import { searchAddress } from '@/services/geocoding'

export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number; street: string; city: string } | null> {
  try {
    const results = await searchAddress(address)
    if (results.length === 0) return null

    const result = results[0]
    const lat = parseFloat(result.lat)
    const lng = parseFloat(result.lon)
    
    // Parse address components
    const parts = result.display_name.split(',')
    const street = parts[0] || address
    const city = parts.find(p => p.includes('tuman') || p.includes('shahar')) || parts[1] || 'Unknown'

    return { lat, lng, street: street.trim(), city: city.trim() }
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

