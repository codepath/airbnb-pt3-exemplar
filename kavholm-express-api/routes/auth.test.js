const request = require("supertest")
const app = require("../app")
const User = require("../models/user")
const tokens = require("../utils/tokens")

const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require("../tests/common")

beforeAll(commonBeforeAll)
beforeEach(commonBeforeEach)
afterEach(commonAfterEach)
afterAll(commonAfterAll)

/************************************** POST /auth/token */

describe("Auth Routes", () => {
  describe("POST /auth/token/", function () {
    test("User can login successfully with valid credentials", async () => {
      const res = await request(app).post("/auth/login/").send({
        email: "lebron@james.io",
        password: "password1",
      })
      expect(res.body).toEqual({
        token: expect.any(String),
        user: {
          id: expect.any(Number),
          username: "lebron",
          firstName: "LeBron",
          lastName: "James",
          email: "lebron@james.io",
          createdAt: expect.any(String),
          isAdmin: false,
        },
      })
    })

    test("Throws Unauthenticated error when user doesn't exist in db", async () => {
      const res = await request(app).post("/auth/login/").send({
        email: "somebody_else@users.io",
        password: "password",
      })
      expect(res.statusCode).toEqual(401)
    })

    test("Throws Unauthenticated error when user provides wrong password", async () => {
      const res = await request(app).post("/auth/login/").send({
        email: "lebron@james.io",
        password: "nope",
      })
      expect(res.statusCode).toEqual(401)
    })

    test("Throws Bad Request error when user doesn't provide password", async () => {
      const res = await request(app).post("/auth/login/").send({
        email: "lebron@james.io",
      })
      expect(res.statusCode).toEqual(400)
    })

    test("Throws Bad Request error when user doesn't provide email", async () => {
      const res = await request(app).post("/auth/login/").send({
        password: "password1",
      })
      expect(res.statusCode).toEqual(400)
    })
  })

  /************************************** POST /auth/register */
  describe("POST /auth/register/", () => {
    test("Allows user to register with valid credentials", async () => {
      const res = await request(app).post("/auth/register/").send({
        username: "new",
        firstName: "first",
        lastName: "last",
        password: "pw",
        email: "new@email.com",
      })
      expect(res.statusCode).toEqual(201)
      expect(res.body).toEqual({
        token: expect.any(String),
        user: {
          id: expect.any(Number),
          username: "new",
          firstName: "first",
          lastName: "last",
          email: "new@email.com",
          createdAt: expect.any(String),
          isAdmin: false,
        },
      })
    })

    test("Throws Bad Request error when user doesn't provide all fields", async () => {
      const res = await request(app).post("/auth/register/").send({
        username: "new",
      })
      expect(res.statusCode).toEqual(400)
    })
  })

  describe("POST /recover", () => {
    test("User can request password recovery and receive a success message", async () => {
      const res = await request(app).post(`/auth/recover`).send({ email: `lebron@james.io` })
      console.log(res.error)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual({
        message: "If your account exists in our system, you should receive an email shortly.",
      })
    })
  })

  describe("POST /reset-password", () => {
    test("User with valid token can reset password", async () => {
      const email = "lebron@james.io"
      const user = await User.fetchUserByEmail(email)
      const resetToken = tokens.generatePasswordResetToken()
      await User.savePasswordResetToken(email, resetToken)
      const res = await request(app)
        .post(`/auth/password-reset?token=${resetToken.token}`)
        .send({ newPassword: `brandNewPassword` })
      expect(res.statusCode).toEqual(200)

      expect(res.body).toEqual({ message: "Password successfully reset." })

      const newUser = await User.fetchUserByEmail(email)
      expect(user.password === newUser.password).toBeFalsy()
    })

    test("User with invalid token gets 400 error", async () => {
      const badToken = "incorrectToken"
      const res = await request(app)
        .post(`/auth/password-reset?token=${badToken}`)
        .send({ newPassword: `brandNewPassword` })
      expect(res.statusCode).toEqual(400)
      expect(res.body).toEqual({ error: { message: `That token is either expired or invalid.`, status: 400 } })
    })
  })
})
