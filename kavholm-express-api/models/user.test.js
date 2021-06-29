const { NotFoundError, BadRequestError, UnauthorizedError } = require("../utils/errors")
const User = require("./user")
const tokens = require("../utils/tokens")
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require("../tests/common")

beforeAll(commonBeforeAll)
beforeEach(commonBeforeEach)
afterEach(commonAfterEach)
afterAll(commonAfterAll)

const newUser = {
  username: "fake_user",
  email: "fake@user.io",
  firstName: "Fake",
  lastName: "User",
  isAdmin: false,
}

describe("User", () => {
  /************************************** User.login */

  describe("Test login", () => {
    test("User can login successfully with proper credentials", async () => {
      const user = await User.login({ email: "lebron@james.io", password: "password1" })

      expect(user).toEqual({
        id: expect.any(Number),
        username: "lebron",
        firstName: "LeBron",
        lastName: "James",
        email: "lebron@james.io",
        isAdmin: false,
        createdAt: expect.any(Date),
      })
    })

    test("Unknown email throw unauthorized error", async () => {
      expect.assertions(1)

      try {
        await User.login({ email: "somebody@else.io", password: "password" })
      } catch (err) {
        expect(err instanceof UnauthorizedError).toBeTruthy()
      }
    })

    test("Invalid credentials throw unauthorized error", async () => {
      expect.assertions(1)

      try {
        await User.login({ email: "lebron@james.io", password: "wrong" })
      } catch (err) {
        expect(err instanceof UnauthorizedError).toBeTruthy()
      }
    })
  })

  /************************************** User.register */

  describe("Test register", () => {
    const newUser = {
      username: "new",
      firstName: "Test",
      lastName: "Tester",
      email: "test@test.io",
      isAdmin: false,
    }

    test("User can successfully register with proper credentials", async () => {
      const user = await User.register({ ...newUser, password: "pw" })
      expect(user).toEqual({
        id: expect.any(Number),
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        createdAt: expect.any(Date),
      })
    })

    test("Registering with duplicate email throws error", async () => {
      expect.assertions(1)

      try {
        await User.register({
          ...newUser,
          password: "pw",
        })
        await User.register({
          ...newUser,
          password: "pw",
        })
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy()
      }
    })

    test("Registering with duplicate username throws error", async () => {
      expect.assertions(1)

      try {
        await User.register({
          ...newUser,
          password: "pw",
        })
        await User.register({
          ...newUser,
          email: "different@different.io",
          password: "pw",
        })
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy()
      }
    })
  })

  /************************************** fetchUserByEmail */

  describe("Test fetchUserByEmail", () => {
    test("Can fetch a user by email", async () => {
      const user = await User.fetchUserByEmail("lebron@james.io")
      expect(user).toEqual({
        id: expect.any(Number),
        username: "lebron",
        first_name: "LeBron",
        last_name: "James",
        email: "lebron@james.io",
        is_admin: false,
        pw_reset_token: null,
        pw_reset_token_exp: null,
        password: expect.any(String),
        created_at: expect.any(Date),
      })
    })

    test("Unknown email returns nothing", async () => {
      const user = await User.fetchUserByEmail("wrong@nope.nope")
      expect(user).toBeFalsy()
    })
  })

  /************************************** fetchUserByUsername */

  describe("Test fetchUserByUsername", () => {
    test("Can fetch a user by username", async () => {
      const user = await User.fetchUserByUsername("lebron")
      expect(user).toEqual({
        id: expect.any(Number),
        username: "lebron",
        first_name: "LeBron",
        last_name: "James",
        email: "lebron@james.io",
        is_admin: false,
        pw_reset_token: null,
        pw_reset_token_exp: null,
        password: expect.any(String),
        created_at: expect.any(Date),
      })
    })

    test("Unknown username returns nothing", async () => {
      expect.assertions(1)

      const user = await User.fetchUserByUsername("unknown")
      expect(user).toBeFalsy()
    })
  })

  /************************************** resetPassword */

  describe("Test password reset", () => {
    test("User can store password reset token in the db", async () => {
      const user = await User.register({ ...newUser, password: "pw" })
      const resetToken = tokens.generatePasswordResetToken()

      await User.savePasswordResetToken(user.email, resetToken)

      const userFromDb = await User.fetchUserByEmail(user.email)

      expect(userFromDb.pw_reset_token).toEqual(resetToken.token)
      expect(userFromDb.pw_reset_token_exp).toEqual(expect.any(Date))
    })

    test("User can reset their password when supplying the correct token", async () => {
      const user = await User.register({ ...newUser, password: "pw" })
      const oldUser = await User.fetchUserByEmail(user.email)

      const resetToken = tokens.generatePasswordResetToken()

      await User.savePasswordResetToken(user.email, resetToken)
      await User.resetPassword(resetToken.token, "new_pw")

      const userFromDb = await User.fetchUserByEmail(user.email)

      expect(userFromDb.pw_reset_token).toEqual(null)
      expect(userFromDb.pw_reset_token_exp).toEqual(null)
      expect(userFromDb.password === oldUser.password).toBeFalsy()

      expect(await User.login({ email: newUser.email, password: "new_pw" })).toBeTruthy()
    })

    test("Error is thrown when bad token is supplied", async () => {
      expect.assertions(1)

      const user = await User.register({ ...newUser, password: "pw" })
      const resetToken = tokens.generatePasswordResetToken()

      await User.savePasswordResetToken(user.email, resetToken)

      try {
        await User.resetPassword("bad token", "new_pw")
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy()
      }
    })
  })
})
