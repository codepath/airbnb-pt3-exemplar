import { useLocation, Link } from "react-router-dom"
import { usePasswordResetForm } from "hooks/usePasswordResetForm"
import { Button, Card, Input, InputField } from "components"
import HERO_BG from "assets/HERO_BG.png"

import "./PasswordReset.css"

export default function PasswordReset() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const token = searchParams.get("token")
  const { form, errors, message, isProcessing, handleOnSubmit, handleOnChange } = usePasswordResetForm(token)

  return (
    <div className="PasswordReset">
      <div className="splash-image" style={{ backgroundImage: `url(${HERO_BG})`, backgroundSize: `cover` }}>
        <div className="container">
          <Card className="password-reset-card">
            <h2>Reset Password</h2>

            {errors.form && <span className="error">{errors.form}</span>}
            <br />

            <div className="form">
              {message ? (
                <>
                  <span className="message">{message}</span>
                  <br />
                  <p>
                    Login <Link to="/login">here</Link>
                  </p>
                </>
              ) : (
                <>
                  <InputField name="password" label="Password" error={errors.password}>
                    <Input
                      type="password"
                      name="password"
                      placeholder="password"
                      value={form.password}
                      handleOnChange={handleOnChange}
                    />
                  </InputField>

                  <InputField name="passwordConfirm" label="Confirm Password" error={errors.passwordConfirm}>
                    <Input
                      type="password"
                      name="passwordConfirm"
                      placeholder="confirm password"
                      value={form.passwordConfirm}
                      handleOnChange={handleOnChange}
                    />
                  </InputField>

                  <Button disabled={isProcessing} isLoading={isProcessing} onClick={handleOnSubmit}>
                    Save Password
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
