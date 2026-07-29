import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Target, ArrowRight } from 'lucide-react'
import { getAllDays, getTodayDayNumber, PHASES } from '../data/schedule'
import { supabase } from '../lib/supabase'
import type { ProblemAttempt } from '../types'
import NotificationToast from '../components/NotificationToast'

export default function Overview() {
  const navigate = useNavigate()
  const allDays = getAllDays()
  const todayDay = getTodayDayNumber()
  const [attempts, setAttempts] = useState<ProblemAttempt[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data } = await supabase.from('problem_attempts').select('*')
    setAttempts(data || [])
  }

  const getSolvedCount = (day: number) => {
    return attempts.filter(a => a.day_number === day && a.status === 'solved').length
  }

  const isDayCompleted = (day: number) => {
    const daySchedule = allDays.find(d => d.dayNumber === day)
    if (!daySchedule || daySchedule.questions.length === 0) return false
    return getSolvedCount(day) >= daySchedule.questions.length
  }

  return (
    <>
      <NotificationToast />
      <div className="topbar">
        <div className="topbar-title">55-Day Plan Overview</div>
        <div className="day-indicator">
          <Target size={14} />
          Day {todayDay} of 55
        </div>
      </div>

      <div className="content-area">
        {/* Phase Legend */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {PHASES.map(phase => (
            <div key={phase.number} className="card" style={{
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              borderColor: phase.color,
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: 'var(--radius-sm)',
                background: phase.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700,
                color: 'white',
              }}>
                {phase.number}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{phase.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Days {phase.days}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Day Grid */}
        <div className="card animate-fadeIn mb-6">
          <div className="section-title">
            <Target size={18} />
            All 55 Days — Click to View Schedule
          </div>
          <div className="day-grid">
            {allDays.map(day => {
              const completed = isDayCompleted(day.dayNumber)
              const isToday = day.dayNumber === todayDay
              return (
                <div
                  key={day.dayNumber}
                  className={`day-cell phase-${day.phase} ${isToday ? 'today' : ''} ${completed ? 'completed' : ''}`}
                  onClick={() => navigate(`/day/${day.dayNumber}`)}
                  title={`Day ${day.dayNumber}: ${day.dsaTopic}`}
                >
                  {day.dayNumber}
                </div>
              )
            })}
          </div>
        </div>

        {/* Day-by-Day List */}
        <div className="card animate-fadeIn">
          <div className="section-title">Detailed Schedule</div>
          <div className="question-list">
            {allDays.map(day => {
              const isToday = day.dayNumber === todayDay
              const solved = getSolvedCount(day.dayNumber)
              return (
                <div
                  key={day.dayNumber}
                  className="question-item"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/day/${day.dayNumber}`)}
                >
                  <div className="question-number" style={{
                    background: isToday ? 'var(--accent)' : 'var(--bg-elevated)',
                    color: isToday ? 'white' : 'var(--text-secondary)',
                  }}>
                    {day.dayNumber}
                  </div>
                  <div className="question-info">
                    <div className="question-title">{day.dsaTopic}</div>
                    <div className="question-meta">
                      <span className={`badge badge-${day.phase === 1 ? 'easy' : day.phase === 2 ? 'info' : day.phase === 3 ? 'medium' : day.phase === 4 ? 'hard' : 'purple'}`}>
                        Phase {day.phase}
                      </span>
                      <span>{day.date}</span>
                      <span>Fundamentals: {day.fundamentalsTopic}</span>
                      {day.revisionDays.length > 0 && <span>Revision: Day {day.revisionDays.join(', ')}</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: solved > 0 ? 'var(--success)' : 'var(--text-tertiary)' }}>
                      {solved}/{day.questions.length}
                    </div>
                    {isToday && <span className="badge badge-info" style={{ marginTop: '4px' }}>Today</span>}
                  </div>
                  <ArrowRight size={16} color="var(--text-tertiary)" style={{ marginLeft: '8px' }} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
