import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import WeeklyReview from './WeeklyReview.jsx'
import { isWeeklyReviewPath } from './weeklyReviewModel.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isWeeklyReviewPath(window.location.pathname) ? <WeeklyReview /> : <App />}
  </StrictMode>,
)
