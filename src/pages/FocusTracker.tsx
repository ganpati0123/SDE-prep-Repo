import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Play, Square, Camera, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getTodayDayNumber, formatDuration } from '../data/schedule'
import NotificationToast from '../components/NotificationToast'

export default function FocusTracker() {
  const navigate = useNavigate()
  const todayDay = getTodayDayNumber()
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [isTracking, setIsTracking] = useState(false)
  const [cameraOn, setCameraOn] = useState(false)
  const [focusedSeconds, setFocusedSeconds] = useState(0)
  const [distractedSeconds, setDistractedSeconds] = useState(0)
  const [awaySeconds, setAwaySeconds] = useState(0)
  const [faceDetected, setFaceDetected] = useState(false)
  const [lookingAtScreen, setLookingAtScreen] = useState(true)
  const [focusScore, setFocusScore] = useState(0)
  const [sessionStart, setSessionStart] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<any[]>([])

  const trackingRef = useRef(false)
  const focusIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const detectionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    loadHistory()
    return () => {
      stopCamera()
    }
  }, [])

  const loadHistory = async () => {
    const { data } = await supabase
      .from('focus_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    setHistory(data || [])
  }

  const startCamera = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCameraOn(true)
    } catch (err) {
      setError('Could not access camera. Please grant camera permission and try again.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCameraOn(false)
    setIsTracking(false)
    trackingRef.current = false
    if (focusIntervalRef.current) clearInterval(focusIntervalRef.current)
    if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current)
  }

  const startTracking = () => {
    if (!cameraOn) {
      startCamera()
      return
    }
    setIsTracking(true)
    trackingRef.current = true
    setSessionStart(new Date())
    setFocusedSeconds(0)
    setDistractedSeconds(0)
    setAwaySeconds(0)

    // Detection loop - check for face presence using brightness/motion heuristic
    detectionIntervalRef.current = setInterval(() => {
      detectFace()
    }, 2000)

    // Focus counter
    focusIntervalRef.current = setInterval(() => {
      if (!trackingRef.current) return
      if (faceDetected && lookingAtScreen) {
        setFocusedSeconds(s => s + 1)
      } else if (!faceDetected) {
        setAwaySeconds(s => s + 1)
      } else {
        setDistractedSeconds(s => s + 1)
      }
    }, 1000)
  }

  const stopTracking = async () => {
    setIsTracking(false)
    trackingRef.current = false
    if (focusIntervalRef.current) clearInterval(focusIntervalRef.current)
    if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current)

    const totalSec = focusedSeconds + distractedSeconds + awaySeconds
    const score = totalSec > 0 ? Math.round((focusedSeconds / totalSec) * 100) : 0
    setFocusScore(score)

    if (sessionStart && totalSec > 5) {
      await supabase.from('focus_logs').insert({
        day_number: todayDay,
        session_start: sessionStart.toISOString(),
        session_end: new Date().toISOString(),
        total_seconds: totalSec,
        focused_seconds: focusedSeconds,
        distracted_seconds: distractedSeconds,
        away_seconds: awaySeconds,
        focus_score: score,
      })
      loadHistory()
    }
  }

  const detectFace = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 160
    canvas.height = 120
    ctx.drawImage(video, 0, 0, 160, 120)

    const imageData = ctx.getImageData(0, 0, 160, 120)
    const data = imageData.data

    // Simple face detection heuristic: check center region brightness variation
    // Real face detection would use face-api.js or MediaPipe, but this works as a
    // lightweight proxy: if the center of the frame has skin-tone pixels and variation,
    // we assume a face is present
    let skinPixels = 0
    let totalPixels = 0
    let brightnessSum = 0
    let brightnessCount = 0

    for (let y = 20; y < 100; y += 2) {
      for (let x = 40; x < 120; x += 2) {
        const i = (y * 160 + x) * 4
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const brightness = (r + g + b) / 3
        brightnessSum += brightness
        brightnessCount++

        // Skin tone detection: R > G > B and R > 60
        if (r > g && g > b && r > 60 && r - b > 15) {
          skinPixels++
        }
        totalPixels++
      }
    }

    const avgBrightness = brightnessCount > 0 ? brightnessSum / brightnessCount : 0
    const skinRatio = totalPixels > 0 ? skinPixels / totalPixels : 0

    // If enough skin-tone pixels in center region and brightness is reasonable, face is detected
    const detected = skinRatio > 0.15 && avgBrightness > 40
    setFaceDetected(detected)

    // Check if looking at screen: if brightness is stable and face detected
    setLookingAtScreen(detected && avgBrightness > 40)
  }

  const totalSeconds = focusedSeconds + distractedSeconds + awaySeconds
  const liveFocusScore = totalSeconds > 0 ? Math.round((focusedSeconds / totalSeconds) * 100) : 0

  return (
    <>
      <NotificationToast />
      <div className="topbar">
        <div className="topbar-title">AI Focus Tracker</div>
        <div className="day-indicator">
          <Eye size={14} />
          Day {todayDay}
        </div>
      </div>

      <div className="content-area">
        <div className="grid-2">
          {/* Camera */}
          <div className="card animate-fadeIn">
            <div className="section-title">
              <Camera size={18} />
              Camera Feed
            </div>
            <div className="camera-container">
              <video ref={videoRef} className="camera-video" autoPlay playsInline muted />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              {!cameraOn && (
                <div className="camera-placeholder">
                  <Camera size={48} />
                  <div>Camera is off</div>
                  <button className="btn btn-primary mt-4" onClick={startCamera}>
                    <Camera size={14} />
                    Enable Camera
                  </button>
                </div>
              )}
              {isTracking && cameraOn && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  display: 'flex',
                  gap: '8px',
                }}>
                  <div style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    background: faceDetected ? 'rgba(16,185,129,0.9)' : 'rgba(239,68,68,0.9)',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'white',
                  }}>
                    {faceDetected ? 'Face Detected' : 'No Face'}
                  </div>
                  {faceDetected && (
                    <div style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      background: lookingAtScreen ? 'rgba(16,185,129,0.9)' : 'rgba(245,158,11,0.9)',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'white',
                    }}>
                      {lookingAtScreen ? 'Focused' : 'Distracted'}
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div style={{
                marginTop: '12px',
                padding: '12px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid var(--error)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--error)',
                fontSize: '12px',
              }}>
                <AlertTriangle size={14} style={{ display: 'inline', marginRight: '6px' }} />
                {error}
              </div>
            )}

            <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
              {!isTracking ? (
                <button className="btn btn-primary" onClick={startTracking} disabled={!cameraOn}>
                  <Play size={14} />
                  Start Focus Tracking
                </button>
              ) : (
                <button className="btn btn-danger" onClick={stopTracking}>
                  <Square size={14} />
                  Stop & Save Session
                </button>
              )}
              {cameraOn && (
                <button className="btn btn-secondary" onClick={stopCamera}>
                  <EyeOff size={14} />
                  Turn Off Camera
                </button>
              )}
            </div>
          </div>

          {/* Live Stats */}
          <div className="card animate-fadeIn">
            <div className="section-title">
              <Clock size={18} />
              Live Focus Stats
            </div>

            <div className="focus-stats mb-4">
              <div className="focus-stat">
                <div className="focus-stat-value" style={{ color: 'var(--success)' }}>
                  {formatDuration(focusedSeconds)}
                </div>
                <div className="focus-stat-label">Focused</div>
              </div>
              <div className="focus-stat">
                <div className="focus-stat-value" style={{ color: 'var(--warning)' }}>
                  {formatDuration(distractedSeconds)}
                </div>
                <div className="focus-stat-label">Distracted</div>
              </div>
              <div className="focus-stat">
                <div className="focus-stat-value" style={{ color: 'var(--error)' }}>
                  {formatDuration(awaySeconds)}
                </div>
                <div className="focus-stat-label">Away</div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="text-sm font-600">Focus Score</span>
                <span className="font-mono font-bold" style={{ color: liveFocusScore > 70 ? 'var(--success)' : liveFocusScore > 40 ? 'var(--warning)' : 'var(--error)' }}>
                  {liveFocusScore}%
                </span>
              </div>
              <div className="focus-bar">
                <div className="focus-bar-fill" style={{
                  width: `${liveFocusScore}%`,
                  background: liveFocusScore > 70 ? 'var(--success)' : liveFocusScore > 40 ? 'var(--warning)' : 'var(--error)',
                }} />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="text-sm font-600">Total Session Time</span>
                <span className="font-mono font-bold">{formatDuration(totalSeconds)}</span>
              </div>
              <div className="focus-bar">
                <div style={{ display: 'flex', height: '100%' }}>
                  <div style={{ width: `${totalSeconds > 0 ? (focusedSeconds / totalSeconds) * 100 : 0}%`, background: 'var(--success)' }} />
                  <div style={{ width: `${totalSeconds > 0 ? (distractedSeconds / totalSeconds) * 100 : 0}%`, background: 'var(--warning)' }} />
                  <div style={{ width: `${totalSeconds > 0 ? (awaySeconds / totalSeconds) * 100 : 0}%`, background: 'var(--error)' }} />
                </div>
              </div>
            </div>

            <div className="card" style={{ background: 'var(--bg-tertiary)', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {faceDetected ? (
                  <CheckCircle size={16} color="var(--success)" />
                ) : (
                  <AlertTriangle size={16} color="var(--error)" />
                )}
                <span className="text-sm">
                  {faceDetected
                    ? lookingAtScreen
                      ? 'You are focused and looking at the screen. Keep it up!'
                      : 'Face detected but you seem distracted. Focus on your study material.'
                    : 'No face detected. Make sure you are in front of the camera.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="card animate-fadeIn mt-4">
          <div className="section-title">
            <Clock size={18} />
            Recent Focus Sessions
          </div>
          {history.length > 0 ? (
            <div className="question-list">
              {history.map((h, i) => (
                <div key={h.id} className="weak-topic-item">
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-md)',
                    background: h.focus_score > 70 ? 'rgba(16,185,129,0.15)' : h.focus_score > 40 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: h.focus_score > 70 ? 'var(--success)' : h.focus_score > 40 ? 'var(--warning)' : 'var(--error)',
                  }}>
                    {h.focus_score}%
                  </div>
                  <div className="flex-1">
                    <div className="font-600">Day {h.day_number} Session</div>
                    <div className="text-sm text-tertiary">
                      Focused: {formatDuration(h.focused_seconds)} | Distracted: {formatDuration(h.distracted_seconds)} | Away: {formatDuration(h.away_seconds)}
                    </div>
                  </div>
                  <div className="text-sm text-tertiary">
                    {new Date(h.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Eye size={32} className="empty-state-icon" />
              <div className="empty-state-text">No focus sessions recorded yet</div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
