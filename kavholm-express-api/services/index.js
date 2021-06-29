const {
  SENDGRID_API_KEY,
  EMAIL_SERVICE_ACTIVE,
  CLIENT_URL,
  EMAIL_FROM_ADDRESS,
  APPLICATION_NAME,
} = require("../config")
const EmailService = require("./email")

const emailService = new EmailService({
  isActive: EMAIL_SERVICE_ACTIVE,
  apiKey: SENDGRID_API_KEY,
  clientUrl: CLIENT_URL,
  emailFromAddress: EMAIL_FROM_ADDRESS,
  applicationName: APPLICATION_NAME,
})

module.exports = { emailService }
