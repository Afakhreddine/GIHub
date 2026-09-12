import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import WeeklyReview from './WeeklyReview.jsx'
import ScheduleReview from './ScheduleReview.jsx'
import { isWeeklyReviewPath } from './weeklyReviewModel.js'
import { isScheduleReviewPath } from './scheduleReviewModel.js'

const route = isWeeklyReviewPath(window.location.pathname)
  ? <WeeklyReview />
  : isScheduleReviewPath(window.location.pathname)
    ? <ScheduleReview />
    : <App />

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {route}
  </StrictMode>,
)
