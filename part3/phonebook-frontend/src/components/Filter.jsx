const Filter = ({ filterValue, setFilterValue }) => {
    return (
        <div>
            filter shown with
            <input value={filterValue} onChange={e => setFilterValue(e.target.value)} />
        </div>

    )
}

export default Filter