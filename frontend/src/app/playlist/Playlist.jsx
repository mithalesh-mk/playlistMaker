import axiosInstance from "@/axiosInstance";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  BookmarkCheck,
  PlusCircleIcon,
  Trash,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Comments from "../comments/Comments";

const Playlist = () => {
  const { playlistId } = useParams();
  const [error, setError] = useState("");
  const closeRef = useRef(null);
  const [link, setLink] = useState("");
  const [isBookmark, setBookmark] = useState(false);
  const [noOfLikes, setNoOfLikes] = useState(0);
  const [noOfDislike, setNoOfDislikes] = useState(0);
  const [newOrder, setNewOrder] = useState([]);
  const [data, setData] = useState({
    title: "",
    description: "",
    likes: 0,
    dislikes: 0,
    shares: 0,
    category: "",
    videos: [],
    isOwner: false,
  });

  // Fetch Playlist and other functions remain unchanged
  const fetchPlaylist = async () => {
    try {
      const response = await axiosInstance.get(`/playlist/getplaylist/${playlistId}`);
      const data = response.data;
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
      setNoOfLikes(data.likes.length);
      setNoOfDislikes(data.dislikes.length);
      fetchVideos();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchVideos = async () => {
    try {
      const resp = await axiosInstance.get(`/video/getvideo/${playlistId}/videos`);
      setData((prev) => ({ ...prev, videos: resp.data.data }));
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const checkBookMark = async () => {
    try {
      const res = await axiosInstance.put(`/bookmark/bookmarks/${playlistId}`);
      setBookmark(res.data.data.isBookMark);
    } catch (error) {
      console.log(error);
    }
  };

  const addToBookMark = async () => {
    try {
      const res = await axiosInstance.post(`/bookmark/bookmarks/${playlistId}`);
      if (res.data.success) setBookmark(true);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBookMark = async () => {
    try {
      const res = await axiosInstance.delete(`/bookmark/bookmarks/${playlistId}`);
      if (res.data.success) setBookmark(false);
    } catch (error) {
      console.log(error);
    }
  };

  const functionLike = async () => {
    try {
      const res = await axiosInstance.post(`playlist/${playlistId}/like`);
      setNoOfLikes(res.data.data.likes);
      setNoOfDislikes(res.data.data.dislikes);
    } catch (error) {
      console.log(error);
    }
  };

  const functionDislike = async () => {
    try {
      const res = await axiosInstance.post(`playlist/${playlistId}/dislike`);
      setNoOfLikes(res.data.data.likes);
      setNoOfDislikes(res.data.data.dislikes);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteVideo = async (link) => {
    try {
      const res = await axiosInstance.delete(`/video/deletevideo/${playlistId}`, {
        data: { url: link },
      });
      toast({ description: `${res.data.message}` });
      fetchVideos();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreate = async () => {
    if (!link) {
      setError("Please enter a video URL");
      return;
    }
    try {
      const resp = await axiosInstance.post(`/video/addvideo/${playlistId}`, { url: link });
      if (resp.data.success) {
        toast({ description: "Video added successfully" });
        fetchVideos();
        setLink("");
        closeRef.current?.click();
      } else {
        setError("Failed to add video");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setData((prev) => {
      const oldIndex = prev.videos.findIndex((v) => v._id === active.id);
      const newIndex = prev.videos.findIndex((v) => v._id === over.id);
      const newVideos = arrayMove(prev.videos, oldIndex, newIndex);
      setNewOrder(newVideos);
      return { ...prev, videos: newVideos };
    });
  };

  const updateVideoOrder = async (newVideos) => {
    try {
      const newOrder = newVideos.map((video) => video._id);
      const response = await axiosInstance.put(`/playlist/updateOrder/${playlistId}`, { newOrder });
      if (!response.data.success) {
        toast({ description: "Failed to update order", variant: "destructive" });
      }
    } catch (error) {
      toast({ description: "Failed to update order", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchPlaylist();
    checkBookMark();
  }, []);

  useEffect(() => {
    if (newOrder.length === 0) return;
    updateVideoOrder(newOrder);
  }, [newOrder]);

  const SortableVideo = ({ video, index }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: video._id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
      <li
        ref={setNodeRef}
        style={style}
        className="flex items-center p-2 hover:bg-gray-800 rounded-md transition-colors"
      >
        <span className="text-gray-400 w-8 text-center">{index + 1}</span>
        <div className="w-24 h-14 flex-shrink-0">
          <img
            src={video.thumbnail}
            className="w-full h-full object-cover rounded-md"
            alt={video.title

}
          />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-white text-sm font-medium line-clamp-2">{video.title}</p>
          <p className="text-gray-400 text-xs">{video.views} views</p>
        </div>
        {data.isOwner && (
          <>
            <button {...attributes} {...listeners} className="text-gray-400 hover:text-white p-2">
              <GripVertical size={18} />
            </button>
            <Trash
              size={18}
              className="text-red-500 cursor-pointer hover:text-red-400 ml-2"
              onClick={() => deleteVideo(video.url)}
            />
          </>
        )}
      </li>
    );
  };

  return (
    <div className="w-full  bg-dark text-white flex flex-col lg:flex-row gap-4 p-4">
      {/* Left Section: Thumbnail and Playlist Info */}
      <div className="lg:w-1/3 w-full flex-shrink-0 lg:sticky lg:top-4 ">
        <div className={`bg-gray-800 h-[calc(100vh-100px)] rounded-lg p-4 `} 
        >
          <img
            src={data.videos[0]?.thumbnail || "/playlist.jpeg"}
            alt="playlist"
            className="w-full h-48 object-cover aspect-video rounded-md mb-4"
          />
          <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">{data.description}</p>
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={functionLike}
              className="flex items-center gap-1 text-gray-300 hover:text-white"
            >
              <ThumbsUp size={18} /> {noOfLikes}
            </button>
            <button
              onClick={functionDislike}
              className="flex items-center gap-1 text-gray-300 hover:text-white"
            >
              <ThumbsDown size={18} /> {noOfDislike}
            </button>
            <button className="flex items-center gap-1 text-gray-300 hover:text-white">
              <Share2 size={18} /> {data.shares}
            </button>
            <button
              onClick={isBookmark ? deleteBookMark : addToBookMark}
              className="text-gray-300 hover:text-white"
            >
              {isBookmark ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
          </div>
          <p className="text-gray-400 text-sm mb-4">{data.category}</p>
          {data.isOwner && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full ">
                  <PlusCircleIcon size={18} className="mr-2" /> Add Video
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 text-white">
                <DialogHeader>
                  <DialogTitle>Add a Video</DialogTitle>
                  {error && <DialogDescription className="text-red-500">{error}</DialogDescription>}
                </DialogHeader>
                <Input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="Paste video URL"
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <DialogFooter>
                  <Button onClick={handleCreate} className="">
                    Add
                  </Button>
                  <DialogClose ref={closeRef} />
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          <Dialog>
              <DialogTrigger asChild>
                <p className="text-gray-400 text-end text-sm mb-4 hover:text-white hover:underline cursor-pointer mt-4">
                  comments
                </p>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 text-white">
                <Comments/>
                
              </DialogContent>
            </Dialog>
        </div>
      </div>

      {/* Right Section: Video List */}
      <div className="lg:w-2/3  overflow-hidden w-full overflow-y-auto">
        <div className=" rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Videos ({data.videos.length})</h2>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={data.videos.map((v) => v._id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-2">
                {data.videos.length > 0 ? (
                  data.videos.map((video, index) => (
                    <SortableVideo key={video._id} video={video} index={index} />
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No videos in this playlist</p>
                )}
              </ul>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default Playlist;