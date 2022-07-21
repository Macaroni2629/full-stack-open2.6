import { useState, useEffect } from 'react'
import axios from 'axios'
// import Note from './components/Note'

const Person = ({id, name, number}) => {
  return (
    <li>{id} {name} :  {number}</li>
  )
} 

const Filter = ({type, name, placeholder, onChange, onKeyUp, value}) => {
  return (
    <>
      <input type={type} name={name} placeholder={placeholder} onChange={onChange} onKeyUp={onKeyUp} value={value}/>
    </>
  )
}


const PersonForm = ({onChanges, newName, newNumber}) => {
  let arrayOfHandlers = onChanges
  return (
    <>
      <form>
        <div>
          name: <input id="search" type="text" onChange={arrayOfHandlers[0]} value={newName} />
        </div>
        <div>
          number: <input type="text" onChange={arrayOfHandlers[1]} value={newNumber} />
        </div>
        <div>
          <input type="submit" value="add" onClick={arrayOfHandlers[2]} />
        </div>
      </form>
    </>
  )
}

const Persons = ({currentPersons}) => {
  return (
    <ul>
        {currentPersons.map(person => 
          <Person key={person.id} name={person.name} number={person.number} />
        )}
    </ul>
  )
}

const App = () => {
  let results;
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [currentPersons, setCurrentPersons] = useState([])

   useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const whoToShowNow = (results) => {
    if (currentPersons.length === 0) {
      setCurrentPersons(results)
    } else if (results.length >= 1) {
      setCurrentPersons(results)
    } else {
      setCurrentPersons(persons)
    }
  }
  const handleAddName = (e) => {
    e.preventDefault();
    let itemClicked = e.currentTarget
    let a = itemClicked.parentElement
    let b = a.parentElement
    let desiredNameInput = b.children[0].children[0]
    let name2 = desiredNameInput.value
    let desiredNumberInput = b.children[1].children[0]
    let number = desiredNumberInput.value

    persons.forEach(({name}) => {
      if (name === name2) {
        alert(`${name} is already added to phonebook.`)
      } else {
        setPersons(persons.concat({"name": name2, "number": number}))
      }
    })
  }

  const handleOnChange = (e) => {
    setNewName(e.target.value);
  }

  const handleOnChangeNumber = (e) => {
    setNewNumber(e.target.value)
  }

  const handleOnChangeSearch = (e) => {
    if (e.key === "Enter") {
      console.log('i get here')
      results = search(newSearch)
      setNewSearch(newSearch)
      whoToShowNow(results);
    }
  }

  const search = (searchTerm) => {
    let matches = [];
    persons.forEach(person => {
      let copy = person["name"].toLowerCase();
      let regex = new RegExp(`${searchTerm.toLowerCase()}`)
      if (regex.test(copy)) {
        matches.push(person)
      }
    })
    return matches;
  }

  const handleOnChangeSearch2 = (e) => {
    setNewSearch(e.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter type="text" name="" placeholder="Type to search" onChange={handleOnChangeSearch2} onKeyUp={handleOnChangeSearch} value={newSearch} />
      <PersonForm onChanges={[handleOnChange, handleOnChangeNumber, handleAddName]} />
      <h2>Numbers</h2>
      <Persons currentPersons={currentPersons}/>
    </div>
  )
}

export default App