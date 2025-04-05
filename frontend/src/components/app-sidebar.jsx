import * as React from "react";
import {
  ListVideo,
  BookmarkPlus,
  GraduationCap,
  Music,
  Plane,
  Clapperboard,
  ListCollapse,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/userContext/AuthProvider";
import { useEffect } from "react";

import socket from "../socket"; // Your socket instance
import axiosInstance from "@/axiosInstance";

// This is sample data.
const data = {
  navMain: [
    {
      title: "My Playlist",
      url: "playlists",
      icon: ListVideo,
      isActive: true,
      items: [],
    },
    {
      title: "Bookmarks",
      url: "bookmarks",
      icon: BookmarkPlus,
      items: [],
    },
  ],
  projects: [
    {
      name: "Education",
      url: "/search?category=education",
      icon: GraduationCap,
    },
    {
      name: "Music",
      url: "/search?category=music",
      icon: Music,
    },
    {
      name: "Travel",
      url: "/search?category=travel",
      icon: Plane,
    },
    {
      name: "Series",
      url: "/search?category=series",
      icon: Clapperboard,
    },
    {
      name: "Others",
      url: "/search?category=other",
      icon: ListCollapse,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const { notifications, setNotifications } = useAuth();

  // Fetch notifications when component mounts

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
