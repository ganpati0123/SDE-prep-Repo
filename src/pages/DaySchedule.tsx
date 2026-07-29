import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Clock, Code2, BookOpen, RotateCcw, CheckCircle, ArrowLeft, Calendar } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getDaySchedule, formatTime, formatDuration } from '../data/schedule'
import type { ProblemAttempt, StudySession } from '../types'
import NotificationToast from '../components/NotificationToast'

export default function DaySchedule() {
  const { dayNumber } = useParams()
  const navigate = useNavigate()
  const day = parseInt(dayNumber || '1')
  const schedule = getDaySchedule(day)

  const [attempts, setAttempts] = useState<ProblemAttempt[]>([])
  const [sessions, setSessions] = useState<StudySession[]>([])

  useEffect(() => {
    loadData()
  }, [day])

  const loadData = async () => {
    const { data: attemptData } = await supabase
      .from('problem_attempts')
      .select('*')
      .eq('day_number', day)
    setAttempts(attemptData || [])

    const { data: sessionData } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('day_number', day)
    setSessions(sessionData || [])
  }

  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  const isBlockActive = (block: typeof schedule.blocks[0]) => {
    const start = block.startHour * 60 + block.startMinute
    const end = start + block.durationMinutes
    return currentMinutes >= start && currentMinutes < end
  }

  const solvedCount = attempts.filter(a => a.status === 'solved').length
  const totalStudySeconds = sessions.reduce((sum, s) => sum + (s.actual_duration_seconds || 0), 0)

  const blockColors: Record<string, string> = {
    study: 'var(--accent)',
    break: 'var(--text-tertiary)',
    meal: 'var(--warning)',
    sleep: 'var(--purple)',
  }

  return (
    <>
      <NotificationToast />
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>
            <ArrowLeft size={14} />
            Back
          </button>
          <div className="topbar-title">Day {day} — {schedule.date}</div>
        </div>
        <div className="day-indicator">
          <Calendar size={14} />
          Phase {schedule.phase}: {schedule.phaseName}
        </div>
      </div>

      <div className="content-area">
        {/* Day Overview */}
        <div className="phase-banner animate-fadeIn">
          <div className="phase-number" style={{ background: PHASE_COLOR[schedule.phase] }}>
            {schedule.phase}
          </div>
          <div className="flex-1">
            <div style={{ fontSize: '16px', fontWeight: 700 }}>{schedule.dsaTopic}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Fundamentals: {schedule.fundamentalsTopic}
            </div>
            {schedule.revisionDays.length > 0 && (
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                Revision: Days {schedule.revisionDays.join(', ')}
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>{solvedCount}/{schedule.questions.length}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Problems Solved</div>
          </div>
        </div>

        <div className="grid-2">
          {/* Schedule Timeline */}
          <div className="card animate-fadeIn">
            <div className="section-title">
              <Clock size={18} />
              Daily Schedule
            </div>
            <div className="timeline">
              {schedule.blocks.map((block) => {
                const active = isBlockActive(block)
                const endMinutes = block.startHour * 60 + block.startMinute + block.durationMinutes
                const endHour = Math.floor(endMinutes / 60) % 24
                const endMin = endMinutes % 60
                return (
                  <div key={block.id} className="timeline-item">
                    <div className={`timeline-dot ${block.type} ${active ? 'active' : ''}`}
                      style={{ background: blockColors[block.type] }}
                    />
                    <div className={`timeline-card ${active ? 'active' : ''}`}>
                      <div className="timeline-time">
                        {formatTime(block.startHour, block.startMinute)} — {formatTime(endHour, endMin)}
                        <span style={{ marginLeft: '8px', color: 'var(--text-tertiary)' }}>
                          ({Math.floor(block.durationMinutes / 60)}h {block.durationMinutes % 60}m)
                        </span>
                      </div>
                      <div className="timeline-title">{block.name}</div>
                      {block.topic && <div className="timeline-topic">{block.topic}</div>}
                      {block.description && <div className="timeline-desc">{block.description}</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* DSA Questions */}
          <div className="card animate-fadeIn">
            <div className="section-title">
              <Code2 size={18} />
              DSA Questions ({schedule.questions.length})
            </div>
            <div className="question-list">
              {schedule.questions.map((q, i) => {
                const attempt = attempts.find(a => a.problem_title === q.title)
                const isSolved = attempt?.status === 'solved'
                return (
                  <div
                    key={q.id}
                    className={`question-item ${isSolved ? 'solved' : ''}`}
                    onClick={() => navigate(`/day/${day}/editor/${q.id}`)}
                  >
                    <div className="question-number">{i + 1}</div>
                    <div className="question-info">
                      <div className="question-title">{q.title}</div>
                      <div className="question-meta">
                        <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                        <span>{q.topic}</span>
                        {attempt && (
                          <span style={{ color: 'var(--text-tertiary)' }}>
                            {formatDuration(attempt.time_spent_seconds)}
                          </span>
                        )}
                      </div>
                    </div>
                    {isSolved ? (
                      <CheckCircle size={18} color="var(--success)" />
                    ) : attempt ? (
                      <div className="question-status status-attempted">In Progress</div>
                    ) : (
                      <div className="question-status status-unsolved">Solve</div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Fundamentals Section */}
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
              <div className="section-title">
                <BookOpen size={18} />
                Fundamentals
              </div>
              <div className="card" style={{ background: 'var(--bg-tertiary)' }}>
                <div className="font-600" style={{ marginBottom: '4px' }}>{schedule.fundamentalsTopic}</div>
                <div className="text-sm text-tertiary">
                  Block 3 — 1.5 hours. Deep study of today's fundamentals rotation subject.
                </div>
              </div>
            </div>

            {/* Revision Section */}
            {schedule.revisionDays.length > 0 && (
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                <div className="section-title">
                  <RotateCcw size={18} />
                  Spaced Revision
                </div>
                {schedule.revisionDays.map(rd => {
                  const revSchedule = getDaySchedule(rd)
                  return (
                    <div key={rd} className="card" style={{ background: 'var(--bg-tertiary)', marginBottom: '8px' }}>
                      <div className="font-600">Day {rd}: {revSchedule.dsaTopic}</div>
                      <div className="text-sm text-tertiary">Revise key concepts and problems from this day</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Day Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/day/${Math.max(1, day - 1)}`)}
            disabled={day <= 1}
            style={{ opacity: day <= 1 ? 0.4 : 1 }}
          >
            <ArrowLeft size={14} />
            Previous Day
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/day/${Math.min(55, day + 1)}`)}
            disabled={day >= 55}
            style={{ opacity: day >= 55 ? 0.4 : 1 }}
          >
            Next Day
            <ArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} />
          </button>
        </div>
      </div>
    </>
  )
}

const PHASE_COLOR: Record<number, string> = {
  1: '#3b82f6',
  2: '#10b981',
  3: '#f59e0b',
  4: '#ef4444',
  5: '#a855f7',
}
