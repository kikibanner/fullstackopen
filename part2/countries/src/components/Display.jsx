import Weather from "./Weather"

const Display = ({ country }) => {
    return (
        <div>
            <h1>{country.name.common}</h1>
            Capital {country.capital} <br />
            Area {country.area}
            <h2>Languages</h2>
            <ul>
                {country.languages &&
                    Object.values(country.languages).map(lang => (
                        <li key={lang}>{lang}</li>
                    ))
                }
            </ul>
            <img src={country.flags.png} alt={country.flags.alt} />
            <h2>Weather in {country.capital}</h2>
            <Weather country={country} />
        </div>
    )
}

export default Display