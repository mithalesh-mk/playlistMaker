import { Command, Folder, Forward, MessageCircleQuestion, MessageSquareQuote, MoreHorizontal, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavProjects({
  projects
}) {
  const { isMobile } = useSidebar()

  return (
    (<SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Explore</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
           
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem className="mt-8">
          <SidebarMenuButton tooltip={'FeedBack'}>
                  {MessageSquareQuote  && <MessageSquareQuote  />}
                  <span>{"FeedBack"}</span>
        </SidebarMenuButton>
        <SidebarMenuButton tooltip={'Help'}>
                  {MessageCircleQuestion   && <MessageCircleQuestion    />}
                  <span>{"Help"}</span>
        </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>)
  );
}
