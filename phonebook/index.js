const express = require('express')
const app = express()
const morgan = require('morgan')
app.use(express.json())
app.use(express.static('dist'))
const cors = require('cors')

app.use(cors())
morgan.token('object', (req, res) => {
    return JSON.stringify(req.body)
})
app.use(morgan('tiny'))
let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const checkIfnameExist = (name) => persons.find(p => p.name === name) !== undefined

app.get('/api/persons', (request, response) => response.json(persons))

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
       response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    console.log(response);

    response.send(
        `
            <p>Phonebook has info for ${persons.length} people
            <br/><br/>
            ${new Date()}</p>
        `
    )
})

app.post('/api/persons', morgan(':method :url :status :res[content-length] - :response-time ms :object'), (request, response) => {


    const person = { ...request.body, id: Math.floor(Math.random() * 10000) }
    if (!person.name) {
        response.json({ error: "The name is missing" })
        return
    }
    if (!person.number) {
        response.json({ error: "The number is missing" })
        return
    }
    if (checkIfnameExist(person.name)) {
        response.json({ error: "the name already exist" })
        return
    }
    persons = persons.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})