import moment from "moment"

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const formatPrice = (price) => (price ? currencyFormatter.format(price) : price)

export const formatDate = (date) => moment(date).format("MMM DD, YYYY")
