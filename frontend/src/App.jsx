
import './App.css'
import { Outlet } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"

function App() {

  return (

     <div>
        
       <Toaster/>
       <Outlet />
     </div>
        
    
  )
}

export default App
