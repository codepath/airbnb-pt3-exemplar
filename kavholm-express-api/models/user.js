const bcrypt = require("bcrypt")
const { BCRYPT_WORK_FACTOR } = require("../config")
const db = require("../db")
const { BadRequestError, UnauthorizedError } = require("../utils/errors")

class User {
  static makePublicUser(user) {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      isAdmin: user.is_admin,
      createdAt: user.created_at,
    }
  }

  static async login(credentials) {
    const requiredFields = ["email", "password"]
    requiredFields.forEach((property) => {
      if (!credentials?.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`)
      }
    })

    const user = await User.fetchUserByEmail(credentials.email)
    if (user) {
      const isValid = await bcrypt.compare(credentials.password, user.password)
      if (isValid) {
        return User.makePublicUser(user)
      }
    }

    throw new UnauthorizedError("Invalid username/password")
  }

  static async register(credentials) {
    const requiredFields = ["email", "username", "firstName", "lastName", "password", "isAdmin"]
    requiredFields.forEach((property) => {
      if (!credentials?.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`)
      }
    })

    if (credentials.email.indexOf("@") <= 0) {
      throw new BadRequestError("Invalid email.")
    }

    const existingUser = await User.fetchUserByEmail(credentials.email)
    if (existingUser) {
      throw new BadRequestError(`A user already exists with email: ${credentials.email}`)
    }

    const existingUserWithUsername = await User.fetchUserByUsername(credentials.username)
    if (existingUserWithUsername) {
      throw new BadRequestError(`A user already exists with username: ${credentials.username}`)
    }

    const hashedPassword = await bcrypt.hash(credentials.password, BCRYPT_WORK_FACTOR)
    const normalizedEmail = credentials.email.toLowerCase()
    const normalizedUsername = credentials.username.toLowerCase()

    const userResult = await db.query(
      `INSERT INTO users (email, username, first_name, last_name, password, is_admin)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, username, first_name, last_name, is_admin, created_at;
      `,
      [
        normalizedEmail,
        normalizedUsername,
        credentials.firstName,
        credentials.lastName,
        hashedPassword,
        credentials.isAdmin,
      ]
    )
    const user = userResult.rows[0]

    return User.makePublicUser(user)
  }

  static async fetchUserByEmail(email) {
    if (!email) {
      throw new BadRequestError("No email provided")
    }

    const query = `SELECT * FROM users WHERE email = $1`

    const result = await db.query(query, [email.toLowerCase()])

    const user = result.rows[0]

    return user
  }

  static async fetchUserByUsername(username) {
    if (!username) {
      throw new BadRequestError("No username provided")
    }

    const query = `SELECT * FROM users WHERE username = $1`

    const result = await db.query(query, [username])

    const user = result.rows[0]

    return user
  }

  static async savePasswordResetToken(email, resetToken) {
    const result = await db.query(
      `
      UPDATE users
      SET pw_reset_token     = $1,
          pw_reset_token_exp = $2
      WHERE email = $3
      RETURNING id, email, username, first_name, last_name, is_admin, created_at;
      `,
      [resetToken.token, resetToken.expiresAt, email.toLowerCase()]
    )

    const user = result.rows[0]

    if (user) return User.makePublicUser(user)
  }

  static async resetPassword(resetToken, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_WORK_FACTOR)

    const result = await db.query(
      `
      UPDATE users
      SET password           = $1,
          pw_reset_token     = NULL,
          pw_reset_token_exp = NULL
      WHERE pw_reset_token = $2
        AND pw_reset_token_exp > NOW()
      RETURNING id, email, username, first_name, last_name, is_admin, created_at;
      `,
      [hashedPassword, resetToken]
    )

    const user = result.rows[0]

    if (user) return User.makePublicUser(user)

    throw new BadRequestError("That token is either expired or invalid.")
  }
}

module.exports = User
