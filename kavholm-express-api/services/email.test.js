const nodemailer = require("nodemailer")
const EmailService = require("./email")

const {
  SENDGRID_API_KEY,
  EMAIL_SERVICE_ACTIVE,
  CLIENT_URL,
  EMAIL_FROM_ADDRESS,
  APPLICATION_NAME,
} = require("../config")

const mockSuccessResponse = { statusCode: 202, statusMessage: "success" }
const mockFailureResponse = { statusCode: 400, body: [{ field: "to", message: "Missing to field" }] }
const mockSendEmail = jest.fn().mockImplementation((email) => {
  if (!email?.hasOwnProperty("to")) return [mockFailureResponse]
  return [mockSuccessResponse]
})

jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockImplementation(() => ({ sendMail: mockSendEmail })),
}))

const emailService = new EmailService({
  isActive: EMAIL_SERVICE_ACTIVE,
  apiKey: SENDGRID_API_KEY,
  clientUrl: CLIENT_URL,
  emailFromAddress: EMAIL_FROM_ADDRESS,
  applicationName: APPLICATION_NAME,
})

describe("Test EmailService", () => {
  test("Stores api key and transport on instance of EmailService class", () => {
    expect(emailService).toHaveProperty("isActive")
    expect(emailService).toHaveProperty("transport")
    expect(nodemailer.createTransport).toBeCalledTimes(1)
  })

  test("Is inactive when testing", () => {
    expect(emailService.isActive).toBeFalsy()
    expect(emailService.transport).toBeTruthy()
  })

  describe("Test sendEmail", () => {
    test("Returns 202 status code when all goes well", async () => {
      const emailService = new EmailService({
        isActive: true,
        apiKey: SENDGRID_API_KEY,
        clientUrl: CLIENT_URL,
        emailFromAddress: EMAIL_FROM_ADDRESS,
        applicationName: APPLICATION_NAME,
      })

      const email = {
        to: `me@you.them`,
        from: EMAIL_FROM_ADDRESS,
        subject: `test`,
        html: `<h1>test</h1>`,
      }
      const res = await emailService.sendEmail(email)
      expect(res).toEqual({ status: 202, email, error: null })
      expect(mockSendEmail).toHaveBeenCalledWith(email)
    })

    test("Returns 400 status code when something goes wrong", async () => {
      const emailService = new EmailService({
        isActive: true,
        apiKey: SENDGRID_API_KEY,
        clientUrl: CLIENT_URL,
        emailFromAddress: EMAIL_FROM_ADDRESS,
        applicationName: APPLICATION_NAME,
      })

      const email = {}
      const res = await emailService.sendEmail(email)
      expect(res).toEqual({ status: 400, email, error: mockFailureResponse.body })
      expect(mockSendEmail).toHaveBeenCalledWith(email)
    })
  })

  describe("Test sending password reset email", () => {
    test("Constructs the correct password reset url", () => {
      const token = "abc123"
      const url = emailService.constructPasswordResetUrl(token)
      expect(url).toEqual(`http://localhost:3000/password-reset?token=${token}`)
    })

    test("Sends email to provided user", async () => {
      const emailService = new EmailService({
        isActive: true,
        apiKey: SENDGRID_API_KEY,
        clientUrl: CLIENT_URL,
        emailFromAddress: EMAIL_FROM_ADDRESS,
        applicationName: APPLICATION_NAME,
      })

      const user = { email: "lebron@james.io" }
      const token = "abc123"
      const res = await emailService.sendPasswordResetEmail(user, token)
      expect(res).toEqual({
        status: 202,
        email: {
          to: user.email,
          from: EMAIL_FROM_ADDRESS,
          subject: "Reset your password for Kavholm Homes",
          html: expect.any(String),
        },
        error: null,
      })
      expect(res.email.html.indexOf(`http://localhost:3000/password-reset?token=${token}`) !== -1).toBeTruthy()
    })
  })
})
