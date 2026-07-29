import { supabase } from '../lib/supabase'
import { getTodayDayNumber, getDaySchedule } from '../data/schedule'

interface NotificationData {
  id: string
  title: string
  body: string
  type: 'schedule' | 'reminder' | 'weak-topic'
}

let activeNotifications: string[] = []
let checkInterval: ReturnType<typeof setInterval> | null = null

// Get current time in Kolkata/IST timezone (UTC+5:30)
function getISTTime(): { hours: number; minutes: number; day: number; month: number; year: number } {
  const now = new Date()
  // IST is UTC+5:30
  const istOffset = 5.5 * 60 * 60 * 1000
  const istTime = new Date(now.getTime() + istOffset + (now.getTimezoneOffset() * 60 * 1000))
  return {
    hours: istTime.getUTCHours(),
    minutes: istTime.getUTCMinutes(),
    day: istTime.getUTCDate(),
    month: istTime.getUTCMonth() + 1,
    year: istTime.getUTCFullYear(),
  }
}

export default class NotificationManager {
  static init() {
    this.checkSchedule()
    this.checkWeakTopics()

    if (checkInterval) clearInterval(checkInterval)
    checkInterval = setInterval(() => {
      this.checkSchedule()
      this.checkWeakTopics()
    }, 30000) // check every 30 seconds for more precise timing
  }

  static async checkSchedule() {
    const todayDay = getTodayDayNumber()
    const schedule = getDaySchedule(todayDay)
    const ist = getISTTime()
    const currentMinutes = ist.hours * 60 + ist.minutes

    for (const block of schedule.blocks) {
      const blockStartMinutes = block.startHour * 60 + block.startMinute
      const diff = blockStartMinutes - currentMinutes

      // Fire notification when block starts (within 1 minute window)
      if (diff === 0 || (diff <= 1 && diff >= 0)) {
        const notifId = `schedule-${todayDay}-${block.id}`
        if (!activeNotifications.includes(notifId)) {
          activeNotifications.push(notifId)
          this.show({
            id: notifId,
            title: `Block Starting: ${block.name}`,
            body: block.topic ? `Topic: ${block.topic}` : 'Time to start this block',
            type: 'schedule',
          })
        }
      }

      // Also fire a 5-minute warning for study blocks
      if (block.type === 'study' && diff === 5) {
        const notifId = `schedule-warning-${todayDay}-${block.id}`
        if (!activeNotifications.includes(notifId)) {
          activeNotifications.push(notifId)
          this.show({
            id: notifId,
            title: `Upcoming: ${block.name}`,
            body: `Starts in 5 minutes. ${block.topic ? 'Topic: ' + block.topic : ''}`,
            type: 'schedule',
          })
        }
      }
    }
  }

  static async checkWeakTopics() {
    const { data } = await supabase
      .from('weak_topics')
      .select('*')
      .eq('resolved', false)
      .eq('reminder_enabled', true)

    if (!data) return

    for (const topic of data) {
      const notifId = `weak-${topic.id}`
      if (activeNotifications.includes(notifId)) continue

      const lastReminded = topic.last_reminded ? new Date(topic.last_reminded) : null
      const now = new Date()
      const hoursSinceLast = lastReminded ? (now.getTime() - lastReminded.getTime()) / (1000 * 60 * 60) : 999

      // Remind every 4 hours
      if (hoursSinceLast >= 4) {
        activeNotifications.push(notifId)
        this.show({
          id: notifId,
          title: 'Weak Topic Reminder',
          body: `Don't forget to review: ${topic.topic_name}`,
          type: 'weak-topic',
        })
        await supabase.from('weak_topics').update({ last_reminded: now.toISOString() }).eq('id', topic.id)
      }
    }
  }

  static show(notif: NotificationData) {
    const event = new CustomEvent('app-notification', { detail: notif })
    window.dispatchEvent(event)

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(notif.title, { body: notif.body })
      } catch { /* ignore */ }
    }
  }

  static requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  static dismiss(id: string) {
    activeNotifications = activeNotifications.filter(n => n !== id)
  }

  static getISTTime() {
    return getISTTime()
  }
}

NotificationManager.requestPermission()
