import { Login } from "components"
import { useAuthContext, selectUserIsAuthenticated } from "contexts/auth"

export default function ProtectedRoute({ element }) {
  const { initialized, user } = useAuthContext()

  const isAuthenticated = selectUserIsAuthenticated(user, initialized)

  if (!initialized) {
    return null
  }

  if (initialized && !isAuthenticated) {
    return <Login message="You must be authenticated to view that page" />
  }

  return <>{element}</>
}
