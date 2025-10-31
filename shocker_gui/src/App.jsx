import { useState } from 'react'
import './App.css'
import { get_shockers,control_collar} from './Api_calls/Api_calls.jsx'
import {shock_all} from "./shock_modes.jsx"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{width: "1 vh"}}>
      <button className='half-screen-btn' onClick={control_collar}>All</button>
      <button className='half-screen-btn' onClick={control_collar}>Random</button>
    </div>
  )
}

export default App;
