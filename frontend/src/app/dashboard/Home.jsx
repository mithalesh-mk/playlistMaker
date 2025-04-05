import axiosInstance from "@/axiosInstance";
import { SidebarInset } from "@/components/ui/sidebar";
import { HeartIcon, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import FeaturedList from "./FeaturedList";

export default function Home() {
  const [playlists, setPlaylists] = useState([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const categories = ["Education", "Music", "Travel", "Series", "Others"];

  const fetchPlaylists = async (category) => {
    try {
      const params = category ? { category: category.toLowerCase() } : {};
      const res = await axiosInstance.get("/playlist/random");
      const response = await axiosInstance.get("/playlist/allplaylists", {
        params,
      });
      const allPlaylists = response.data.data;
      setFeaturedPlaylists(res.data.data); // Top 5 featured playlists
      setPlaylists(allPlaylists);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  console.log("Playlists:", playlists);

  // Auto-switch featured playlist every 2 seconds

  return (
    <SidebarInset>
      <div className="flex flex-col gap-6 p-6 bg-[#0f0f0f] min-h-screen text-white">
        {/* Featured Playlist */}
        <div className="flex flex-col items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-200">
            Featured Playlists
          </h2>
          <FeaturedList featuredPlaylists={featuredPlaylists} />
        </div>

        {/* Explore Categories */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-200">
            Explore by Categories
          </h2>
          <div className="flex flex-wrap gap-3 mt-4">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => fetchPlaylists(category)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-full text-white font-semibold text-sm uppercase transition-all shadow-md"
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Other Playlists */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist, index) => (
            <PlaylistCard
              key={playlist._id}
              playlist={playlist}
              index={index}
            />
          ))}
        </div>
      </div>
    </SidebarInset>
  );
}

function PlaylistCard({ playlist, large }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div className="flex flex-col gap-4">
      <Link
        to={`/playlists/${playlist._id}`}
        className="group relative"
        onMouseEnter={() => setHovered(playlist._id)}
        onMouseLeave={() => setHovered(null)}
      >
        <div
          className={`relative rounded-lg overflow-hidden shadow-lg transition-transform duration-300 ${
            large ? "h-[350px]" : "h-[250px]"
          } group-hover:scale-105`}
        >
          <img
            src={playlist.thumbnail || "playlist.jpeg"}
            alt="Playlist Cover"
            className="w-full h-full object-cover"
          />
          {/* Floating buttons */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 bg-white bg-opacity-20 rounded-full backdrop-blur-md hover:bg-opacity-40">
              <HeartIcon className="w-6 h-6 text-white" />
            </button>
            <button className="p-2 bg-white bg-opacity-20 rounded-full backdrop-blur-md hover:bg-opacity-40">
              <Share2 className="w-6 h-6 text-white" />
            </button>
          </div>
          {/* Playlist Category */}
          <div className="absolute bottom-3 left-3 px-3 py-1 bg-black bg-opacity-50 rounded-lg text-white text-xs font-semibold">
            {playlist.category}
          </div>
        </div>

        {/* Playlist Details */}
        <div className="flex flex-col gap-2 p-2 bg-gray-900 rounded-lg shadow-lg transition-all group-hover:shadow-xl">
          <div className="flex items-center gap-3">
            <img
              src={playlist.user?.profilePic}
              className="w-10 h-10 rounded-full border border-gray-700"
              alt="User"
            />
            <div>
              <p className="text-md font-semibold truncate">{playlist.name}</p>
              <p className="text-xs text-gray-400">{playlist.user?.username}</p>
            </div>
          </div>
          <p className="text-sm text-gray-300 line-clamp-2">
            {playlist.description}
          </p>
          <div className="flex items-center gap-4 text-gray-400 text-xs">
            <span>{playlist.likes.length} Likes</span>
            <span>{playlist.videos.length} Videos</span>
          </div>
        </div>
      </Link>
      {hovered === playlist._id && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          onMouseEnter={() => setHovered(playlist._id)}
          onMouseLeave={() => setHovered(null)}
          className="absolute transform -translate-x-1/2 w-[280px] bg-gray-900 bg-opacity-80 backdrop-blur-md p-4 rounded-lg shadow-lg text-white text-sm"
        >
          <h3 className="text-lg font-semibold mb-2">{playlist.name}</h3>
          <p className="text-gray-400">{playlist.description}</p>
          <div className="flex justify-between mt-2 text-gray-300">
            <span>Videos: {playlist.videos.length}</span>
            <span>👍 {playlist.likes.length || 0} Likes</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
