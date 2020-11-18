import { StrictMode, useState, useEffect } from "react"
import ReactDOM from "react-dom"

import "./index.css"

const baseUrl = "http://localhost:8888/drupal"
const username = "tim-admin"
const password = "aMohCLq3vXbvr8DU"

const App = () => {
  const [returnedJSON, setReturnedJSON] = useState(null)

  useEffect(() => {
    const fetchJSON = async () => {
      await fetch(`${baseUrl}/user/login?_format=json`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: `{ "name": "${username}", "pass": "${password}" }`,
      })

      const fetchDrupalInfo = await fetch(
        `${baseUrl}/jsonapi/node/food_bank/`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/vnd.api+json",
          },
        }
      )
      const translatedJSON = await fetchDrupalInfo.json()
      setReturnedJSON(translatedJSON)
    }
    fetchJSON()
  }, [])

  return returnedJSON ? (
    <main>
      <h1>Santa Barbara Food Banks</h1>
      {returnedJSON.data.map((data, i) => {
        const {
          field_address,
          field_food_bank_description,
          field_food_bank_email,
          field_food_bank_hours,
          field_food_bank_name,
          field_food_bank_phone,
          field_food_bank_website,
        } = data.attributes

        const { uri } = field_food_bank_website

        return (
          <section key={i}>
            <h2>{field_food_bank_name}</h2>
            <p>Address : {field_address}</p>
            <p>Hours : {field_food_bank_hours}</p>
            <div>
              <span>
                Email :{" "}
                <a
                  href={`mailto:${field_food_bank_email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {field_food_bank_email}
                </a>
              </span>
              <span>
                Website :{" "}
                <a href={`${uri}`} target="_blank" rel="noopener noreferrer">
                  {uri}
                </a>
              </span>
            </div>
            <p>
              Telephone :{" "}
              <a
                href={`tel:${field_food_bank_phone}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {field_food_bank_phone}
              </a>
            </p>
            <p>Description : {field_food_bank_description}</p>
          </section>
        )
      })}
    </main>
  ) : (
    <p>Fetching...</p>
  )
}

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
)
