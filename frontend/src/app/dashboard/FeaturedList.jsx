import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HeartIcon, Share2 } from "lucide-react";
import { Loader2, Trash2 } from "lucide-react";
import { MdOutlineVideoLibrary } from "react-icons/md";


const Carousel = ({ featuredPlaylists = [] }) => {
  const [index, setIndex] = useState(1);

  useEffect(() => {
    if (featuredPlaylists.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % featuredPlaylists.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [featuredPlaylists.length]);

  if (featuredPlaylists.length === 0) {
    return <p className="text-center text-gray-500"> <Loader2 /> </p>;
  }

  return (
    <div className="relative w-full flex justify-center items-center px-4 sm:px-6 lg:px-8 py-10 md:py-20 overflow-hidden ">
      <div className="w-full max-w-[calc(100vw-1rem)] lg:max-w-[calc(100vw-280px)] xl:max-w-[1000px] h-[400px] sm:h-[500px] md:h-[450px] lg:h-[400px] relative">
        {featuredPlaylists.map((playlist, i) => {
          const position = (i - index + featuredPlaylists.length) % featuredPlaylists.length;

          let scale = 0.8;
          let translateX = "0%";
          let zIndex = 0;
          let opacity = 0.6;

          if (position === 0) {
            scale = 1;
            zIndex = 10;
            opacity = 1;
          } else if (position === 1 || position === featuredPlaylists.length - 1) {
            scale = 0.8;
            translateX = position === 1 ? "30%" : "-30%";
            zIndex = 5;
          } else {
            scale = 0.6;
            translateX = position === 2 ? "50%" : "-50%";
            zIndex = 1;
          }

          return (
            <motion.div
              key={playlist._id}
              className="absolute w-full h-full rounded-lg flex items-center justify-center text-white font-bold"
              style={{ zIndex }}
              animate={{ scale, x: translateX, opacity }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <Link
                to={`/playlists/${playlist._id}`}
                className="w-full h-auto flex flex-col md:flex-row sm:flex-row bg-[#0f0f0f] rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
              >
                {/* Playlist Cover Image */}
                <div className="w-full sm:w-1/2">
                  <img
                    src={playlist.thumbnail || "playlist.jpeg"}
                    alt="Playlist Cover"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Playlist Details */}
                <div className="flex flex-col justify-between p-4 sm:p-6 w-full sm:w-1/2 bg-[#161616] text-white">
                  {/* Title and User Info */}
                  <div>
                    <h2 className="lg:text-2xl text-lg sm:text-xl font-semibold truncate">{playlist.name}</h2>
                    <hr></hr>
                    <div className="flex items-center mt-2">
                      <img
                        src={playlist.user?.profilePic}
                        className="lg:h-20 lg:w-auto w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-700"
                        alt="User"
                      />
                      <p className="lg:text-xl lg:mx-5 text-xs sm:text-sm text-gray-400 truncate">{playlist.user?.username}</p>
                    </div>

                    {/* Category and Date */}
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                        {playlist.category}
                      </span>
                      <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                        Created: {new Date(playlist.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-gray-300 mt-4 line-clamp-2 sm:line-clamp-2">
                      {playlist.description}
                    </p>
                  </div>

                  {/* Likes & Videos Count */}
                  <div className="flex items-center gap-3 sm:gap-4 mt-3">
                    <p className="lg:text-lg flex items-center gap-1 sm:text-lg text-gray-400"> <HeartIcon size={15} fill="red" stroke="red" /> : {playlist.likes.length} Likes</p>
                    <p className="lg:text-lg flex items-center gap-1 sm:text-lg text-gray-400"> <MdOutlineVideoLibrary fill="white" /> : {playlist.videos.length}</p>
                    
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;