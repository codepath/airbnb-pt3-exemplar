import { Link } from "react-router-dom"
import { useAuthContext } from "contexts/auth"
import { Button, Card } from "components"
import "./ProfilePage.css"

const defaultAvatar =
  "https://images.unsplash.com/photo-1607094838522-f16402ae75c4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1366&q=80"

export default function ProfilePage() {
  const { user } = useAuthContext()
  const avatarUrl = user?.avatar ?? defaultAvatar

  return (
    <div className="Profile">
      <div className="banner">
        <span>{` `}</span>
      </div>
      <div className="avatar">
        <img src={avatarUrl} alt="profile" />
        <h2 className="full-name">
          {user.firstName}
          {` `}
          {user.lastName}
        </h2>
      </div>
      <div className="content">
        <Card className="profile-details">
          <h4>Profile Details</h4>
          <span className="info">
            <span className="label">First Name</span>
            <span>{user.firstName}</span>
          </span>
          <span className="info">
            <span className="label">Last Name</span>
            <span>{user.lastName}</span>
          </span>
          <span className="info">
            <span className="label">Username</span>
            <span>@{user.username}</span>
          </span>
          <span className="info">
            <span className="label">Email</span>
            <span>{user.email}</span>
          </span>
        </Card>

        <Card className="actions">
          <h4>Manage</h4>

          <div className="buttons">
            <Link to="/dashboard">
              <Button buttonType="primary">Your Trips</Button>
            </Link>

            <Link to="/dashboard/host">
              <Button buttonType="primary">Your Listings</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
