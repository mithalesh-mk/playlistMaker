import * as React from "react"
import {
  ListVideo ,
  BookmarkPlus ,
  GraduationCap ,
  Music ,
  Plane ,
  Clapperboard ,
  ListCollapse,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  
  navMain: [
    {
      title: "My Playlist",
      url: "playlists",
      icon: ListVideo ,
      isActive: true,
      items: [
        

      ],
    },
    {
      title: "Bookmarks",
      url: "bookmarks",
      icon: BookmarkPlus ,
      items: [
        
      ],
    },
    
  ],
  projects: [
    {
      name: "Education",
      url: "#",
      icon: GraduationCap ,
    },
    {
      name: "Music",
      url: "#",
      icon: Music ,
    },
    {
      name: "Travel",
      url: "#",
      icon: Plane ,
    },
    {
      name: "Series",
      url: "#",
      icon: Clapperboard ,
    },
    {
      name: "Others",
      url: "#",
      icon: ListCollapse ,
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    (<Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher/>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>)
  );
}
