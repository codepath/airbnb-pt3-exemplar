import { useState } from "react"
import apiClient from "services/apiClient"

export const usePasswordResetForm = (token) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState(null)
  const [form, setForm] = useState({
    password: "",
    passwordConfirm: "",
  })

  const handleOnChange = (event) => {
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

    if (form.passwordConfirm !== form.password) {
      setErrors((e) => ({ ...e, passwordConfirm: "Passwords do not match." }))
      setIsProcessing(false)
      return
    } else {
      setErrors((e) => ({ ...e, passwordConfirm: null }))
    }

    const { data, error } = await apiClient.resetPassword({ token, newPassword: form.password })
    if (error) setErrors((e) => ({ ...e, form: error }))
    if (data?.message) setMessage(data.message)

    setIsProcessing(false)
  }

  return {
    form,
    errors,
    message,
    isProcessing,
    handleOnSubmit,
    handleOnChange,
  }
}
