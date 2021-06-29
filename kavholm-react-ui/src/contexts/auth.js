import { createContext, useContext, useState } from "react"
import apiClient from "services/apiClient"

const AuthContext = createContext(null)

export const AuthContextProvider = ({ children }) => {
  const [initialized, setInitialized] = useState(false)
  const [user, setUser] = useState({})
  const [error, setError] = useState(null)

  const handlers = {
    loginUser: async (credentials) => {
      const { data, error } = await apiClient.loginUser(credentials)
      if (data) {
        setUser(data.user)
        apiClient.setToken(data.token)
        localStorage.setItem("kavholm_token", data.token)
      }
      if (error) setError(error)
    },
    signupUser: async (credentials) => {
      const { data, error } = await apiClient.signupUser(credentials)
      if (data) {
        setUser(data.user)
        apiClient.setToken(data.token)
        localStorage.setItem("kavholm_token", data.token)
      }
      if (error) setError(error)
    },
    fetchUserFromToken: async () => {
      const { data } = await apiClient.fetchUserFromToken()
      if (data) {
        setUser(data.user)
      }
      setInitialized(true)
    },
    logoutUser: async () => {
      await apiClient.logoutUser()
      setUser({})
      setInitialized(true)
      setError(null)
    },
  }

  const authProviderValue = { user, handlers, error, setUser, initialized, setInitialized }

  return (
    <AuthContext.Provider value={authProviderValue}>
      <>{children}</>
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)

export const selectUserIsAuthenticated = (user, initialized) => Boolean(initialized && user?.username)
