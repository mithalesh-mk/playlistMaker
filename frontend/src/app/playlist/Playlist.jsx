import axiosInstance from '@/axiosInstance';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  BookmarkCheck,
  PlusCircleIcon,
  Trash,
  GripVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,

} from '@/components/ui/dialog';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from '@/components/ui/input';
import { SidebarMenuButton } from "@/components/ui/sidebar";

import { toast } from '@/hooks/use-toast';
import { useAuth } from "@clerk/clerk-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


const Playlist = () => {
  const { playlistId } = useParams();
  const [error, setError] = useState('');
  const closeRef = useRef(null);

  const [link, setLink] = useState("");
  const [isBookmark, setBookmark] = useState(false);


  const [data, setData] = useState({
    title: '',
    description: '',
    likes: 0,
    dislikes: 0,
    shares: 0,
    category: '',
    videos: [],
    isOwner: false,
  });

  // Fetch Playlist
  const fetchPlaylist = async () => {
    try {
      const response = await axiosInstance.get(
        `/playlist/getplaylist/${playlistId}`
      );
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

      fetVideos();

    } catch (error) {
      console.error(error);
    }
  };

  // Fetch Videos
  const fetchVideos = async () => {
    try {
      const resp = await axiosInstance.get(
        `/video/getvideo/${playlistId}/videos`
      );
      setData((prev) => ({ ...prev, videos: resp.data.data }));
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };


  //Checking is Current playlist is Bookmark
  const checkBookMark = async () => {
    try {
      const res = await axiosInstance.put(`/bookmark/bookmarks/${playlistId}`);
      if (!res.data.success) {
        console.log(res.data.message);
      }
      // console.log(res.data.data.isBookMark);
      setBookmark(res.data.data.isBookMark);
    } catch (error) {
      console.log(error);
    }
  };

  //Adding BookMark to current Playlist
  const addToBookMark = async () => {
    try {
      const res = await axiosInstance.post(`/bookmark/bookmarks/${playlistId}`);
      if (!res.data.success) {
        alert(res.data.message);
      } else {
        setBookmark(res.data.success); //Basically it is setBookmark(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Deleting current playlist from Bookmark
  const deleteBookMark = async () => {
    try {
      const res = await axiosInstance.delete(
        `/bookmark/bookmarks/${playlistId}`
      );
      if (!res.data.success) {
        alert(res.data.message);
      } else {
        setBookmark(false);
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    fetchPlaylist();
  }, [playlistId]);


  // Handle Create Video

  useEffect(() => {
    checkBookMark();
  }, [isBookmark]);


  const handleCreate = async () => {
    if (!link) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const resp = await axiosInstance.post(`/video/addvideo/${playlistId}`, {
        url: link,
      });

      if (resp.data.success) {
        toast({ description: 'Video added successfully' });
        fetchVideos();
        closeRef.current?.click();
      } else {
        setError('Failed to add video');
      }
    } catch (error) {
      console.error('Error adding video:', error);
      setError('An error occurred. Please try again.');
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
  
    setData((prev) => {
      const oldIndex = prev.videos.findIndex((v) => v._id === active.id);
      const newIndex = prev.videos.findIndex((v) => v._id === over.id);
  
      if (oldIndex === -1 || newIndex === -1) {
        console.error("Invalid indices for reordering");
        return prev;
      }
  
      const newVideos = arrayMove(prev.videos, oldIndex, newIndex);
  
      console.log("New Order:", newVideos.map((v) => v._id)); // Debugging
  
      updateVideoOrder(newVideos);
  
      return { ...prev, videos: newVideos };
    });
  };
  

  // Function to send updated order to backend
  const updateVideoOrder = async (newVideos) => {
    try {
      const newOrder = newVideos.map((video) => video._id);
      const response = await axiosInstance.put(`/playlist/updateOrder/${playlistId}`, { newOrder });
  
      if (response.data.success) {
        toast({ description: "Playlist order updated!" });
  
      } else {
        toast({ description: "Failed to update order", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error updating playlist order:", error);
      toast({ description: "Failed to update order", variant: "destructive" });
    }
  };
  

  const SortableVideo = ({ video }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: video._id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
      <li
        ref={setNodeRef}
        style={style}
        className="w-full p-2 bg-white/10 backdrop-blur-lg border border-white/30 shadow-lg rounded-xl flex text-white relative items-center"
      >
        {/* Thumbnail */}
        <div className="w-[150px] overflow-hidden rounded-lg">
          <img
            src={video.thumbnail}
            className="w-full h-full object-cover"
            alt={video.title}
          />
        </div>

        {/* Video Details */}
        <div className="w-[50%] pl-4">
          <p className="text-md font-semibold">{video.title}</p>
          <p className="text-sm">{video.views} views</p>
        </div>

        {/* Drag Handle */}
        {data.isOwner && (
          <button
            {...attributes}
            {...listeners}
            className="absolute left-[-25px] top-1/2 transform -translate-y-1/2 cursor-grab"
          >
            <GripVertical
              size={24}
              className="text-gray-300 hover:text-gray-500"
            />
          </button>
        )}

        {/* Delete Button */}
        {data.isOwner && (
          <Trash
            size={24}
            className="text-red-500 cursor-pointer absolute right-4"
          />
        )}
      </li>
    );
  };

  return (
    <div className="flex flex-col w-[95%] max-h-[94vh] sm:w-[85%] lg:w-[80%] rounded-t-lg mx-auto gap-4 border-t-2 border-l-2 border-r-2 p-4">
      <div className="flex gap-4 relative flex-col lg:flex-row pb-3 border-b">
        <div className="w-66 sm:w-96 rounded-md">
          <img src="/playlist.jpeg" alt="playlist" />
          <div className="mt-4 flex gap-4 items-center">
            <p className="flex gap-1 items-center">
              <span>{data.likes}</span> <ThumbsUp size={18} />
            </p>
            <p className="flex gap-1 items-center">
              <span>{data.dislikes}</span> <ThumbsDown size={18} />
            </p>
            <p className="flex gap-1 items-center">
              <span>{data.shares}</span> <Share2 size={18} />
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
        {isBookmark && (
          <BookmarkCheck
            className="absolute top-5 right-5"
            onClick={() => {
              deleteBookMark();
            }}
          />
        )}
        {!isBookmark && (
          <Bookmark
            className="absolute top-5 right-5"
            onClick={() => {
              addToBookMark();
            }}
          />
        )}
      </div>

      <h1 className="mt-3 font-bold text-4xl">Videos</h1>
      {/* Videos List */}
      <div className="flex flex-col w-[95%] max-h-[94vh] scrollbar-hide overflow-y-auto sm:w-[85%] lg:w-[80%] mx-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={data.videos.map((v) => v._id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="h-[100vh] mt-6 p-4 flex flex-col gap-5 items-center w-[90%] mx-auto">
              {data.videos.length > 0 ? (
                data.videos.map((video) => (
                  <SortableVideo key={video._id} video={video} />
                ))
              ) : (
                <p>No videos found</p>
              )}
            </ul>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default Playlist;
