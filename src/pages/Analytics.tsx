import { useEffect, useState } from 'react'
import { TrendingUp, Clock, CheckCircle, Target, Award, BarChart3 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { formatDuration, getTodayDayNumber, PHASES, getAllDays } from '../data/schedule'
import type { ProblemAttempt, FocusLog, StudySession } from '../types'
import NotificationToast from '../components/NotificationToast'

export default function Analytics() {
  const [attempts, setAttempts] = useState<ProblemAttempt[]>([])
  const [focusLogs, setFocusLogs] = useState<FocusLog[]>([])
  const [sessions, setSessions] = useState<StudySession[]>([])
  const todayDay = getTodayDayNumber()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: attemptData } = await supabase.from('problem_attempts').select('*')
    setAttempts(attemptData || [])
    const { data: focusData } = await supabase.from('focus_logs').select('*')
    setFocusLogs(focusData || [])
    const { data: sessionData } = await supabase.from('study_sessions').select('*')
    setSessions(sessionData || [])
  }

  const solved = attempts.filter(a => a.status === 'solved')
  const attempted = attempts.filter(a => a.status === 'attempted')
  const avgAccuracy = solved.length > 0
    ? Math.round(solved.reduce((sum, a) => sum + (a.accuracy || 0), 0) / solved.length)
    : 0
  const totalFocusSeconds = focusLogs.reduce((sum, f) => sum + (f.focused_seconds || 0), 0)
  const avgFocusScore = focusLogs.length > 0
    ? Math.round(focusLogs.reduce((sum, f) => sum + (f.focus_score || 0), 0) / focusLogs.length)
    : 0

  // Problems by difficulty
  const easySolved = solved.filter(a => a.difficulty === 'Easy').length
  const mediumSolved = solved.filter(a => a.difficulty === 'Medium').length
  const hardSolved = solved.filter(a => a.difficulty === 'Hard').length

  // Problems by topic
  const topicStats: Record<string, { solved: number; attempted: number; total: number }> = {}
  const allDays = getAllDays()
  allDays.forEach(day => {
    day.questions.forEach(q => {
      if (!topicStats[q.topic]) topicStats[q.topic] = { solved: 0, attempted: 0, total: 0 }
      topicStats[q.topic].total++
    })
  })
  attempts.forEach(a => {
    if (!topicStats[a.problem_topic]) topicStats[a.problem_topic] = { solved: 0, attempted: 0, total: 0 }
    if (a.status === 'solved') topicStats[a.problem_topic].solved++
    if (a.status === 'attempted') topicStats[a.problem_topic].attempted++
  })

  // Focus by day
  const focusByDay: Record<number, number> = {}
  focusLogs.forEach(f => {
    focusByDay[f.day_number] = (focusByDay[f.day_number] || 0) + (f.focused_seconds || 0)
  })

  // Time spent per day
  const timeByDay: Record<number, number> = {}
  attempts.forEach(a => {
    timeByDay[a.day_number] = (timeByDay[a.day_number] || 0) + (a.time_spent_seconds || 0)
  })

  const sortedTopics = Object.entries(topicStats).sort((a, b) => b[1].total - a[1].total)

  return (
    <>
      <NotificationToast />
      <div className="topbar">
        <div className="topbar-title">Analytics</div>
        <div className="day-indicator">
          <BarChart3 size={14} />
          Day {todayDay} of 55
        </div>
      </div>

      <div className="content-area">
        {/* Top Stats */}
        <div className="stat-grid">
          <div className="stat-card animate-fadeIn">
            <div className="stat-label"><CheckCircle size={14} /> Total Solved</div>
            <div className="stat-value">{solved.length}</div>
            <div className="stat-sub">{attempted.length} in progress</div>
          </div>
          <div className="stat-card animate-fadeIn">
            <div className="stat-label"><Clock size={14} /> Total Focus Time</div>
            <div className="stat-value">{formatDuration(totalFocusSeconds)}</div>
            <div className="stat-sub">Across {focusLogs.length} sessions</div>
          </div>
          <div className="stat-card animate-fadeIn">
            <div className="stat-label"><TrendingUp size={14} /> Avg Accuracy</div>
            <div className="stat-value">{avgAccuracy}%</div>
            <div className="stat-sub">On solved problems</div>
          </div>
          <div className="stat-card animate-fadeIn">
            <div className="stat-label"><Target size={14} /> Avg Focus Score</div>
            <div className="stat-value">{avgFocusScore}%</div>
            <div className="stat-sub">Camera-based tracking</div>
          </div>
        </div>

        <div className="grid-2">
          {/* Difficulty Breakdown */}
          <div className="card animate-fadeIn">
            <div className="section-title">
              <Award size={18} />
              Problems by Difficulty
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span className="badge badge-easy">Easy</span>
                  <span className="font-mono font-bold">{easySolved} solved</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${Math.min(100, (easySolved / Math.max(1, solved.length)) * 100)}%`, background: 'var(--success)' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span className="badge badge-medium">Medium</span>
                  <span className="font-mono font-bold">{mediumSolved} solved</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${Math.min(100, (mediumSolved / Math.max(1, solved.length)) * 100)}%`, background: 'var(--warning)' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span className="badge badge-hard">Hard</span>
                  <span className="font-mono font-bold">{hardSolved} solved</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${Math.min(100, (hardSolved / Math.max(1, solved.length)) * 100)}%`, background: 'var(--error)' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Focus by Day */}
          <div className="card animate-fadeIn">
            <div className="section-title">
              <Clock size={18} />
              Focus Time by Day
            </div>
            {Object.keys(focusByDay).length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(focusByDay).sort((a, b) => parseInt(a[0]) - parseInt(b[0])).map(([day, sec]) => (
                  <div key={day} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ width: '60px', fontSize: '12px', color: 'var(--text-tertiary)' }}>Day {day}</span>
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div className="progress-bar-fill" style={{ width: `${Math.min(100, (sec / 3600) * 100)}%`, background: 'var(--gradient-1)' }} />
                    </div>
                    <span style={{ width: '60px', fontSize: '12px', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>{formatDuration(sec)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Clock size={32} className="empty-state-icon" />
                <div className="empty-state-text">No focus data yet</div>
              </div>
            )}
          </div>
        </div>

        {/* Topic-wise Progress */}
        <div className="card animate-fadeIn mt-4">
          <div className="section-title">
            <Target size={18} />
            Topic-wise Progress
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
            {sortedTopics.map(([topic, stats]) => (
              <div key={topic} className="card" style={{ background: 'var(--bg-tertiary)', padding: '14px' }}>
                <div className="font-600 mb-2">{topic}</div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
                  <span>Solved: {stats.solved}</span>
                  <span>Total: {stats.total}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{
                    width: `${stats.total > 0 ? (stats.solved / stats.total) * 100 : 0}%`,
                    background: stats.solved === stats.total && stats.total > 0 ? 'var(--success)' : 'var(--gradient-1)',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phase Progress */}
        <div className="card animate-fadeIn mt-4">
          <div className="section-title">
            <TrendingUp size={18} />
            Phase Progress
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {PHASES.map(phase => {
              const phaseDays = allDays.filter(d => d.phase === phase.number)
              const phaseSolved = attempts.filter(a => {
                const day = allDays.find(d => d.dayNumber === a.day_number)
                return day?.phase === phase.number && a.status === 'solved'
              }).length
              const phaseTotal = phaseDays.reduce((sum, d) => sum + d.questions.length, 0)
              const isCurrent = phase.number === allDays.find(d => d.dayNumber === todayDay)?.phase
              return (
                <div key={phase.number} className={`card ${isCurrent ? '' : ''}`} style={{
                  background: isCurrent ? 'var(--bg-elevated)' : 'var(--bg-tertiary)',
                  padding: '14px',
                  borderColor: isCurrent ? phase.color : 'var(--border)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-sm)',
                      background: phase.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: 'white',
                    }}>
                      {phase.number}
                    </div>
                    <div className="flex-1">
                      <div className="font-600">{phase.name}</div>
                      <div className="text-sm text-tertiary">Days {phase.days} — {phaseSolved}/{phaseTotal} solved</div>
                    </div>
                    {isCurrent && <span className="badge badge-info">Current</span>}
                  </div>
                  <div className="progress-bar mt-2">
                    <div className="progress-bar-fill" style={{
                      width: `${phaseTotal > 0 ? (phaseSolved / phaseTotal) * 100 : 0}%`,
                      background: phase.color,
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
