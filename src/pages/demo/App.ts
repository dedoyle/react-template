import { hot } from 'react-hot-loader/root'
import React, { useState } from 'react'
import Header from '@/components/Header'

function App() {
  const [name, setName] = useState('')
  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      <Header />
    </div>
  )
}

export default hot(App)
