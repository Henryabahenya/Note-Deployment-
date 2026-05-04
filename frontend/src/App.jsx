import { useState , useEffect} from 'react'

import noteService from './services/notes'


const Note = ({note,toggleImportance})=>{
const label= note.important
?'make not important' : 'make note important'

return(
  <li>
    {note.content}
    <button onClick={toggleImportance}>{label} </button>
  </li>
)
}



const App = () => {
  const [notes,setNotes]=useState([])
  const [newNote,setNewNote]=useState('... a new Note')
  const [showAll,setShowAll]=useState(true)
  
  useEffect(() => {
    noteService
    .getAll()
    .then(initialNotes=> {
      setNotes(initialNotes)
    })
  }, [])


const toggleImportanceOf = id => {
  
  const note = notes.find(n => n.id === id)
  const changedNote = { ...note, important: !note.important }

  noteService
  .update(id, changedNote)
  .then(returnedNote=> {
    setNotes(notes.map(note=>note.id===id ? returnedNote : note))
  })
  
}



const addNote = (event) => {
    event.preventDefault()
    
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5
    }
 noteService
 .create(noteObject)
 .then(returnedNote=>{
  setNotes(notes.concat(returnedNote))
  setNewNote('')
 })
   
      }
  


  const handleNewChange=(event)=>{
console.log(event.target.value)
setNewNote(event.target.value)
  }

  const notesToShow= showAll 
  ? notes
  : notes.filter(note=> note.important)


  return (
    <div>

      <h1>Notes Practical</h1>

    <button onClick={()=>setShowAll(!showAll)}> Click {showAll ? 'important' : 'all'}</button>

      <ul>
        {notesToShow.map((note) => (
          <Note key={note.id} note={note}
          toggleImportance={()=>toggleImportanceOf(note.id)} />
        ))}
      </ul>
      <form onSubmit={addNote}>

        <input 
        value={newNote}
        onChange={handleNewChange}
        />

        <button type="submit">Save</button>
      </form>
    </div>
  )
}

export default App