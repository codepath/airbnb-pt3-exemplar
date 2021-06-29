import "./InputField.css"

export default function InputField({ children, label, name, error, required, className = "" }) {
  return (
    <div className={`InputField ${className}`}>
      <label htmlFor={name}>
        {label}
        {required ? <span className="required">*</span> : null}
      </label>
      <>{children}</>
      {error && <span className="error">{error}</span>}
    </div>
  )
}
