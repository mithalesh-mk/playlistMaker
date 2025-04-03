"use client"

import {
  User2Icon,
  Bell,
  ChevronsUpDown,
  LogOut,
  SunMoon
} from "lucide-react"

import { ThemeContext } from "@/themeContext/ThemeProvider"


import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useContext, useEffect, useState } from "react"
import { useAuth } from "@/userContext/AuthProvider"
import { Link } from "react-router-dom"

export function NavUser() {
  const { isMobile } = useSidebar()
  const {toggleTheme} = useContext(ThemeContext)
  const { user,handleLogout } = useAuth()
  const [count, setCount] = useState(0) 

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

  


  if(!user) return <div>Loading....</div>

  return (
    (<SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg">
                <img src={user.profilePic} alt={user.username}/>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                {count>0 && <div className="h-2 w-2 rounded-full bg-red-600  absolute left-8 top-1 z-50"></div>}
                <span className="truncate font-semibold">{user.username}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <img src={user.profilePic} alt={user.username}/>
              </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.username}</span>
                  <span className="truncate text-xs">{user.email}</span>
                
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>  
              <Link to="/profile">
              <DropdownMenuItem>
                <User2Icon />
                Profile
              </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            
            <DropdownMenuGroup>
              <Link to={'/notifications'}>
              <DropdownMenuItem>
                <Bell />
                <p >Notifications</p>
                {count>0 && <div className="h-2 w-2 rounded-full bg-red-600  absolute left-2 top-1 z-50"></div>}
              </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>)
  );
}
