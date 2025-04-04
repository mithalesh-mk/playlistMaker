import {
  MessageCircleQuestion,
  MessageSquareQuote,
  ListPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import axiosInstance from "@/axiosInstance";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";

export function NavProjects({ projects }) {
  const [inputValue, setInputValue] = useState({
    name: "",
    description: "",
    category: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const closeRef = useRef(null);

  const handleChange = (e) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    if (
      inputValue.name === "" ||
      inputValue.description === "" ||
      inputValue.category === ""
    ) {
      setError("Please fill in all fields");
      return;
    }

    try {
      // Call API to create playlist
      const resp = await axiosInstance.post(
        "/playlist/addplaylist",
        inputValue
      );

      const playlistData = resp.data;
      console.log(playlistData);
      if (playlistData.success) {
        console.log(playlistData.data);
        toast({
          description: "Playlist created successfully",
        });
        navigate(`/playlists/${playlistData.data._id}`);
        closeRef.current?.click(console.log("Playlist created successfully"));
      } else {
        setError("Failed to create playlist");
        console.log("Playlist not created");
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Explore</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link to={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem className="mt-8 ">
          <SidebarMenuButton tooltip={"FeedBack"}>
            {MessageSquareQuote && <MessageSquareQuote />}
            <Link to={"/feedback"}>
              <span>{"FeedBack"}</span>
            </Link>
          </SidebarMenuButton>
          <Link Link to={"/help"}>
            <SidebarMenuButton tooltip={"Help"}>
              {MessageCircleQuestion && <MessageCircleQuestion />}
              <span>{"Help"}</span>
            </SidebarMenuButton>
          </Link>

          <Dialog>
            <DialogTrigger asChild>
              <SidebarMenuButton
                tooltip={"Create Playlist"}
                onClick={() => {
                  setError(false);
                  setInputValue({ name: "", description: "", category: "" });
                }}
              >
                <ListPlus />
                <span>{"Create Playlist"}</span>
              </SidebarMenuButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Playlist</DialogTitle>
                {error && (
                  <DialogDescription className="text-red-500">
                    {error}
                  </DialogDescription>
                )}
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={inputValue.name}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    value={inputValue.description}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <select
                    id="category"
                    name="category"
                    value={inputValue.category}
                    onChange={handleChange}
                    className="col-span-3 dark:text-white outline-none rounded p-1 dark:bg-black border "
                  >
                    <option value="">Choose a Category</option>
                    <option value="education">Eductaion</option>
                    <option value="music">Music</option>
                    <option value="travel">Travel</option>
                    <option value="series">Series</option>
                    <option value="other">Others</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreate}>Create</Button>
                <DialogClose ref={closeRef}></DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
