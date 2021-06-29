import { useListingsNewForm } from "hooks/useListingsNewForm"
import { Button, Card, InputField, Input } from "components"
import CREATE_LISTING_HERO_BG from "assets/CREATE_LISTING_HERO_BG.png"
import "./ListingsNew.css"

const formFields = [
  { name: "title", label: "Title", placeholder: "A title for your listing", type: "text", required: true },
  { name: "description", label: "Description", placeholder: "Enter a nice description", type: "text", required: true },
  { name: "price", label: "Price per night (in cents)", type: "number", required: true },
  { name: "location", label: "Location", placeholder: "Where is the listing located?", type: "text", required: true },
  {
    name: "imageUrl",
    label: "Main Image",
    placeholder: "URL to an image for this listing",
    type: "text",
    required: true,
  },
  {
    name: "imageUrl2",
    label: "Secondary Image",
    placeholder: "URL to another image for this listing",
    type: "text",
    required: false,
  },
  {
    name: "imageUrl3",
    label: "Tertiary Image",
    placeholder: "URL to one more image for this listing",
    type: "text",
    required: false,
  },
]

export default function ListingsNew() {
  const { form, handleOnSubmit, handleOnChange, errors, isProcessing } = useListingsNewForm()

  return (
    <>
      <div className="ListingsNew">
        <div
          className="splash-image"
          style={{ background: `url(${CREATE_LISTING_HERO_BG}) no-repeat`, backgroundSize: `cover` }}
        >
          <div className="container">
            <Card className="new-listing-card">
              <h1>Create New Listing</h1>

              <p className={`error ${errors.form && "show"}`}>{errors.form && `Error: ${errors.form}`}</p>

              <div className="listing-form">
                {formFields.map((field) => (
                  <InputField
                    key={field.name}
                    name={field.name}
                    label={field.label}
                    error={errors[field.name]}
                    required={field.required}
                  >
                    <Input value={form[field.name]} handleOnChange={handleOnChange} {...field} />
                  </InputField>
                ))}

                <Button
                  buttonType="primary"
                  isLoading={isProcessing}
                  isDisabled={isProcessing}
                  onClick={handleOnSubmit}
                >
                  Create
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
