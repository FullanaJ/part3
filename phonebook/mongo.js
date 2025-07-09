const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}
if (process.argv.length > 5 || process.argv.length === 4) {
    console.log('Invalid amount of arguments')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://fullana:${password}@cluster0.9m3o8sw.mongodb.net/notebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('person', personSchema)

if (process.argv.length === 3) {
    console.log("phonebook:")
    Person.find({}).then((result) => {
        result.forEach((p) => console.log(p.name, p.number))
        mongoose.connection.close()
    })
}
if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(result => {
        console.log(`Added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}
