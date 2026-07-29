import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import DaySchedule from './pages/DaySchedule'
import CodeEditor from './pages/CodeEditor'
import FocusTracker from './pages/FocusTracker'
import WeakTopics from './pages/WeakTopics'
import Analytics from './pages/Analytics'
import Overview from './pages/Overview'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/day/:dayNumber" element={<DaySchedule />} />
        <Route path="/day/:dayNumber/editor/:questionId" element={<CodeEditor />} />
        <Route path="/focus" element={<FocusTracker />} />
        <Route path="/weak-topics" element={<WeakTopics />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
