import moment from "moment"

export const getListingPrice = (listing) => listing.price * 0.01
export const getMarketplaceFees = (listing) => getListingPrice(listing) * 0.1
export const getListingTotalAmount = (listing) => getListingPrice(listing) + getMarketplaceFees(listing)

export const getTotalCostForLodging = ({ listing, startDate, endDate }) => {
  const total = getListingTotalAmount(listing)
  const daysReserved = moment(new Date(endDate)).diff(moment(new Date(startDate)), "days")

  return Math.abs(daysReserved) * total
}
