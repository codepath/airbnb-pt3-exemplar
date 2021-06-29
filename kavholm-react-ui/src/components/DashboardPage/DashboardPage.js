import { Routes, Route } from "react-router-dom"
import { DashboardHome, DashboardHost, DashboardHero, NotFound } from "components"
import "./DashboardPage.css"

export default function DashboardPage() {
  return (
    <div className="Dashboard">
      <DashboardHero />

      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/host" element={<DashboardHost />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}
