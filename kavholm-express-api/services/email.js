const nodemailer = require("nodemailer")
const nodemailerSendgrid = require("nodemailer-sendgrid")

class EmailService {
  constructor(config) {
    const { isActive, apiKey, clientUrl, emailFromAddress, applicationName } = config

    const transport = nodemailer.createTransport(nodemailerSendgrid({ apiKey }))

    this.transport = transport

    this.isActive = isActive
    this.clientUrl = clientUrl
    this.emailFromAddress = emailFromAddress
    this.applicationName = applicationName
  }

  async sendEmail(email) {
    if (!this.isActive) {
      if (!email.to) return { status: 400, email, error: [{ field: "to", message: "Missing to field." }] }

      console.log(`Sending fake email to: ${email.to} from: ${email.from}`)
      return { status: 202, email, error: null }
    }

    // handle sending actual email
    try {
      const res = await this.transport.sendMail(email)
      const status = res?.[0]?.statusCode
      if (status === 202) return { status, email, error: null }

      return { status, email, error: res?.[0]?.body }
    } catch (err) {
      console.error("Errors with email occurred, failed to deliver message.")

      const errors = err?.response?.body?.errors

      return { status: 400, email, error: errors || [err] }
    }
  }

  constructPasswordResetUrl(token) {
    return `${this.clientUrl}/password-reset?token=${token}`
  }

  async sendPasswordResetConfirmationEmail(user) {
    const email = {
      to: user.email,
      from: this.emailFromAddress,
      subject: `Your ${this.applicationName} password has been reset successfully.`,
      html: `
        <html>
          <body>
            <h1>Password Reset Notification</h1>
            <br />
            <p>This is a confirmation of a successful password reset for your account.</p>
            <br />
            <p>If you did not change your password, please contact support immediately.</p>
            <br />
          </body>
        </html>
      `,
    }

    return await this.sendEmail(email)
  }

  async sendPasswordResetEmail(user, token) {
    // send password reset email
    const resetPasswordUrl = this.constructPasswordResetUrl(token)

    const email = {
      to: user.email,
      from: this.emailFromAddress,
      subject: "Reset your password for " + this.applicationName,
      html: `
        <html>
          <body>
            <h1>Password Reset Notification</h1>
            <br />
            <p>You are receiving this email because you made a request to reset the password for your account.</p>
            <br />
            <p>Click on the link below to finish the password reset process</p>
            <a href="${resetPasswordUrl}">${resetPasswordUrl}</a>
            <br />
            <p>If you did not make this request, contact support immediately.</p>
            <br />
          </body>
        </html>
      `,
    }

    return await this.sendEmail(email)
  }
}

module.exports = EmailService
