import "./Input.css"

export default function Input({
  type,
  name,
  placeholder,
  value,
  handleOnChange = (e) => console.warn(`No handle change for ${e.target.value}`),
  onBlur = () => {},
  onFocus = () => {},
  required = false,
  className = "",
}) {
  return (
    <>
      <input
        type={type}
        name={name}
        value={value}
        onBlur={onBlur}
        onFocus={onFocus}
        required={required}
        onChange={handleOnChange}
        placeholder={placeholder}
        className={className}
      />
    </>
  )
}
