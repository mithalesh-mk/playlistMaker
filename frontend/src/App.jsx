import { Button } from "@/components/ui/button"



import './App.css'
import Home from "./app/dashboard/Home"
import { Outlet } from "react-router-dom"

function App() {

  return (
    <div>
      <Outlet/>
    </div>
  )
}

export default App
