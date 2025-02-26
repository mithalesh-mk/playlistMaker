import axiosInstance from "@/axiosInstance";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  PlusCircleIcon,
  ListPlus,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Label } from "@radix-ui/react-dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const Playlist = () => {
  const { playlistId } = useParams();
  const [error, setError] = useState("");
  const closeRef = useRef(null);
  const [link, setLink] = useState("");

  const [data, setData] = useState({
    title: "",
    description: "",
    likes: 0,
    dislikes: 0,
    shares: 0,
    category: "",
    videos: [],
  });

  //Getting Playlist by playlist ID
  const fetchPlaylist = async () => {
    try {
      const response = await axiosInstance.get(
        `/playlist/getplaylist/${playlistId}`
      );
      const data = response.data;
      console.log(data);
      setData({
        title: data.name,
        description: data.description,
        likes: data.likes.length,
        dislikes: data.dislikes.length,
        shares: data.shares,
        category: data.category,
        videos: data.videos,
        isOwner: data.isOwner,
      });
      console.log(data);
      fetVideos();
    } catch (error) {
      console.log(error);
    }
  };

  //Getting videos of current Playlist
  const fetVideos = async () => {
    const resp = await axiosInstance.get(
      `/video/getvideo/${playlistId}/videos`
    );
    const videos = resp.data;
    setData((prev) => ({ ...prev, videos: videos.data }));
  };

  console.log(data);

  useEffect(() => {
    fetchPlaylist();
  }, [playlistId]);

  const handleCreate = async () => {
    if (link === "") {
      setError("Please fill in all fields");
      return;
    }

    try {
      // Call API to create playlist
      const resp = await axiosInstance.post(`/video/addvideo/${playlistId}`, {
        url: link,
      });

      const videoData = resp.data;

      if (videoData.success) {
        console.log(videoData.data);
        toast({
          description: "video added successfully",
        });
        fetVideos();

        closeRef.current?.click(console.log("video added"));
      } else {
        setError("failed to add video");
        console.log("video not added");
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col w-[95%] max-h-[94vh] sm:w-[85%] lg:w-[80%] rounded-t-lg mx-auto gap-4 border-t-2 border-l-2 border-r-2 p-4 ">
      <div className="flex gap-4 relative flex-col lg:flex-row pb-3 border-b">
        <div className="w-66 sm:w-96 rounded-md">
          <img src="/playlist.jpeg" alt="playlist" />
          <div className="mt-4 flex gap-4 items-center justify-start">
            <p className="flex gap-1 items-center">
              <span>{data.likes}</span> <ThumbsUp size={18} className="mb-1" />
            </p>
            <p className="flex gap-1 items-center">
              <span>{data.dislikes}</span>{" "}
              <ThumbsDown size={18} className="mt-1" />
            </p>
            <p className="flex gap-1 items-center">
              <span>{data.shares}</span> <Share2 size={18} />{" "}
            </p>
            <p className="rounded-full bg-slate-800 border border-white/20 px-4 py-[2px]">
              {data.category}
            </p>
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-semibold">{data.title}</h1>
          <p className="text-[.89rem] text-white/80 font-thin mt-4">
            {data.description}
          </p>
        </div>
        <PlusCircleIcon className="absolute bottom-5 right-5 block sm:hidden" />

        <Dialog>
          <DialogTrigger asChild>
            {data.isOwner && (
              <Button
                onClick={() => {
                  setError(false);
                  setLink("");
                }}
                className="absolute bottom-5 right-5 hidden sm:block"
              >
                Add Videos
              </Button>
            )}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Paste Link</DialogTitle>
              {error && (
                <DialogDescription className="text-red-500">
                  {error}
                </DialogDescription>
              )}
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Link
                </Label>
                <Input
                  id="link"
                  name="link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate}>Create</Button>
              <DialogClose ref={closeRef}></DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Bookmark className="absolute top-5 right-5" />
      </div>
      <div className="scrollbar-hide overflow-y-auto">
        <h1 className="mt-3 font-bold text-4xl">Vidoes</h1>
        <div className="h-[100vh] mt-6 p-4 flex flex-col gap-5  justify-start items-center w-[90%] mx-auto">
          {data.videos.length > 0 ? (
            data.videos.map((video) => (
              <div
                key={video._id}
                className=" w-full p-2 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer bg-white/10 backdrop-blur-lg border border-white/30 shadow-lg rounded-xl flex text-white"
              >
                <div className="w-[150px] overflow-hidden  rounded-lg">
                  <img
                    src={video.thumbnail}
                    className="w-full h-full object-cover"
                    alt={video.title}
                  />
                </div>
                <div className="w-[50%] pl-4">
                  <p className="text-md font-semibold">{video.title}</p>
                  <p className="line-clamp-2 text-sm">{video.description}</p>
                  <p className="text-sm">{video.views} views</p>
                </div>
                <div className="absolute right-4 top-4">
                  {data.isOwner && (
                    <Trash
                      size={24}
                      className="text-red-500 animate-shake"
                      onClick={() => console.log("edit")}
                    />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div>
              <p>No videos found</p>
              <Button>Add Videos</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Playlist;
