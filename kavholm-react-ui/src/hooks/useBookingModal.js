import { useState, useEffect } from "react"
import { useBookingsContext } from "contexts/bookings"
import moment from "moment"
import apiClient from "services/apiClient"

export const useBookingModal = (listingId) => {
  const { setBookings } = useBookingsContext()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date(moment().add(3, "days").valueOf()))
  const [guests, setGuests] = useState(1)
  const [booking, setBooking] = useState(null)

  const handleOnSubmitBooking = async () => {
    setIsProcessing(true)

    const { data, error } = await apiClient.bookListing({ listingId, newBooking: { startDate, endDate, guests } })
    if (error) setError(error)
    if (data?.booking) {
      setBooking(data.booking)
      setBookings((bookings) => [data.booking, ...bookings])
    }

    setIsProcessing(false)
  }

  useEffect(() => {
    setBooking(null)
  }, [listingId])

  return {
    error,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    guests,
    setGuests,
    isProcessing,
    handleOnSubmitBooking,
    setError,
    booking,
  }
}
