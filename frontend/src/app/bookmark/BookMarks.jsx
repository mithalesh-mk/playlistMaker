import axiosInstance from "@/axiosInstance";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Trash2 } from "lucide-react"; // Import Trash icon
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { BookmarkCheck } from 'lucide-react';

const BookMarks = () => {
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(null);
  const [bookmark, setBookmark] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axiosInstance.get("/bookmark/bookmarks");
        const data = await response.data;
        if (data.success) {
          setPlaylists(data.data);
          console.log(data.data);
        } else {
          setError("Failed to fetch playlists");
        }
      } catch (error) {
        setError("Failed to fetch playlists");
      }
      setLoading(false);
    };

    fetchPlaylists();
  }, []);

  // Remove playlist from bookmarks
  const handleRemove = async (playlistId, playlistName) => {
    try {
      // Send DELETE request to remove bookmark
      await axiosInstance.delete(`/bookmark/bookmarks/${playlistId}`);
      setPlaylists(playlists.filter((playlist) => playlist._id !== playlistId)); // Update UI instantly
      toast({
        description: `${playlistName} removed from bookmarks`,
      });
    } catch (error) {
      console.error("Failed to remove playlist", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-28 w-full rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-20 text-red-400">{error}</div>;
  }

  if (playlists.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[100vh] xl:h-[calc(100vh-100px)]">
        <BookmarkCheck className="text-gray-700" size={400} />
        <p className="text-gray-200 text-lg mt-5">No playlists in bookmarks</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-6 text-white">
      <h1 className="text-center text-4xl font-extrabold mb-12 tracking-wide">Your Bookmarks</h1>
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        {playlists.map((playlist, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            key={playlist._id}
            className="relative cursor-pointer border border-gray-700 p-5 rounded-2xl bg-gray-800 bg-opacity-40 backdrop-blur-md shadow-2xl hover:shadow-xl hover:scale-105 transition-transform flex items-center gap-5"
            onMouseEnter={() => setHovered(playlist._id)}
            onMouseLeave={() => setHovered(null)}
          >
            <Link to={`/playlists/${playlist._id}`} className="flex gap-5 flex-1 items-center">
              <div className="rounded-lg w-[130px] h-[100px] overflow-hidden shadow-md">
                <img
                  src="/playlist.jpeg"
                  alt={playlist?.name || "Playlist"}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex flex-col flex-1">
                <h2 className="text-xl font-bold text-white truncate">{playlist.name}</h2>
                <p className="text-sm text-gray-300 line-clamp-2">{playlist.description}</p>
                <p className="text-sm text-gray-400 mt-1">🎬 {playlist.videos.length} Videos</p>
              </div>
            </Link>

            {/* Remove Button (Trash Icon) */}
            <button
              className="text-gray-400 hover:text-red-500 transition transform hover:scale-110"
              onClick={() => handleRemove(playlist._id, playlist.name)}
            >
              <Trash2 size={22} />
            </button>

            {/* Hover Popup */}
            {hovered === playlist._id && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-[-120px] left-1/2 transform -translate-x-1/2 w-[300px] bg-gray-900 bg-opacity-90 backdrop-blur-md p-4 rounded-lg shadow-lg text-white text-sm"
              >
                <h3 className="text-lg font-bold mb-2">{playlist.name}</h3>
                <p className="text-gray-400">{playlist.description}</p>
                <div className="flex justify-between mt-2 text-gray-300 text-sm">
                  <span>🎬 {playlist.videos.length} Videos</span>
                  <span>👍 {playlist.likes || 0} Likes</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BookMarks;
