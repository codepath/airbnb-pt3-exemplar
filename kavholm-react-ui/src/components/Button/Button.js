import "./Button.css"

export default function Button({
  children,
  className = "",
  buttonType = "primary",
  isLoading = false,
  isDisabled = false,
  onClick = () => {},
}) {
  return (
    <button className={`Button ${buttonType} ${className}`} onClick={onClick} disabled={isDisabled}>
      {isLoading ? <span>Loading...</span> : children}
    </button>
  )
}
