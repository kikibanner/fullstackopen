const Persons = ({ person, confirmDeletion }) => {
    return (
        <>
            <p>{person.name} {person.number} <button onClick={() => confirmDeletion(person)}>delete</button> </p>
        </>
    )
}

export default Persons