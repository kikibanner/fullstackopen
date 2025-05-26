const FindCountries = ({ searchCountry, handleCountryChange }) => {
    return (
        <form action="">
            find countries
            <input
                value={searchCountry}
                onChange={handleCountryChange}
            />
        </form>
    )
}

export default FindCountries