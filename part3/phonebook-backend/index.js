require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
// const cors = require('cors')

// ==== MONGODB Config ⬇️
const Person = require('./models/person')
// ==== MONGODB Config ⬆️

app.use(express.static('dist'))

// app.use(cors())

app.use(express.json())

// morgan for logging
// ngambil request yang di-JSON.stringify(), lalu dimasukin sebagai token 'body'
morgan.token('body', (req) => JSON.stringify(req.body))
// memanggil token 'body', format sebelum ':body' ini basically berasal dari morgan('tiny)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(morgan('tiny'))

app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const generateId = () => {
    return String(Math.floor(Math.random() * 1_000_000_000))
}

// const searchDuplicate = (name) => {
//     return persons.filter(person => person.name == name).length
// }

const searchDuplicate = (name) => {
    return Person.findOne({ name }).then(result => result !== null)
}

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if ((!body.name) || (!body.number)) {
        return response.status(400).json({
            error: "field missing"
        })
    }

    // const person = new Person({
    //     name: body.name,
    //     number: body.number,
    // })

    // person.save()
    //     .then(savedPerson => {
    //         response.json(savedPerson)
    //     })
    //     .catch(error => next(error))

    searchDuplicate(body.name)
        .then(isDuplicate => {
            if (isDuplicate) {
                return response.status(400).json({
                    error: "name must be unique"
                })
            }

            const person = new Person({
                name: body.name,
                number: body.number,
            })

            person.save()
                .then(savedPerson => {
                    response.json(savedPerson)
                })
                .catch(error => next(error))
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    Person.findById(request.params.id)
        .then(person => {
            if (!person) {
                return response.status(404).end()
            }

            person.name = name
            person.number = number

            return person.save().then(updatedPerson => {
                response.json(updatedPerson)
            })
        })
        .catch(error => next(error))
})

// Error Handling Middlewares

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// error handler dari express 
const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server is running on port ${PORT}`)