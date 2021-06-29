import Modal from "react-modal"
import DatePicker from "react-datepicker"
import { Button, InputField } from "components"
import { useBookingModal } from "hooks/useBookingModal"
import { useAuthContext } from "contexts/auth"
import { formatPrice, formatDate } from "utils/format"
import { getTotalCostForLodging } from "utils/calculations"
import confirmed from "assets/confirmed.svg"
import people from "assets/people.svg"

import "./BookingModal.css"

const modalStyles = {
  content: {
    position: "relative",
    top: 200,
    left: "auto",
    right: "auto",
    bottom: "auto",
    margin: "0 auto",
    border: 0,
    maxWidth: 680,
    maxHeight: 700,
    textAlign: "center",
    paddingTop: "70px",
    paddingBottom: "45px",
    boxShadow: "0px 18px 36px rgba(0,0,0,0.15)",
    borderRadius: "16px",
  },
}

export default function BookingModal({ isOpen, toggleModal, listing }) {
  const { user } = useAuthContext()
  const {
    startDate,
    endDate,
    guests,
    error,
    setStartDate,
    setEndDate,
    setGuests,
    handleOnSubmitBooking,
    isProcessing,
    booking,
    // setError,
  } = useBookingModal(listing.id)

  return (
    <Modal
      className="BookingModal"
      isOpen={isOpen}
      onRequestClose={toggleModal}
      ariaHideApp={false}
      style={modalStyles}
    >
      <Button buttonType="ghost" role="button" onClick={() => toggleModal()} className="close-button">
        X
      </Button>

      <div className="content">
        <h1>Hi, {user.firstName}!</h1>

        {error && <p className="error">{error}</p>}

        {booking ? (
          <div className="completed">
            <img src={confirmed} width="50" alt="confirmed" />
            <h1>Congratulations! Your stay has been reserved.</h1>
            <p>Your host will expect you on {formatDate(booking.startDate)}</p>
          </div>
        ) : (
          <>
            <p>Please select your reservation details.</p>
            <div className="booking-modal-form">
              <div className="row gap-10">
                <InputField name="start_date" label="Arrive" className="flex-1">
                  <DatePicker selected={startDate} className="date" onChange={(date) => setStartDate(date)} />
                </InputField>
                <InputField name="end_date" label="Leave" className="flex-1">
                  <DatePicker selected={endDate} className="date" onChange={(date) => setEndDate(date)} />
                </InputField>
              </div>

              <InputField name="guests" label="Guests">
                <select
                  className="guests dropdown-toggle"
                  style={{
                    background: `url(${people}) no-repeat scroll 10px 10px`,
                  }}
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                >
                  <option value={null}>Guests</option>
                  {new Array(10).fill(0).map((_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </InputField>
            </div>

            <h1 className="booking-title">
              {/* Pay <span className="price">{`USD ${formatPrice(getListingTotalAmount(listing))}`}</span> */}
              {` `}
              {/* to buy */}
            </h1>

            <Button isLoading={isProcessing} buttonType="primary" onClick={handleOnSubmitBooking}>
              Book Lodging for {`USD ${formatPrice(getTotalCostForLodging({ listing, startDate, endDate }))}`}
            </Button>
          </>
        )}
      </div>
    </Modal>
  )
}
