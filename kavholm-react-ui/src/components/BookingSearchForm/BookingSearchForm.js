import { useState } from "react"
import DatePicker from "react-datepicker"
import { InputField } from "components"
import moment from "moment"
import search from "assets/search.svg"
import people from "assets/people.svg"

import "./BookingSearchForm.css"

const BookingSearchForm = () => {
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(moment().add(3, "days").valueOf())

  return (
    <div className={"BookingSearchForm"}>
      <InputField name="location" label="Destination">
        <select
          name="location"
          className="location-search search dropdown-toggle"
          style={{
            background: `url(${search}) no-repeat scroll 10px 10px`,
          }}
        >
          <option>Canada</option>
          <option>Denmark</option>
          <option>France</option>
          <option>Greece</option>
          <option>Mexico</option>
          <option>New Zealand</option>
          <option>Norway</option>
          <option>Singapore</option>
          <option>Spain</option>
          <option>USA</option>
        </select>
      </InputField>

      <div className="row gap-10">
        <InputField name="start_date" label="Start Date" className="flex-1">
          <DatePicker selected={startDate} className="date" onChange={(date) => setStartDate(date)} />
        </InputField>
        <InputField name="end_date" label="End Date" className="flex-1">
          <DatePicker selected={endDate} className="date" onChange={(date) => setEndDate(date)} />
        </InputField>
      </div>

      <select
        className="guests dropdown-toggle"
        style={{
          background: `url(${people}) no-repeat scroll 10px 10px`,
        }}
      >
        <option>Guests</option>
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
        <option>6</option>
        <option>7</option>
        <option>8</option>
      </select>
    </div>
  )
}

export default BookingSearchForm
