import { useListingsContext } from "contexts/listings"
import { ListingsGrid } from "components"
import "./ListingsHome.css"

const ListingsHome = () => {
  const { listings } = useListingsContext()

  return (
    <div className="ListingsHome">
      <div className="splash-image">
        <ListingsGrid listings={listings} />
      </div>
    </div>
  )
}

export default ListingsHome
