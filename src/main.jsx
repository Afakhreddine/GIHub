import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import WeeklyReview from './WeeklyReview.jsx'
import ScheduleReview from './ScheduleReview.jsx'
import ReviewHub from './ReviewHub.jsx'
import { isWeeklyReviewPath } from './weeklyReviewModel.js'
import { isReviewHomePath, isScheduleReviewPath } from './scheduleReviewModel.js'

const route = isReviewHomePath(window.location.pathname)
  ? <ReviewHub />
  : isWeeklyReviewPath(window.location.pathname)
  ? <WeeklyReview />
  : isScheduleReviewPath(window.location.pathname)
    ? <ScheduleReview />
    : <App />

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {route}
  </StrictMode>,
)
