import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Calendar, Code2, Eye, AlertCircle, BarChart3, LayoutDashboard, Target, BookOpen } from 'lucide-react'
import { getTodayDayNumber } from '../data/schedule'
import NotificationManager from './NotificationManager'
import { useEffect } from 'react'

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const todayDay = getTodayDayNumber()

  useEffect(() => {
    NotificationManager.init()
  }, [])

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/overview', label: '55-Day Plan', icon: Target },
    { path: `/day/${todayDay}`, label: `Today (Day ${todayDay})`, icon: Calendar },
    { path: '/focus', label: 'Focus Tracker', icon: Eye },
    { path: '/weak-topics', label: 'Weak Topics', icon: AlertCircle },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ]

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    if (path.startsWith('/day/')) return location.pathname.startsWith('/day/')
    return location.pathname.startsWith(path)
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">
              <Code2 size={20} color="white" />
            </div>
            <div>
              <div>SDE Prep</div>
              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 400 }}>55-Day Tracker</div>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Main</div>
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.path}
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <Icon size={16} />
                  {item.label}
                </div>
              )
            })}
          </div>
          <div className="nav-section">
            <div className="nav-section-title">Quick Access</div>
            <div className="nav-item" onClick={() => navigate(`/day/${todayDay}/editor/d${todayDay}q1`)}>
              <Code2 size={16} />
              Code Editor
            </div>
            <div className="nav-item" onClick={() => navigate('/overview')}>
              <BookOpen size={16} />
              All Topics
            </div>
          </div>
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textAlign: 'center' }}>
            Google / Amazon Track<br />Day {todayDay} of 55
          </div>
        </div>
      </aside>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  )
}
