const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

// 1. Instantiations and Configurations (if any)
// 2. Middlewares (place here before the routes)
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

// 3. API Routes MUST come before express.static to prevent intercepting
app.get('/', (req, res) => {
  res.send('Hello World')
})

let notes = [
  { id: '1', content: 'Boss', important: true },
  { id: '2', content: 'Henry', important: false },
  { id: '3', content: 'Kg', important: true },
  { id: '4', content: 'Chris', important: false }
]

app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id
  const note = notes.find(note => note.id === id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id
  notes = notes.filter(note => note.id !== id)
  res.status(204).end()
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/notes', (req, res) => {
  const body = req.body

  if (!body.content) {
    return res.status(400).json({ // Use .json() instead of .end() for errors
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId()
  }
  notes = notes.concat(note)
  console.log(note)
  res.json(note)
})

// 4. Static Middleware is placed LAST, right before the server listens
app.use(express.static('dist'))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})