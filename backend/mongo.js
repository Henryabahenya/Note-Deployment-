const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
// Hardcode the password just for this 1-minute test
const url = `mongodb+srv://fullstack:${password}@cluster0.urqzpyy.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

// Wrap the logic inside the connection promise
mongoose.connect(url, { family: 4 })
  .then(() => {
    console.log('Connected to MongoDB...')

    const noteSchema = new mongoose.Schema({
      content: String,
      important: Boolean,
    })

    const Note = mongoose.model('Note', noteSchema)

    const note = new Note({
      content: 'HTML is easy',
      important: true,
    })

    // Return the save promise to chain it
    return note.save()
  })
  .then(() => {
    console.log('note saved!')
    // Close connection only AFTER saving is finished
    return mongoose.connection.close()
  })
  .catch((err) => {
    console.error('Error:', err.message)
  })