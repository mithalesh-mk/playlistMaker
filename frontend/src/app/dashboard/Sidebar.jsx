import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { Bell } from 'lucide-react';  
import Notification from '../Notification';
import { BellDot } from 'lucide-react';
import { useAuth } from "@/userContext/AuthProvider"

export default function Sidebar({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [onClose , setOnClose] = useState(false);

  const handlePlaylist = (e) => {
    setSearch(e.target.value);
  };

    const {notifications} = useAuth()
    useEffect(() => {
      
      if(notifications.length>0) {
        notifications.map((notification) => {
          console.log(notification.isRead)  
          if(notification.isRead === false) {
            setCount(count + 1)
          }
        })
        
      }
    },[notifications])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 transition-all ease-linear">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-grow justify-start">
            <div className="flex items-center w-full max-w-[500px] relative">
              <input
                type="text"
                className="w-full h-8 px-5 rounded-full border border-gray-700 bg-inherit text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out shadow-lg"
                placeholder="Search Here..."
                value={search}
                onChange={handlePlaylist}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate(`/search?query=${search}`);
                  }
                }}
              />
              <button
                className="absolute -right-0 transform p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 ease-in-out shadow-md hover:scale-105"
                onClick={() => navigate(`/search?query=${search}`)}
              >
                <AiOutlineSearch className="text-white text-xl sm:text-lg" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            {
              count > 0? (
                <BellDot size={24} className="text-red-500" onClick={()=>setIsOpen(true)}/>
              ) : (
                <Bell size={24} onClick={()=>setIsOpen(true)}/>
              )
            }
          </div>
      <Notification isOpen={isOpen} onClose={()=>setIsOpen(false)} />
        </header>
        {children}
      </SidebarInset>

    </SidebarProvider>
  );
}
