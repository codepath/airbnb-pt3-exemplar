import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "components"
import profileAvatar from "assets/profile_avatar.svg"
import "./NavDropdown.css"

const NavDropdown = ({ user, logoutUser }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const avatarUrl = user?.avatar ?? profileAvatar

  const toggleDropdown = () => setDropdownOpen((open) => !open)

  return (
    <ul className="NavDropdown">
      <li className="nav-item">
        <Button buttonType="ghost" className="dropdown-toggle" onClick={toggleDropdown}>
          <img src={avatarUrl} height="42" className={`avatar`} alt="avatar" />
        </Button>
        <div className={`${dropdownOpen ? "open" : "closed"} dropdown-menu`}>
          <Link to="/dashboard">
            <span className="dropdown-item">Dashboard</span>
          </Link>
          <Link to="/profile">
            <span className="dropdown-item">Profile</span>
          </Link>
          <Button className="dropdown-item" buttonType="ghost" onClick={logoutUser}>
            <span>Log out</span>
          </Button>
        </div>
      </li>
    </ul>
  )
}

export default NavDropdown
