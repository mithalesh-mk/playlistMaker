import * as React from "react"
import { ChevronsUpDown, Plus,TvMinimalPlay } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"


export function TeamSwitcher() {
  const { isMobile } = useSidebar()

  return (
    (<SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              >
              <div
                className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                <svg width="1030" height="981" viewBox="0 0 1030 981" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M809 240L667 576.5C560.6 415.46 447 307.067 403.5 273C529.1 423.8 693.167 735.5 759.5 872.5L1030 240H809Z" fill="#FF0000"/>
                <path d="M712.5 981H492C238.4 301.8 58.3333 44 0 0C399.2 235.2 641.333 752 712.5 981Z" fill="#FF0000"/>
                <path d="M795.5 788L676.5 554.5L713 467.5L834 698L795.5 788Z" fill="#A60000"/>
                </svg>

              </div>
              <div className="grid flex-1 text-left text-md leading-tight">
                <span className="truncate font-semibold ml-1 mt-2">
                  Vessel
                </span>
                
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          {/* <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Teams
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem key={team.name} onClick={() => setActiveTeam(team)} className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <team.logo className="size-4 shrink-0" />
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div
                className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent> */}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>)
  );
}
