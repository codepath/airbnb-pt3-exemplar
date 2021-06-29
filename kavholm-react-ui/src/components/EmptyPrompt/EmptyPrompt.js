import { IconSearch } from "components"
import "./EmptyPrompt.css"

export default function EmptyPrompt({ children }) {
  return (
    <div className="EmptyPrompt">
      <div className="grey-wrapper">
        <IconSearch />
      </div>
      <div className="message">
        <>{children}</>
      </div>
    </div>
  )
}
