const db = require("../db")

const createBookings = async (userIds, listingIds) => {
  const userId = userIds[0]
  const listingId = listingIds[0]

  const listingResults = await db.query(
    `
    SELECT id, price
    FROM listings
    WHERE id = $1;
    `,
    [listingId]
  )

  const listing = listingResults.rows[0]

  const firstBooking = {
    startDate: "03-05-2021",
    endDate: "03-07-2021",
    guests: 1,
  }

  const secondBooking = {
    startDate: "03-22-2021",
    endDate: "03-29-2021",
    guests: 4,
  }

  await db.query(
    `
    INSERT INTO bookings (
      payment_method, 
      start_date, 
      end_date, 
      guests, 
      total_cost, 
      listing_id, 
      user_id
    )
    VALUES (
      $1, 
      ($2)::date, 
      ($3)::date, 
      $4, 
      -- calculate total_cost by
      -- multiplying days spent (+1)
      -- with the listing price + market fees
      -- rounded up to nearest cent
      CEIL(
        (($3)::date - ($2)::date + 1) * ($5 + $5 * 0.1)
      ), 
      $6, 
      $7
    )    
    `,
    ["card", firstBooking.startDate, firstBooking.endDate, firstBooking.guests, listing.price, listing.id, userId]
  )

  await db.query(
    `
    INSERT INTO bookings (
      payment_method, 
      start_date, 
      end_date, 
      guests, 
      total_cost, 
      listing_id, 
      user_id
    )
    VALUES (
      $1, 
      ($2)::date, 
      ($3)::date, 
      $4, 
      -- calculate total_cost by
      -- multiplying days spent (+1)
      -- with the listing price + market fees
      -- rounded up to nearest cent
      CEIL(
        (($3)::date - ($2)::date + 1) * ($5 + $5 * 0.1)
      ), 
      $6, 
      $7
    )    
    `,
    ["card", secondBooking.startDate, secondBooking.endDate, secondBooking.guests, listing.price, listing.id, userId]
  )

  const results = await db.query(`SELECT id FROM bookings ORDER BY id ASC`)

  const ids = results.rows.map((row) => row.id)
  return ids
}

module.exports = {
  createBookings,
}
