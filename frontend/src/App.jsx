import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className='text-5xl font-bold text-center mt-20'> hello from React</h1>
      <div className='flex flex-col items-center mt-10'>
         <p className='text-lg'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae nostrum in praesentium commodi quos aspernatur ea ipsum rerum labore accusamus eum quis voluptates voluptatem, consequatur cumque voluptate excepturi iste provident.</p>
         </div>
    </>
  )
}

export default App
