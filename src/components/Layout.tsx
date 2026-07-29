import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Calendar, Code as Code2, Eye, CircleAlert as AlertCircle, ChartBar as BarChart3, LayoutDashboard, Target, BookOpen, Flame } from 'lucide-react'
import { getTodayDayNumber } from '../data/schedule'
import NotificationManager from './NotificationManager'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const todayDay = getTodayDayNumber()
  const [solvedCount, setSolvedCount] = useState(0)

  useEffect(() => {
    NotificationManager.init()
    loadProgress()
  }, [])

  const loadProgress = async () => {
    const { data } = await supabase.from('problem_attempts').select('*').eq('status', 'solved')
    setSolvedCount(data?.length || 0)
  }

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard, color: 'var(--blue)' },
    { path: '/overview', label: '55-Day Plan', icon: Target, color: 'var(--green)' },
    { path: `/day/${todayDay}`, label: `Today (Day ${todayDay})`, icon: Calendar, color: 'var(--cyan)' },
    { path: '/focus', label: 'Focus Tracker', icon: Eye, color: 'var(--amber)' },
    { path: '/weak-topics', label: 'Weak Topics', icon: AlertCircle, color: 'var(--pink)' },
    { path: '/analytics', label: 'Analytics', icon: BarChart3, color: 'var(--teal)' },
  ]

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    if (path.startsWith('/day/')) return location.pathname.startsWith('/day/')
    return location.pathname.startsWith(path)
  }

  const progressPercent = Math.round((solvedCount / 275) * 100)

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">
              <Code2 size={20} color="white" />
            </div>
            <div className="sidebar-logo-text">
              <span className="main">SDE Prep</span>
              <span className="sub">55-Day Tracker</span>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Navigation</div>
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.path}
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <Icon size={16} style={{ color: isActive(item.path) ? item.color : undefined }} />
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
        <div className="sidebar-footer">
          <div className="sidebar-progress-ring">
            <div className="progress-ring-circle" style={{ ['--p' as any]: `${progressPercent}%` }}>
              <div className="progress-ring-inner">{progressPercent}%</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{solvedCount} solved</div>
              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Day {todayDay} of 55</div>
            </div>
          </div>
        </div>
      </aside>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  )
}
