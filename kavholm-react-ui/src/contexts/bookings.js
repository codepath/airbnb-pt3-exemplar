import { createContext, useContext, useState } from "react"
import apiClient from "services/apiClient"

const BookingsContext = createContext(null)

export const BookingsContextProvider = ({ children }) => {
  const [bookings, setBookings] = useState([])
  const [bookingsForUserOwnedListings, setBookingsForUserOwnedListings] = useState([])
  const [error, setError] = useState(null)

  const handlers = {
    fetchBookingsForUser: async () => {
      const { data, error } = await apiClient.fetchBookingsForUser()
      if (error) setError(error)
      if (data?.bookings) {
        setBookings(data.bookings)
      }
    },
    fetchAllBookingsForUserOwnedListings: async () => {
      const { data, error } = await apiClient.fetchAllBookingsForUserOwnedListings()
      if (error) {
        console.log(error)
        setError(error)
      }
      if (data?.bookings) {
        setBookingsForUserOwnedListings(data.bookings)
      }
    },
    clear: () => {
      setBookings([])
      setBookingsForUserOwnedListings([])
      setError(null)
    },
  }

  const bookingProviderValue = {
    bookings,
    bookingsForUserOwnedListings,
    setBookingsForUserOwnedListings,
    setBookings,
    handlers,
    error,
  }

  return (
    <BookingsContext.Provider value={bookingProviderValue}>
      <>{children}</>
    </BookingsContext.Provider>
  )
}

export const useBookingsContext = () => useContext(BookingsContext)
