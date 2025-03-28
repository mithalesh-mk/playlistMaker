
import './App.css'
import { Outlet } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"

function App() {

  return (
     <div className='overflow-y-auto scrollbar scrollbar-thumb-orange-500 scrollbar-track-gray-200 dark:scrollbar-track-gray-800'>
       <Toaster className="z-50"/>
       <Outlet />
     </div>
        
    
  )
}

export default App
