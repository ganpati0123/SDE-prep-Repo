import { useEffect, useState } from 'react'
import { Bell, X, AlertCircle, Calendar } from 'lucide-react'
import NotificationManager from './NotificationManager'

interface ToastNotification {
  id: string
  title: string
  body: string
  type: string
}

export default function NotificationToast() {
  const [notifications, setNotifications] = useState<ToastNotification[]>([])

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as ToastNotification
      setNotifications(prev => [...prev, detail])
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== detail.id))
        NotificationManager.dismiss(detail.id)
      }, 8000)
    }
    window.addEventListener('app-notification', handler)
    return () => window.removeEventListener('app-notification', handler)
  }, [])

  const dismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    NotificationManager.dismiss(id)
  }

  if (notifications.length === 0) return null

  return (
    <>
      {notifications.map(n => (
        <div key={n.id} className="notification">
          <div className="notification-icon" style={{
            background: n.type === 'weak-topic' ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)'
          }}>
            {n.type === 'weak-topic' ? (
              <AlertCircle size={18} color="var(--error)" />
            ) : (
              <Calendar size={18} color="var(--accent-light)" />
            )}
          </div>
          <div className="notification-content">
            <div className="notification-title">{n.title}</div>
            <div className="notification-body">{n.body}</div>
          </div>
          <button className="notification-close" onClick={() => dismiss(n.id)}>
            <X size={16} />
          </button>
        </div>
      ))}
    </>
  )
}
