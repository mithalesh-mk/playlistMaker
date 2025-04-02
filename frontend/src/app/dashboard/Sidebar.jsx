import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

export default function Sidebar({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handlePlaylist = (e) => {
    setSearch(e.target.value);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 transition-all ease-linear">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-grow justify-center">
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
                <AiOutlineSearch className="text-white text-xl" />
              </button>
            </div>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
