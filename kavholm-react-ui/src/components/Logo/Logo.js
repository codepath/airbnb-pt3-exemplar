import "./Logo.css"

export default function Logo({ dark }) {
  return (
    <span className="Logo">
      <h2 className={`kavholm ${dark ? "dark" : ""}`}>KAVHOLM</h2>
      <h2 className={`homes ${dark ? "dark" : ""}`}>HOMES</h2>
    </span>
  )
}
