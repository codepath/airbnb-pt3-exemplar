import { Link } from "react-router-dom"
import { BookingSearchForm, Button, Card } from "components"
import HERO_BG from "assets/HERO_BG.png"
import "./Home.css"

const Home = () => {
  return (
    <div className="Home">
      <div className="splash-image" style={{ backgroundImage: `url(${HERO_BG})`, backgroundSize: `cover` }}>
        <div className="container">
          {/* CTA Card */}
          <Card className="booking-search-card">
            <h1>Book unique places to stay around the globe</h1>

            <BookingSearchForm size="large" />

            <div className="button-container">
              <Link to="/listings">
                <Button buttonType="primary">Show listings</Button>
              </Link>
            </div>
          </Card>
          {/* End CTA Card */}
        </div>
      </div>
    </div>
  )
}

export default Home
