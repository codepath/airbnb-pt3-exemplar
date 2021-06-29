import { useEffect } from "react"
import { Routes as AppRoutes } from "components"
import { AuthContextProvider, useAuthContext } from "contexts/auth"
import { ListingsContextProvider, useListingsContext } from "contexts/listings"
import { BookingsContextProvider, useBookingsContext } from "contexts/bookings"
import apiClient from "services/apiClient"

import "./App.css"

const AppContainer = () => {
  return (
    <AuthContextProvider>
      <ListingsContextProvider>
        <BookingsContextProvider>
          <App />
        </BookingsContextProvider>
      </ListingsContextProvider>
    </AuthContextProvider>
  )
}

const App = () => {
  const { handlers: authHandlers, setInitialized, isAuthenticated } = useAuthContext()
  const { handlers: listingsHandlers } = useListingsContext()
  const { handlers: bookingsHandlers } = useBookingsContext()

  useEffect(() => {
    const initApp = async () => {
      console.log("Initializing app")
      const token = localStorage.getItem("kavholm_token")
      if (token) {
        apiClient.setToken(token)
        await authHandlers.fetchUserFromToken()
        await bookingsHandlers.fetchBookingsForUser()
        await bookingsHandlers.fetchAllBookingsForUserOwnedListings()
      }

      await listingsHandlers.fetchListings()

      setInitialized(true)
    }

    initApp()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setInitialized, isAuthenticated])

  return (
    <div className="App">
      <AppRoutes />
    </div>
  )
}

export default AppContainer
