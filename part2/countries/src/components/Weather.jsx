import { useEffect, useState } from 'react'
import countriesService from "../services/countries"

const Weather = ({ country }) => {
    const [weather, setWeather] = useState({})

    useEffect(() => {
        countriesService
            .getWeather(country.capital)
            .then(response => {
                setWeather(response)
            })
    }, [country.capital])

    return (
        <>
            {weather.weather ? (
                <>
                    Temperature {(weather.main?.temp ? (weather.main.temp - 273.15).toFixed(2) : '-')} celcius <br />
                    <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="" /><br />
                    Wind {weather.wind?.speed ?? '-'}
                </>
            ) : (
                'loading...'
            )}
        </>
    )
}
export default Weather