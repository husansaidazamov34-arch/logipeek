// Performance monitoring utilities for LogiPeek

export interface PerformanceMetrics {
  name: string
  duration: number
  timestamp: number
  metadata?: Record<string, any>
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = []
  private observers: PerformanceObserver[] = []

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers()
    }
  }

  private initializeObservers() {
    // Observe navigation timing
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric({
            name: `navigation.${entry.name}`,
            duration: entry.duration,
            timestamp: entry.startTime,
            metadata: {
              type: entry.entryType,
              transferSize: (entry as any).transferSize,
              encodedBodySize: (entry as any).encodedBodySize,
            }
          })
        }
      })

      try {
        navObserver.observe({ entryTypes: ['navigation'] })
        this.observers.push(navObserver)
      } catch (e) {
        console.warn('Navigation timing not supported')
      }

      // Observe resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 100) { // Only log slow resources
            this.recordMetric({
              name: `resource.${entry.name.split('/').pop()}`,
              duration: entry.duration,
              timestamp: entry.startTime,
              metadata: {
                type: entry.entryType,
                transferSize: (entry as any).transferSize,
              }
            })
          }
        }
      })

      try {
        resourceObserver.observe({ entryTypes: ['resource'] })
        this.observers.push(resourceObserver)
      } catch (e) {
        console.warn('Resource timing not supported')
      }
    }
  }

  recordMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric)

    // Keep only last 100 metrics to prevent memory leaks
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100)
    }

    // Log slow operations in development
    if (process.env.NODE_ENV === 'development' && metric.duration > 1000) {
      console.warn(`Slow operation detected: ${metric.name} took ${metric.duration}ms`)
    }
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics]
  }

  getAverageMetric(name: string): number {
    const filtered = this.metrics.filter(m => m.name === name)
    if (filtered.length === 0) return 0

    const sum = filtered.reduce((acc, m) => acc + m.duration, 0)
    return sum / filtered.length
  }

  clearMetrics() {
    this.metrics = []
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
    this.clearMetrics()
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

// Utility functions
export function measureAsync<T>(
  name: string,
  fn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const start = performance.now()

  return fn().then(
    (result) => {
      const duration = performance.now() - start
      performanceMonitor.recordMetric({
        name,
        duration,
        timestamp: start,
        metadata: { ...metadata, status: 'success' }
      })
      return result
    },
    (error) => {
      const duration = performance.now() - start
      performanceMonitor.recordMetric({
        name,
        duration,
        timestamp: start,
        metadata: { ...metadata, status: 'error', error: error.message }
      })
      throw error
    }
  )
}

export function measureSync<T>(
  name: string,
  fn: () => T,
  metadata?: Record<string, any>
): T {
  const start = performance.now()

  try {
    const result = fn()
    const duration = performance.now() - start
    performanceMonitor.recordMetric({
      name,
      duration,
      timestamp: start,
      metadata: { ...metadata, status: 'success' }
    })
    return result
  } catch (error) {
    const duration = performance.now() - start
    performanceMonitor.recordMetric({
      name,
      duration,
      timestamp: start,
      metadata: {
        ...metadata,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    })
    throw error
  }
}

// Web Vitals tracking
export function trackWebVitals() {
  if (typeof window === 'undefined') return

  // Track Core Web Vitals
  import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
    onCLS((metric) => {
      performanceMonitor.recordMetric({
        name: 'web-vitals.cls',
        duration: metric.value,
        timestamp: Date.now(),
        metadata: { rating: metric.rating }
      })
    })

    onINP((metric) => {
      performanceMonitor.recordMetric({
        name: 'web-vitals.inp',
        duration: metric.value,
        timestamp: Date.now(),
        metadata: { rating: metric.rating }
      })
    })

    onFCP((metric) => {
      performanceMonitor.recordMetric({
        name: 'web-vitals.fcp',
        duration: metric.value,
        timestamp: Date.now(),
        metadata: { rating: metric.rating }
      })
    })

    onLCP((metric) => {
      performanceMonitor.recordMetric({
        name: 'web-vitals.lcp',
        duration: metric.value,
        timestamp: Date.now(),
        metadata: { rating: metric.rating }
      })
    })

    onTTFB((metric) => {
      performanceMonitor.recordMetric({
        name: 'web-vitals.ttfb',
        duration: metric.value,
        timestamp: Date.now(),
        metadata: { rating: metric.rating }
      })
    })
  }).catch(() => {
    console.warn('Web Vitals library not available')
  })
}