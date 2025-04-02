
import './App.css'
import { Outlet } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { useEffect } from 'react';
import axios from 'axios';

function App() {

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    
    if (token) {
      console.log("Token received:", token);  // ✅ Debugging
      localStorage.setItem('auth_token', token);
      // ✅ Remove token from URL without refreshing
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);
  
  return (
     <div className='overflow-y-auto scrollbar scrollbar-thumb-orange-500 scrollbar-track-gray-200 dark:scrollbar-track-gray-800'>
       <Toaster className="z-50"/>
       <Outlet />
     </div>
        
    
  )
}

export default App
