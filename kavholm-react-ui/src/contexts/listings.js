import { createContext, useContext, useState } from "react"
import apiClient from "services/apiClient"

const ListingsContext = createContext(null)

export const ListingsContextProvider = ({ children }) => {
  const [listings, setListings] = useState([])
  const [error, setError] = useState(null)

  const handlers = {
    fetchListings: async () => {
      const { data, error } = await apiClient.fetchListings()
      if (error) setError(error)
      if (data?.listings) {
        setListings(data.listings)
      }
    },
    clear: () => {
      setListings([])
      setError(null)
    },
  }

  const value = { listings, handlers, error }

  return (
    <ListingsContext.Provider value={value}>
      <>{children}</>
    </ListingsContext.Provider>
  )
}

export const useListingsContext = () => useContext(ListingsContext)

export const selectListingsById = (listingIds, listings) => listings.filter((l) => listingIds.includes(l.id))
export const selectListingsUserHasBookedTripsFor = (bookings, listings) => {
  return selectListingsById(
    bookings.filter((b) => Boolean(b)).map((b) => b.listingId),
    listings
  )
}
export const selectListingsUserIsOwnerOf = (user, listings) => listings.filter((l) => l.userId === user.id)
