/**
 * Cron Scheduler for CMS
 * Handles scheduled tasks like league table sync
 */

import cron, { ScheduledTask } from 'node-cron'
import { syncLeagueTable } from '../sync/league-table-sync'
import { syncTeamStats } from '../sync/team-stats-sync'
import { syncMatches } from '../sync/matches-sync'
import { syncPlayers } from '../sync/players-sync'
import { syncSeasons } from '../sync/seasons-sync'

// Store scheduled tasks
const scheduledTasks: Map<string, ScheduledTask> = new Map()

/**
 * Initialize all scheduled tasks
 */
export function initializeScheduler(): void {
  console.log('[CRON] Initializing scheduler...')

  // League table sync - every hour at minute 5
  // Cron: "5 * * * *" = At minute 5 of every hour
  scheduleTask('league-table-sync', '5 * * * *', async () => {
    console.log('[CRON] Running scheduled league table sync...')
    const result = await syncLeagueTable()
    console.log(`[CRON] Sync result: ${result.message}`)
  })

  // Daily full sync at 3:00 AM
  // Cron: "0 3 * * *" = At 03:00 every day
  scheduleTask('league-table-daily-sync', '0 3 * * *', async () => {
    console.log('[CRON] Running daily full league table sync...')
    const result = await syncLeagueTable({ forceUpdate: true })
    console.log(`[CRON] Daily sync result: ${result.message}`)
  })

  // Team stats sync - every hour at minute 10
  // Cron: "10 * * * *" = At minute 10 of every hour
  scheduleTask('team-stats-sync', '10 * * * *', async () => {
    console.log('[CRON] Running scheduled team stats sync...')
    const result = await syncTeamStats()
    console.log(`[CRON] Team stats sync result: ${result.message}`)
  })

  // Matches sync - every hour at minute 15
  // Cron: "15 * * * *" = At minute 15 of every hour
  scheduleTask('matches-sync', '15 * * * *', async () => {
    console.log('[CRON] Running scheduled matches sync...')
    const result = await syncMatches()
    console.log(`[CRON] Matches sync result: ${result.message}`)
  })

  // Matches full sync daily at 4:00 AM
  // Cron: "0 4 * * *" = At 04:00 every day
  scheduleTask('matches-daily-sync', '0 4 * * *', async () => {
    console.log('[CRON] Running daily full matches sync...')
    const result = await syncMatches({ syncDetails: true })
    console.log(`[CRON] Daily matches sync result: ${result.message}`)
  })

  // Players sync daily at 5:00 AM (after matches sync)
  // Cron: "0 5 * * *" = At 05:00 every day
  scheduleTask('players-sync', '0 5 * * *', async () => {
    console.log('[CRON] Running daily players sync...')
    const result = await syncPlayers()
    console.log(`[CRON] Players sync result: ${result.message}`)
  })

  // Seasons sync weekly on Monday at 2:00 AM
  // Cron: "0 2 * * 1" = At 02:00 on Monday
  scheduleTask('seasons-sync', '0 2 * * 1', async () => {
    console.log('[CRON] Running weekly seasons sync...')
    const result = await syncSeasons()
    console.log(`[CRON] Seasons sync result: ${result.message}`)
  })

  console.log('[CRON] Scheduler initialized with tasks:', Array.from(scheduledTasks.keys()))
}

/**
 * Schedule a task
 */
function scheduleTask(name: string, cronExpression: string, task: () => Promise<void>): void {
  // Stop existing task if any
  if (scheduledTasks.has(name)) {
    scheduledTasks.get(name)?.stop()
  }

  const scheduledTask = cron.schedule(
    cronExpression,
    async () => {
      try {
        await task()
      } catch (error) {
        console.error(`[CRON] Task "${name}" failed:`, error)
      }
    },
    {
      timezone: 'Asia/Almaty', // Kazakhstan timezone
    }
  )

  scheduledTasks.set(name, scheduledTask)
  console.log(`[CRON] Scheduled task "${name}" with expression: ${cronExpression}`)
}

/**
 * Stop all scheduled tasks
 */
export function stopScheduler(): void {
  console.log('[CRON] Stopping scheduler...')

  scheduledTasks.forEach((task, name) => {
    task.stop()
    console.log(`[CRON] Stopped task: ${name}`)
  })

  scheduledTasks.clear()
}

/**
 * Get scheduler status
 */
export function getSchedulerStatus(): { tasks: string[]; running: boolean } {
  return {
    tasks: Array.from(scheduledTasks.keys()),
    running: scheduledTasks.size > 0,
  }
}

/**
 * Manually trigger a task
 */
export async function triggerTask(taskName: string): Promise<boolean> {
  console.log(`[CRON] Manually triggering task: ${taskName}`)

  if (taskName === 'league-table-sync' || taskName === 'league-table-daily-sync') {
    await syncLeagueTable()
    return true
  }

  if (taskName === 'team-stats-sync') {
    await syncTeamStats()
    return true
  }

  if (taskName === 'matches-sync' || taskName === 'matches-daily-sync') {
    await syncMatches()
    return true
  }

  if (taskName === 'players-sync') {
    await syncPlayers()
    return true
  }

  if (taskName === 'seasons-sync') {
    await syncSeasons()
    return true
  }

  console.log(`[CRON] Task "${taskName}" not found`)
  return false
}
