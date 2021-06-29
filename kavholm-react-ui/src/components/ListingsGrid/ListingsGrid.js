import { Link } from "react-router-dom"
import "./ListingsGrid.css"

export default function ListingsGrid({ listings, children }) {
  const renderListings = () => {
    const dummyListings = new Array(4).fill(0).map(() => ({ id: Math.random() }))

    const listingItems = listings?.length < 4 ? [...listings, ...dummyListings] : listings

    const items = listingItems.map((l) => (
      <li className="listing-item" key={l.id}>
        <div className="clip">
          {l.title && (
            <Link to={`/listings/${l.id}`}>
              <span>
                {<img src={l.imageUrl} alt="cover" />}
                <div className="overlay" />
                <h2>{l.location}</h2>
                <h3>{l.title}</h3>
              </span>
            </Link>
          )}
        </div>
      </li>
    ))

    if (children) {
      items.unshift(
        <li className="listing-item" key={-1}>
          <div className="clip">{children}</div>
        </li>
      )
    }

    return items
  }

  return (
    <ul className="ListingsGrid">
      <>{renderListings()}</>
    </ul>
  )
}
