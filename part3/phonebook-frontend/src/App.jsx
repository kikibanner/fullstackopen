import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationClassName, setNotificationClassName] = useState(null)

  const notificationAddScucess = (message) => {
    setNotificationMessage(message)
    setNotificationClassName('success')

    setTimeout(() => {
      setNotificationClassName(null)
      setNotificationMessage(null)
    }, 5000)
  }

  const notificationError = (message) => {
    setNotificationMessage(message)
    setNotificationClassName('error')

    setTimeout(() => {
      setNotificationClassName(null)
      setNotificationMessage(null)
    }, 5000)
  }

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
    if (!newName) {
      window.alert('Name is required!')
      return
    }
    if (!newNumber) {
      window.alert('Number is required!')
      return
    }
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
          notificationAddScucess(`Added ${newName}`)
        })
    }

  }

  const confirmDeletion = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      phonebookService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
          window.alert(`${person.name} deleted Successfully`)
        })
        .catch(error => {
          console.log(error)
          notificationError(`Information of ${person.name} has already deleted from server`)
          setPersons(persons.filter(p => p.id !== person.id))
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
      <Notification message={notificationMessage} className={notificationClassName} />
      <Filter filterValue={filterValue} setFilterValue={setFilterValue} />
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      {personsToShow.map(person => <Persons key={person.id} person={person} confirmDeletion={confirmDeletion} />)}
    </div>
  )
}

export default App