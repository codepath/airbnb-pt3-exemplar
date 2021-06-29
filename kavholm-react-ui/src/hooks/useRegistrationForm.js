import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "contexts/auth"

export const useRegistrationForm = () => {
  const { user, handlers, error: authError } = useAuthContext()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    passwordConfirm: "",
  })

  useEffect(() => {
    // if user is already logged in,
    // redirect them to the dashboard page
    if (user?.email) {
      navigate("/dashboard")
    }
  }, [user, navigate])

  const handleOnChange = (event) => {
    if (event.target.name === "email") {
      if (event.target.value.indexOf("@") === -1) {
        setErrors((e) => ({ ...e, email: "Please enter a valid email." }))
      } else {
        setErrors((e) => ({ ...e, email: null }))
      }
    }

    if (event.target.name === "passwordConfirm") {
      if (event.target.value !== form.password) {
        setErrors((e) => ({ ...e, passwordConfirm: "Passwords do not match." }))
      } else {
        setErrors((e) => ({ ...e, passwordConfirm: null }))
      }
    }

    setForm((f) => ({ ...f, [event.target.name]: event.target.value }))
  }

  const handleOnSubmit = async () => {
    setIsProcessing(true)
    setErrors((e) => ({ ...e, form: null }))

    await handlers.signupUser(form)

    setIsProcessing(false)
  }

  return {
    form,
    errors,
    authError,
    isProcessing,
    handleOnChange,
    handleOnSubmit,
  }
}
