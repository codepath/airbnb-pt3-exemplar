import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "contexts/auth"

export const useLoginForm = () => {
  const { user, handlers, error: authError } = useAuthContext()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    // if user is already logged in,
    // redirect them to the home page
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

    setForm((f) => ({ ...f, [event.target.name]: event.target.value }))
  }

  const handleOnSubmit = async () => {
    setIsProcessing(true)

    await handlers.loginUser(form)

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
