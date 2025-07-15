const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
require('dotenv').config()

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

morgan.token('object', (req) => {
  return JSON.stringify(req.body)
})


/*let persons = [
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
  },
  {
    "id": 5,
    "name": "Jorge",
    "number": "39-23-6423122"
  }
]
*/
app.get('/api/info', (request, response) => {
  Person.find({}).then(result => {
    response.send(`<p>phonebook has info for ${result.length} people</p>
    <p>${new Date()}</p>`)
  })
})

/*app.get('/api/persons', (request, response) => {
  response.json(persons)
})
*/

app.get('/api/persons', (request, response) => {
  Person.find({}).then(p => {
    response.json(p)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  // const id = Number(request.params.id)
  Person.findById(request.params.id).then(p => {
    if (p) { response.json(p) }
    else { response.status(404).end() }
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))

  response.status(204).end()
})

/*const generateId = () => {
  return Math.floor(Math.random() * 1000000)
}
*/
app.post('/api/persons', morgan(':method :url :status :res[content-length] - :response-time ms :object'), (request, response, next) => {
  const body = request.body

  console.log(body)

  if (!body.number || !body.name) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then(savedPerson => response.json(savedPerson))
    .catch(error => next(error))

})
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }
  console.log(person)
  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
    .then(updatedPerson => {
      if (updatedPerson === null)
        response.status(400).send({ error: `Information of ${person.name} has already been removed from server` })
      console.log(updatedPerson)
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError')
    return response.status(400).send({ error: 'malformatted id' })

  if (error.name === 'ValidationError')
    return response.status(400).send({ error: error.message })

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})