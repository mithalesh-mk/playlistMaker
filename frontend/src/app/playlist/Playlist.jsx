import axiosInstance from '@/axiosInstance';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  BookmarkCheck,
  PlusCircleIcon,
  Trash,
  GripVertical,
  X,
  CircleX,
} from 'lucide-react';
import { BiSolidDislike, BiSolidLike } from 'react-icons/bi';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
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
import Comments from '../comments/Comments';

import { IoShareOutline } from 'react-icons/io5';
import {
  FaWhatsapp,
  FaFacebook,
  FaXTwitter,
  FaEnvelope,
  FaLink,
  FaPlugCirclePlus,
  FaCirclePlus,
  FaX,
} from 'react-icons/fa6';
import {
  FaDiscord,
  FaPlus,
  FaPlusCircle,
  FaTelegramPlane,
  FaVideo,
} from 'react-icons/fa';
import CommentModal from './CommentModal';
import { useAuth } from '@/userContext/AuthProvider';
import PlaylistLoading from './playlistLoading';
import { Heart } from 'lucide-react';
import ReactPlayer from 'react-player/youtube';
import { VideoChat } from '@mui/icons-material';

const ShareButton = ({ shareableLink }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(shareableLink);
    alert('Link copied to clipboard!');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1 text-gray-300 hover:text-white">
          <IoShareOutline size={18} /> Share
        </button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Share Playlist</DialogTitle>
        </DialogHeader>
        <div className="flex md:gap-8 gap-4 justify-center mt-2 pt-4">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              shareableLink
            )}`}
            className="flex items-center justify-center flex-col"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp className="text-green-500 md:w-12 md:h-12 h-8 w-8" />
            <p className="text-white/80 text-base md:text-lg">Whatsapp</p>
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(
              shareableLink
            )}}`}
            className="flex items-center justify-center flex-col"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTelegramPlane className=" text-blue-500 md:w-12 md:h-12 h-8 w-8" />
            <p className="text-white/80 text-base md:text-lg">Telegram</p>
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              shareableLink
            )}`}
            className="flex items-center justify-center flex-col"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaXTwitter className="text-black md:w-12 md:h-12 h-8 w-8" />
            <p className="text-white/80 text-base md:text-lg">X</p>
          </a>
          <a
            href={`https://discord.com/channels/@me/?text=${encodeURIComponent(
              shareableLink
            )}`}
            className="flex items-center justify-center flex-col"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaDiscord className=" text-indigo-500 md:w-12 md:h-12 h-8 w-8" />
            <p className="text-white/80 text-base md:text-lg">Discord</p>
          </a>
        </div>
        <div className="flex items-center mt-4 border p-2 rounded-md">
          <input
            type="text"
            value={shareableLink}
            readOnly
            className="flex-1 bg-transparent outline-none text-white"
          />
          <button onClick={handleCopy} className="ml-2 text-blue-500">
            <FaLink size={20} />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Playlist = () => {
  const { playlistId } = useParams();
  const [error, setError] = useState('');
  const closeRef = useRef(null);
  const [link, setLink] = useState('');
  const [isBookmark, setBookmark] = useState(false);
  const [noOfLikes, setNoOfLikes] = useState(0);
  const [noOfDislike, setNoOfDislikes] = useState(0);
  const [newOrder, setNewOrder] = useState([]);
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

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [playVideo, setPlayVideo] = useState('');
  const [showPlayer, setShowPlayer] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(''); 

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { user } = useAuth();

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/video/getvideo/${playlistId}/videos`
      );
      const data = response.data;
      console.log(data, 'alpha');
      setData((prev) => ({ ...prev, videos: data.data }));
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };


  // Fetch Playlist and other functions remain unchanged
  const fetchPlaylist = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/playlist/getplaylist/${playlistId}`
      );
      const data = response.data;
      console.log(data, 'beta');

      setData({
        title: data.name,
        description: data.description,
        likes: data.likes.length,
        dislikes: data.dislikes.length,
        likeDetails: data.likes,
        dislikeDetails: data.dislikes,
        shares: data.shares,
        category: data.category,
        videos: data.videos,
        isOwner: data.isOwner, 
        thumbnail: data.thumbnail,
        ownerDetails: data.user,
      });
      setNoOfLikes(data.likes.length);
      setNoOfDislikes(data.dislikes.length);
      fetchVideos();
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [playlistId]);

  console.log(data);

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
      if (res.data.success){
        setBookmark(true);
        toast({
          description: (
            <>
              <strong>{data.title}</strong> added to bookmarks!
            </>
          ),
          duration: 2000,
        })
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBookMark = async () => {
    try {
      const res = await axiosInstance.delete(
        `/bookmark/bookmarks/${playlistId}`
      );
      if (res.data.success){
        setBookmark(false);
        toast({
          description: (
            <>
              <strong>{data.title}</strong> removed from bookmarks!
            </>
          ),
          duration: 2000,
        })
      }
    } catch (error) {
      console.log(error);
    }
  };

  const functionLike = async () => {
    try {
      const res = await axiosInstance.post(`playlist/${playlistId}/like`);
      fetchPlaylist();
      setNoOfLikes(res.data.data.likes);
      setNoOfDislikes(res.data.data.dislikes);
    } catch (error) {
      console.log(error);
    }
  };

  

  const functionDislike = async () => {
    try {
      const res = await axiosInstance.post(`playlist/${playlistId}/dislike`);
      fetchPlaylist();
      setNoOfLikes(res.data.data.likes);
      setNoOfDislikes(res.data.data.dislikes);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteVideo = async (link) => {
    try {
      const res = await axiosInstance.delete(
        `/video/deletevideo/${playlistId}`,
        {
          data: { url: link },
        }
      );
      toast({ description: `${res.data.message}` });
      fetchVideos();
      setShowDelete((prev) => ({ ...prev, [link]: false }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreate = async () => {
    if (!link) {
      setError('Please enter a video URL');
      return;
    }
    try {
      const resp = await axiosInstance.post(`/video/addvideo/${playlistId}`, {
        url: link,
      });
      if (resp.data.success) {
        toast({ description: 'Video added successfully' });
        fetchVideos();
        setLink('');
        closeRef.current?.click();
      } else {
        setError('Failed to add video');
      }
    } catch (error) {
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
      const newVideos = arrayMove(prev.videos, oldIndex, newIndex);
      setNewOrder(newVideos);
      return { ...prev, videos: newVideos };
    });
  };

  const updateVideoOrder = async (newVideos) => {
    try {
      const newOrder = newVideos.map((video) => video._id);
      const response = await axiosInstance.put(
        `/playlist/updateOrder/${playlistId}`,
        { newOrder }
      );
      if (!response.data.success) {
        toast({
          description: 'Failed to update order',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({ description: 'Failed to update order', variant: 'destructive' });
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

  const [showDelete, setShowDelete] = useState({});

  const handleSetShowDelete = (url) => {
    setShowDelete((prev) => ({ ...prev, [url]: !prev[url] }));
  };

  const SortableVideo = ({ video, index }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: video._id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    
    return (
      <li
        ref={setNodeRef}
        style={style}
        className={`flex items-center p-2 relative  rounded-md transition-colors ${videoPlaying===index ? 'bg-gray-600' : 'bg-gray-900 hover:bg-gray-800'}`}
      >
        {data.isOwner && (
          <button
          {...attributes}
          {...listeners}
          className="text-gray-400 hover:text-white p-2"
        >
          <GripVertical size={18} />
        </button>
        )}
        <Link to={''} className="flex items-center w-full" onClick={()=> {
          setPlayVideo(video.url)
          setVideoPlaying(index)
          setShowPlayer(true)}
          
         } >
          <span className="text-gray-400 w-8 text-center">{index + 1}</span>
          <div className="w-24 h-14 flex-shrink-0">
            <img
              src={video.thumbnail}
              onLoad={() => setLoaded(true)}
              className={`w-full h-full object-cover rounded-md transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
              alt={video.title}
            />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-white text-sm font-medium line-clamp-2">
              {video.title}
            </p>
            <p className="text-gray-400 text-xs">{video.views} views</p>
          </div>
        </Link>

        {data.isOwner && (
          <>
            
            <Trash
              size={18}
              className="text-red-500 cursor-pointer hover:text-red-400 ml-2"
              onClick={() => handleSetShowDelete(video.url)}
            />
            {showDelete[video.url] && (
              <div className="ml-2 absolute -top-16 right-0 bg-gray-700 p-2 rounded-md">
                <p className="text-white text-sm mb-2">
                  Are you sure you want to delete?
                </p>
                <Button
                  onClick={() => deleteVideo(video.url)}
                  className="bg-red-600 hover:bg-red-800 mr-4"
                >
                  Yes
                </Button>
                <Button
                  onClick={() => handleSetShowDelete(video.url)}
                  className="hover:text-gray-400 text-black"
                >
                  No
                </Button>
              </div>
            )}
          </>
        )}
      </li>
    );
  };

  return (
    <div className="w-full h-[calc(100vh-500px)]  bg-dark text-white flex flex-col xl:flex-row gap-4 p-4">
      {/* Left Section: Thumbnail and Playlist Info */}
      <div className="xl:w-1/3 w-full flex-shrink-0 xl:sticky md:top-4">
        <div className="bg-gray-900 xl:h-[calc(100vh-100px)] rounded-2xl p-5 shadow-lg">
          {/* Thumbnail */}
          {
            showPlayer ? (
              <div className="w-full h-auto relative mx-2 my-3 rounded-xl overflow-hidden">
                {/* Close Button - Top Right */}
                <CircleX
                  size={36}
                  className="absolute top-3 right-3 text-white cursor-pointer hover:text-red-600 z-10"
                  onClick={() => setShowPlayer(false)}
                />

                {/* Video Player */}
                <div className="aspect-video w-full rounded-xl overflow-hidden">
                  <ReactPlayer
                    url={playVideo}
                    controls={true}
                    playing={true}
                    width="100%"
                    height="100%"
                    className="react-player"
                  />
                </div>
              </div>
            ) : (
              <img
                src={data?.thumbnail || data?.videos[0]?.thumbnail || '/default_image.png'}
                alt="playlist"
                className="w-full h-auto object-cover aspect-video rounded-xl mb-5 border border-gray-700"
              />
            )
          }
          
          {/* Action Buttons */}

          <div className="flex items-center justify-between gap-5">
            {/* Like Button */}
            <div className="flex items-center gap-5 mb-6">
              <button
                onClick={functionLike}
                className="flex flex-row justify-center items-center gap-2 text-gray-400 hover:text-white transition"
              >
                {data.likeDetails?.some((like) => like.email === user.email) ? (
                  <Heart size={24} fill="red" stroke='red' />
                ) : (
                  <Heart size={24} />
                )}
                <span className="text-md">{noOfLikes}</span>
              </button>
              {/* Dislike Button */}
              <button
                onClick={functionDislike}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition"
              >
                {data.dislikeDetails?.some(
                  (dislike) => dislike.email === user.email
                ) ? (
                  <BiSolidDislike size={24} fill="white" />
                ) : (
                  <BiSolidDislike size={24} />
                )}
                <span className="text-sm">{noOfDislike}</span>
              </button>

              {/* Share Button */}

              <ShareButton
                shareableLink={`http://localhost:5173/playlists/${playlistId}`}
              />

              {/* Bookmark Button */}
              <button
                onClick={isBookmark ? deleteBookMark : addToBookMark}
                className="text-gray-400 hover:text-white transition"
              >
                {isBookmark ? (
                  <Bookmark size={24} stroke="yello" fill='yellow' />
                ) : (
                  <Bookmark size={24} />
                )}
              </button>
            </div>

            {/* owner detail */}

            {/* Add Video (if Owner) */}
            {data.isOwner && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="">
                    <FaPlus className="w-6 h-6 text-black" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 text-white rounded-xl p-6">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold mb-4">
                      Add a Video
                    </DialogTitle>
                    {error && (
                      <DialogDescription className="text-red-500 mb-2">
                        {error}
                      </DialogDescription>
                    )}
                  </DialogHeader>
                  <Input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Paste video URL"
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                  <DialogFooter className="flex justify-end mt-4 gap-2">
                    <Button
                      onClick={handleCreate}
                      className="bg-green-600 hover:bg-green-700 transition rounded-lg px-4 py-2"
                    >
                      Add
                    </Button>
                    <DialogClose
                      ref={closeRef}
                      className="bg-gray-600 hover:bg-gray-700 transition rounded-lg px-4 py-2"
                    >
                      Cancel
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="flex items-center gap-2 mb-6">
            <img
              src={data.ownerDetails?.profilePic || data.ownerDetails?.username}
              alt="Owner"
              className="w-8 h-8 rounded-full border border-gray-700"
            />
            <p className="text-lg text-gray-400">
              {data.ownerDetails?.username || 'Unknown Owner'}
            </p>
          </div>
          {/* Playlist Info */}
          <h1 className="text-2xl font-bold mb-3 text-white">{data.title}</h1>
          {/* Category */}
          <p className="text-gray-400 text-sm mb-6 uppercase">
            {data.category}
          </p>
          <p className="text-gray-400 text-sm mb-5 line-clamp-3 leading-relaxed">
            {data.description}
          </p>
        </div>

         <p
            className="text-gray-400 relative right-4 bottom-8 text-end text-sm hover:text-white hover:underline cursor-pointer mb-4"
            onClick={handleOpen}
          >
            View Comments
          </p>
      </div>

      {/* Right Section: Video List */}
      <div className="xl:w-2/3 h-[calc(100vh-100px)] overflow-hidden w-full  overflow-y-auto">
        <div className=" rounded-lg p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold mb-4">
              Videos ({data.videos.length})
            </h2>
          </div>

          {/*Comments */}
         

          <CommentModal
            open={open}
            setOpen={setOpen}
            handleClose={handleClose}
          />
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
                    <SortableVideo
                      key={video._id}
                      video={video}
                      index={index}
                    />
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">
                    No videos in this playlist
                  </p>
                )}
              </ul>
            </SortableContext>
          </DndContext>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Playlist;
