import { useState } from "react"
import { Link } from "react-router-dom"
import { Button, Card, Input, InputField } from "components"
import apiClient from "services/apiClient"
import HERO_BG from "assets/HERO_BG.png"

import "./Recover.css"

export default function Recover() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(null)

  const handleOnSubmit = async () => {
    setIsProcessing(true)
    setError(null)

    if (!email) {
      setError("Email required")
      setIsProcessing(false)
      return
    }

    const { data, error } = await apiClient.recoverAccount(email)
    if (error) setError(error)
    if (data?.message) {
      setMessage(data.message)
    }

    setIsProcessing(false)
  }

  return (
    <div className="Recover">
      <div className="splash-image" style={{ backgroundImage: `url(${HERO_BG})`, backgroundSize: `cover` }}>
        <div className="container">
          <Card className="recover-card">
            <h2>Recover Account</h2>

            {error && <span className="error">{error}</span>}
            <br />

            <div className="form">
              {message ? (
                <div className="message">
                  <p>{message}</p>
                </div>
              ) : (
                <>
                  <p>Enter the email address associated with your account</p>

                  <br />

                  <InputField name="email" label="Email">
                    <Input
                      type="email"
                      name="email"
                      placeholder="user@gmail.com"
                      value={email}
                      handleOnChange={(event) => setEmail(event.target.value)}
                    />
                  </InputField>

                  <p className="to-login">
                    Need an account? Register <Link to="/register">here.</Link>
                  </p>

                  <Button disabled={isProcessing} isLoading={isProcessing} onClick={handleOnSubmit}>
                    Recover Account
                  </Button>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
