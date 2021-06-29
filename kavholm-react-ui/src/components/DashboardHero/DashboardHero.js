import { useAuthContext } from "contexts/auth"
import PROFILE_BG_STRIP from "assets/PROFILE_BG_STRIP.png"
import "./DashboardHero.css"

const defaultAvatar =
  "https://images.unsplash.com/photo-1607094838522-f16402ae75c4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1366&q=80"

export default function DashboardHero() {
  const { user } = useAuthContext()

  return (
    <div className="DashboardHero">
      <div
        className="banner"
        style={{
          background: `url(${PROFILE_BG_STRIP}) no-repeat`,
          backgroundSize: `cover`,
        }}
      >
        <span>{` `}</span>
      </div>
      <div className="profile">
        <img src={user.avatar ?? defaultAvatar} alt="profile" />
        <h2 className="full-name">
          {user.firstName}
          {` `}
          {user.lastName}
        </h2>
        <p className="username">@{user.username}</p>
      </div>
    </div>
  )
}
