import { useState, useEffect } from 'react'
import Display from './components/Display'
import FindCountries from './components/FindCountries'

import countriesService from './services/countries'



const App = () => {
  const [countries, setCountries] = useState([])
  const [searchCountry, setSearchCountry] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    countriesService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])


  const countriesToShow = countries.filter(country => {
    // ekuivalen dengan str.contains()
    return country.name.common.toLowerCase().includes(searchCountry.toLocaleLowerCase())
  })



  const handleCountryChange = (event) => {
    console.log(event.target.value)
    setSelectedCountry(null)
    setSearchCountry(event.target.value)
  }

  const handleShow = (countryName) => {
    const country = countries.find(country => country.name.common === countryName)
    setSelectedCountry(country)
  }

  return (
    <div>
      <FindCountries searchCountry={searchCountry} handleCountryChange={handleCountryChange} />
      {/* DISPLAY */}
      {(selectedCountry || countriesToShow.length === 1)
        ? <Display
          key={
            selectedCountry
              ? selectedCountry.name.common
              : countriesToShow[0].name.common
          }
          country={selectedCountry || countriesToShow[0]}
        />
        : countriesToShow.length <= 10
          ? countriesToShow.map(country =>
            <p key={country.name.common}>
              {country.name.common} <button onClick={() => handleShow(country.name.common)}>show</button>
            </p>
          )
          : null
      }
      {(!selectedCountry && countriesToShow.length >= 10) &&
        <p>Too many matches, specify another filter</p>
      }
    </div>
  )
}

export default App
