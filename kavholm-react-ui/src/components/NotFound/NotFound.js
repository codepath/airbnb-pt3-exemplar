import "./NotFound.css"

export default function NotFound({ message = "That page does not exist" }) {
  return (
    <div className="NotFound">
      <div className="cta">
        <h1>404</h1>
        <p>{message}</p>
      </div>
    </div>
  )
}
