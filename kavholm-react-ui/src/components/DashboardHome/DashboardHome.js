import { Link } from "react-router-dom"
import { EmptyPrompt, ListingsGrid } from "components"
import { useBookingsContext } from "contexts/bookings"
import { useListingsContext, selectListingsUserHasBookedTripsFor } from "contexts/listings"
import "./DashboardHome.css"

export default function DashboardHome() {
  const { bookings } = useBookingsContext()
  const { listings } = useListingsContext()

  const userBookedListings = selectListingsUserHasBookedTripsFor(bookings, listings)

  return (
    <div className="DashboardHome">
      <div className="tabs">
        <h4 className="active">
          <Link to="/dashboard">Your Trips</Link>
        </h4>
        <h4>
          <Link to="/dashboard/host">Your Listings</Link>
        </h4>
      </div>
      <div className="trips">
        {userBookedListings?.length ? (
          <ListingsGrid listings={userBookedListings} />
        ) : (
          <EmptyPrompt>
            <p className="empty">You haven't booked any trips yet.</p>
          </EmptyPrompt>
        )}
      </div>
    </div>
  )
}
