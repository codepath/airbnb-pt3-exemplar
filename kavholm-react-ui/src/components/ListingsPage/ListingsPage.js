import { Routes, Route } from "react-router-dom"
import { ListingsDetail, ListingsHome, ListingsNew, NotFound, ProtectedRoute } from "components"
import "./ListingsPage.css"

export default function ListingsPage() {
  return (
    <Routes>
      <Route path="/" element={<ListingsHome />} />
      <Route path="/new" element={<ProtectedRoute element={<ListingsNew />} />} />
      <Route path="/:listingId" element={<ProtectedRoute element={<ListingsDetail />} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
