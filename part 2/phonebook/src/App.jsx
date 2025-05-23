import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterValue, setFilterValue] = useState('')

  useEffect(() => {
    phonebookService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const updateNumber = (id, newPerson) => {
    phonebookService
      .update(id, newPerson).then(returnedPerson => {
        setPersons(persons.map(person => person.id === id ? returnedPerson : person))
        setNewName('')
        setNewNumber('')
      })
  }

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber
    }
    if (persons.find(p => p.name === newName) !== undefined) {
      if (persons.find(p => p.number === newNumber) !== undefined) {
        window.alert(`${newName} is already added to phonebook`)
      }
      else {
        window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
          ? updateNumber((persons.find(p => p.name === newName)).id, newPerson)
          : setNewName(''), setNewNumber('')
      }
    } else {
      phonebookService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
    }

  }

  const confirmDeletion = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      phonebookService.remove(person.id)
        .then(deletedPerson => {
          setPersons(persons.filter(p => p.id !== deletedPerson.id))
          window.alert(``)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const personsToShow = filterValue.length === 0
    ? persons
    : persons.filter(person => person.name === filterValue)


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterValue={filterValue} setFilterValue={setFilterValue} />
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      {personsToShow.map(person => <Persons key={person.id} person={person} confirmDeletion={confirmDeletion} />)}
    </div>
  )
}

export default App