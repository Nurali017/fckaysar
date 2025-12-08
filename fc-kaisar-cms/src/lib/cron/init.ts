/**
 * Cron initialization for Next.js
 * This should be imported in the app startup
 */

import { initializeScheduler, stopScheduler } from './scheduler'

let isInitialized = false

/**
 * Initialize cron scheduler (called once on app start)
 */
export function initCron(): void {
  // Prevent multiple initializations in dev mode (hot reload)
  if (isInitialized) {
    console.log('[CRON] Scheduler already initialized, skipping...')
    return
  }

  // Only run on server
  if (typeof window !== 'undefined') {
    return
  }

  // Check if cron is enabled
  if (process.env.DISABLE_CRON === 'true') {
    console.log('[CRON] Scheduler disabled by environment variable')
    return
  }

  isInitialized = true
  initializeScheduler()

  // Cleanup on process exit
  process.on('SIGTERM', () => {
    console.log('[CRON] SIGTERM received, stopping scheduler...')
    stopScheduler()
  })

  process.on('SIGINT', () => {
    console.log('[CRON] SIGINT received, stopping scheduler...')
    stopScheduler()
    process.exit(0)
  })
}

/**
 * Check if cron is running
 */
export function isCronRunning(): boolean {
  return isInitialized
}
