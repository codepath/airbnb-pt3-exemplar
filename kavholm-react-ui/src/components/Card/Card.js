import "./Card.css"

export default function Card({ children, className }) {
  return (
    <div className={`Card ${className}`}>
      <>{children}</>
    </div>
  )
}
