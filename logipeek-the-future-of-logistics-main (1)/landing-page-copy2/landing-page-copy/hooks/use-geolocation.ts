"use client"

import { useState, useEffect, useCallback } from "react"

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  error: string | null
  loading: boolean
  permission: "granted" | "denied" | "prompt" | null
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}

export function useGeolocation(options: GeolocationOptions = {}) {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: false,
    permission: null
  })

  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 60000
  } = options

  // Check permission status
  const checkPermission = useCallback(async () => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: "Geolocation is not supported by this browser",
        permission: "denied"
      }))
      return
    }

    try {
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: "geolocation" })
        setState(prev => ({ ...prev, permission: permission.state as any }))
        
        permission.addEventListener("change", () => {
          setState(prev => ({ ...prev, permission: permission.state as any }))
        })
      }
    } catch (error) {
      console.warn("Could not check geolocation permission:", error)
    }
  }, [])

  // Get current position
  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: "Geolocation is not supported by this browser"
      }))
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          loading: false,
          error: null,
          permission: "granted"
        }))
      },
      (error) => {
        let errorMessage = "Unknown error occurred"
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Joylashuv ruxsati rad etildi"
            setState(prev => ({ ...prev, permission: "denied" }))
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Joylashuv ma'lumotlari mavjud emas"
            break
          case error.TIMEOUT:
            errorMessage = "Joylashuvni aniqlash vaqti tugadi"
            break
        }

        setState(prev => ({
          ...prev,
          error: errorMessage,
          loading: false
        }))
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge
      }
    )
  }, [enableHighAccuracy, timeout, maximumAge])

  // Watch position
  const watchPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: "Geolocation is not supported by this browser"
      }))
      return null
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setState(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          loading: false,
          error: null,
          permission: "granted"
        }))
      },
      (error) => {
        let errorMessage = "Unknown error occurred"
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Joylashuv ruxsati rad etildi"
            setState(prev => ({ ...prev, permission: "denied" }))
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Joylashuv ma'lumotlari mavjud emas"
            break
          case error.TIMEOUT:
            errorMessage = "Joylashuvni aniqlash vaqti tugadi"
            break
        }

        setState(prev => ({
          ...prev,
          error: errorMessage,
          loading: false
        }))
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge
      }
    )

    return watchId
  }, [enableHighAccuracy, timeout, maximumAge])

  // Clear watch
  const clearWatch = useCallback((watchId: number) => {
    if (navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  // Request permission and get location
  const requestLocation = useCallback(() => {
    getCurrentPosition()
  }, [getCurrentPosition])

  useEffect(() => {
    checkPermission()
  }, [checkPermission])

  return {
    ...state,
    getCurrentPosition,
    watchPosition,
    clearWatch,
    requestLocation,
    checkPermission
  }
}
