import React from 'react'
import CharacterCard from './components/CharactersCard'

import 'antd/dist/antd.min.css'

const App: React.FC = (props) => {
  return (
    <div style={{ margin: 10 }}>
      <h1>Shared Card</h1>

      <CharacterCard
        character={{
          id: 1,
          name: 'Jane Doe',
          gender: 'Female',
          species: 'Human',
          status: 'Alive',
          type: '',
          image: 'https://images.unsplash.com/photo-1499155286265-79a9dc9c6380?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=684&q=80',
        }}
      />
    </div>
  )
}

export default App
