const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const { SECRET_KEY } = require("../config")

const generateToken = (data) => jwt.sign(data, SECRET_KEY, { expiresIn: "24h" })

const createUserJwt = (user) => {
  const payload = {
    username: user.username,
    isAdmin: user.isAdmin || false,
  }

  return generateToken(payload)
}

const validateToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    return decoded
  } catch (err) {
    return {}
  }
}

const generateCryptoToken = (numBytes) => crypto.randomBytes(numBytes).toString("hex")

const generatePasswordResetToken = () => {
  // generate an encrypted token that expires in an hour

  return {
    token: generateCryptoToken(20),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  }
}

module.exports = {
  generateToken,
  validateToken,
  createUserJwt,
  generatePasswordResetToken,
}
