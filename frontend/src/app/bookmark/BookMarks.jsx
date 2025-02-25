import axiosInstance from "@/axiosInstance";
import { Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { MdEditNote } from "react-icons/md";
import { Link } from "react-router-dom";

const BookMarks = () => {
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axiosInstance.get("/bookmark/bookmarks");
        const data = await response.data;
        console.log(data);
        if (data.success) {
          setPlaylists(data.data);
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

  if (playlists.length == 0) return <h1>No Playlist</h1>;

  return (
    <div className="flex flex-col gap-6 mt-20">
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {playlists.map((playlist) => (
        <div
          to={`/playlists/${playlist._id}`}
          key={playlist._id}
          className="cursor-pointer sm:w-[85%] lg:w-[80%] xl:w-[60%] flex gap-6 mx-auto border justify-between p-3 rounded-xl border-muted"
        >
          <Link
            to={`/playlists/${playlist._id}`}
            key={playlist._id}
            className="w-full"
          >
            <div className="flex gap-4">
              <div className="rounded-lg w-[150px] overflow-hidden">
                <img
                  src="/playlist.jpeg"
                  alt={playlist?.name || "Playlist"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl">{playlist.name}</h2>
                <p className="text-sm font-thin">{playlist.description}</p>
                <p className="text-sm font-thin">
                  Vieos: {playlist.videos.length}
                </p>
              </div>
            </div>
          </Link>
          {/* <div className="flex flex-col gap-4 p-2">
            <MdEditNote
              size={32}
              className="text-gray-600 animate-shake"
              onClick={() => console.log("edit")}
            />
            <Trash
              size={24}
              className="text-red-500 animate-shake"
              onClick={() => console.log("edit")}
            />
          </div> */}
        </div>
      ))}
    </div>
    // <h1>Hello world</h1>
  );
};

export default BookMarks;
