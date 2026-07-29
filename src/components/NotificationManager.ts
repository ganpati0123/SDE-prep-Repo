import { supabase } from '../lib/supabase'
import { getTodayDayNumber, getDaySchedule } from '../data/schedule'

interface NotificationData {
  id: string
  title: string
  body: string
  icon: string
  type: 'schedule' | 'reminder' | 'weak-topic'
}

let activeNotifications: string[] = []
let checkInterval: ReturnType<typeof setInterval> | null = null

export default class NotificationManager {
  static init() {
    this.checkSchedule()
    this.checkWeakTopics()

    if (checkInterval) clearInterval(checkInterval)
    checkInterval = setInterval(() => {
      this.checkSchedule()
      this.checkWeakTopics()
    }, 60000) // check every minute
  }

  static async checkSchedule() {
    const todayDay = getTodayDayNumber()
    const schedule = getDaySchedule(todayDay)
    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    for (const block of schedule.blocks) {
      const blockStartMinutes = block.startHour * 60 + block.startMinute
      const diff = blockStartMinutes - currentMinutes

      if (diff === 0 || (diff <= 1 && diff >= 0)) {
        const notifId = `schedule-${todayDay}-${block.id}`
        if (!activeNotifications.includes(notifId)) {
          activeNotifications.push(notifId)
          this.show({
            id: notifId,
            title: `Block Starting: ${block.name}`,
            body: block.topic ? `Topic: ${block.topic}` : 'Time to start this block',
            icon: 'calendar',
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

      if (hoursSinceLast >= 4) {
        activeNotifications.push(notifId)
        this.show({
          id: notifId,
          title: 'Weak Topic Reminder',
          body: `Don't forget to review: ${topic.topic_name}`,
          icon: 'alert',
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
      new Notification(notif.title, { body: notif.body })
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
}

NotificationManager.requestPermission()
