import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import WeeklyReview from './WeeklyReview.jsx'
import ScheduleReview from './ScheduleReview.jsx'
import ReviewHub from './ReviewHub.jsx'
import GuidelineReview from './GuidelineReview.jsx'
import LookSandbox from './LookSandbox.jsx'
import { isWeeklyReviewPath } from './weeklyReviewModel.js'
import { isReviewHomePath, isScheduleReviewPath } from './scheduleReviewModel.js'
import { isGuidelineReviewPath } from './guidelineReviewModel.js'
import { publicTabForPath } from './publicRoutes.js'

const route = window.location.pathname === '/sandbox/look'
  ? <LookSandbox />
  : isReviewHomePath(window.location.pathname)
  ? <ReviewHub />
  : isWeeklyReviewPath(window.location.pathname)
  ? <WeeklyReview />
  : isScheduleReviewPath(window.location.pathname)
    ? <ScheduleReview />
    : isGuidelineReviewPath(window.location.pathname)
      ? <GuidelineReview />
      : <App initialActive={publicTabForPath(window.location.pathname)} />

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {route}
  </StrictMode>,
)
