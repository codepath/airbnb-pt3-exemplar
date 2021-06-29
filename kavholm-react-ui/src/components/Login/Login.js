import { Link } from "react-router-dom"
import { useLoginForm } from "hooks/useLoginForm"
import { Button, Card, Input, InputField } from "components"
import HERO_BG from "assets/HERO_BG.png"
import "./Login.css"

export default function Login({ message }) {
  const { isProcessing, errors, authError, form, handleOnChange, handleOnSubmit } = useLoginForm()

  return (
    <div className="Login">
      <div className="splash-image" style={{ backgroundImage: `url(${HERO_BG})`, backgroundSize: `cover` }}>
        <div className="container">
          <Card className="login-card">
            <h2>Login</h2>

            {(authError || message) && <span className="error">{authError || message}</span>}
            <br />

            <div className="form">
              <InputField name="email" label="Email" error={errors.email}>
                <Input
                  type="email"
                  name="email"
                  placeholder="user@gmail.com"
                  value={form.email}
                  handleOnChange={handleOnChange}
                />
              </InputField>

              <InputField name="password" label="Password" error={errors.password}>
                <Input
                  type="password"
                  name="password"
                  placeholder="password"
                  value={form.password}
                  handleOnChange={handleOnChange}
                />
              </InputField>

              <p className="to-register">
                Forgot your password? Recover your account <Link to="/recover">here.</Link>
              </p>

              <Button disabled={isProcessing} isLoading={isProcessing} onClick={handleOnSubmit}>
                Login
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
