const express = require('express')
const morgan = require('morgan')
const app = express()
// const cors = require('cors')

app.use(express.static('dist'))

// app.use(cors())

app.use(express.json())

// morgan for logging
// ngambil request yang di-JSON.stringify(), lalu dimasukin sebagai token 'body'
morgan.token('body', (req) => JSON.stringify(req.body))
// memanggil token 'body', format sebelum ':body' ini basically berasal dari morgan('tiny)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(morgan('tiny'))

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `)
})

app.get('/api/persons', (request, response) => {
    response.json(persons).end()
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    return String(Math.floor(Math.random() * 1_000_000_000))
}

const searchDuplicate = (name) => {
    return persons.filter(person => person.name == name).length
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if ((!body.name) || (!body.number)) {
        return response.status(400).json({
            error: "field missing"
        })
    }

    if (searchDuplicate(body.name) !== 0) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server is running on port ${PORT}`)