import { Link } from "react-router-dom"
import { useRegistrationForm } from "hooks/useRegistrationForm"
import { Button, Card, Input, InputField } from "components"
import HERO_BG from "assets/HERO_BG.png"
import "./Register.css"

export default function Register({ message }) {
  const { isProcessing, errors, authError, form, handleOnChange, handleOnSubmit } = useRegistrationForm()

  return (
    <div className="Register">
      <div className="splash-image" style={{ backgroundImage: `url(${HERO_BG})`, backgroundSize: `cover` }}>
        <div className="container">
          <Card className="register-card">
            <h2>Create An Account</h2>

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

              <InputField name="username" label="Username" error={errors.username}>
                <Input
                  type="text"
                  name="username"
                  placeholder="your_username"
                  value={form.username}
                  handleOnChange={handleOnChange}
                />
              </InputField>

              <div className="row gap-10">
                <InputField name="firstName" label="First Name" error={errors.firstName} className="flex-1">
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="Jane"
                    value={form.firstName}
                    handleOnChange={handleOnChange}
                  />
                </InputField>

                <InputField name="lastName" label="Last Name" error={errors.lastName} className="flex-1">
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={form.lastName}
                    handleOnChange={handleOnChange}
                  />
                </InputField>
              </div>

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

              <p className="to-login">
                Have an account? Login <Link to="/login">here.</Link>
              </p>

              <Button disabled={isProcessing} isLoading={isProcessing} onClick={handleOnSubmit}>
                Sign Up
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
