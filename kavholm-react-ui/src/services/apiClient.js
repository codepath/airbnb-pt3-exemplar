import axios from "axios"

class ApiClient {
  constructor(remoteHostUrl) {
    this.remoteHostUrl = remoteHostUrl
    this.token = null
  }

  setToken(token) {
    this.token = token
  }

  async request({ endpoint, method, data = {} }) {
    const url = `${this.remoteHostUrl}/${endpoint}`
    console.debug("API Call:", endpoint, data, method)
    const params = method === `GET` ? data : {}
    const headers = {
      "Content-Type": "application/json",
    }
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    try {
      const res = await axios({ url, method, data, params, headers })
      return { data: res.data, error: null, message: null }
    } catch (error) {
      console.error("APIclient.makeRequest.error", error.response)
      const message = error?.response?.data?.error?.message
      return { data: null, error: message ?? String(error) }
    }
  }

  async fetchListings() {
    return await this.request({ endpoint: `listings/`, method: `GET` })
  }

  async createNewListing(newListing) {
    return await this.request({ endpoint: `listings/`, method: `POST`, data: { newListing } })
  }

  async fetchListingById(listingId) {
    return await this.request({ endpoint: `listings/${listingId}/`, method: `GET` })
  }

  async fetchBookingsForUser() {
    return await this.request({ endpoint: `bookings`, method: `GET` })
  }

  async fetchAllBookingsForUserOwnedListings() {
    return await this.request({ endpoint: `bookings/listings`, method: `GET` })
  }

  async fetchBookingsForListing(listingId) {
    return await this.request({ endpoint: `bookings/listings/${listingId}/`, method: `GET` })
  }

  async bookListing({ listingId, newBooking }) {
    return await this.request({
      endpoint: `bookings/listings/${listingId}/`,
      method: `POST`,
      data: { newBooking },
    })
  }

  async fetchUserFromToken() {
    return await this.request({ endpoint: `auth/me`, method: `GET` })
  }

  async resetPassword({ token, newPassword }) {
    return await this.request({
      endpoint: `auth/password-reset?token=${token}`,
      method: `POST`,
      data: { newPassword },
    })
  }

  async recoverAccount(email) {
    return await this.request({ endpoint: `auth/recover`, method: `POST`, data: { email } })
  }

  async signupUser(credentials) {
    return await this.request({ endpoint: `auth/register`, method: `POST`, data: credentials })
  }

  async loginUser(credentials) {
    return await this.request({ endpoint: `auth/login`, method: `POST`, data: credentials })
  }

  async logoutUser() {
    this.setToken(null)
    localStorage.setItem("kavholm_token", "")
  }
}

export default new ApiClient(process.env.REACT_APP_REMOTE_HOST_URL || "http://localhost:3001")
