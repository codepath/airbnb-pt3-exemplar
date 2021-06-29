import { useState } from "react"
import { useNavigate } from "react-router-dom"
import apiClient from "services/apiClient"

export const useListingsNewForm = () => {
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    title: "Breezy cabana in Baja California",
    description: "A relaxing place to kick back and enjoy yourself",
    price: 10000,
    location: "United States",
    imageUrl: "",
    imageUrl2: "",
    imageUrl3: "",
  })

  const handleOnChange = (event) => {
    setForm((f) => ({ ...f, [event.target.name]: event.target.value }))
  }

  const handleOnSubmit = async () => {
    setIsProcessing(true)

    const newListing = {
      title: form.title,
      description: form.description,
      price: form.price,
      location: form.location,
      imageUrl: form.imageUrl,
      imageUrl2: form.imageUrl2,
      imageUrl3: form.imageUrl3,
    }

    const { data, error } = await apiClient.createNewListing(newListing)
    if (data?.listing) {
      setForm({
        title: "",
        description: "",
        price: 0,
        location: "",
        imageUrl: "",
        imageUrl2: "",
        imageUrl3: "",
      })

      navigate(`/listings/${data.listing?.id}/`)
    }
    if (error) {
      console.log(error)
      setErrors((e) => ({ ...e, form: error }))
    }

    setIsProcessing(false)
  }

  return {
    form,
    errors,
    isProcessing,
    handleOnChange,
    handleOnSubmit,
  }
}
