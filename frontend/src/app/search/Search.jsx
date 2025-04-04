import axiosInstance from "@/axiosInstance";
import { SidebarInset } from "@/components/ui/sidebar";
import { PlayIcon, ListCollapse, HeartIcon, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get("query") || "";
  const categoryParam = searchParams.get("category") || "";
  const [search, setSearch] = useState(searchParam);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handlePlaylist = (e) => {
    setSearch(e.target.value);
  };

  const fetchPlaylists = async (category, search, sort) => {
    try {
      const params = {};
      if (category) params.category = category.toLowerCase();
      if (search) params.search = search.toLowerCase();
      if (sort) params.sort = sort.toLowerCase();
      setLoading(true);
      console.log(params);
      const response = await axiosInstance.get("/playlist/allplaylists", {
        params,
      });
      console.log(response.data.data);
      setPlaylists(response.data.data);
      setLoading(false);
    } catch (error) {
      setError(error);
    }
  };

  // ✅ Query param change hote hi fetchPlaylists() chale
  console.log(searchParam);
  console.log(categoryParam);
  useEffect(() => {
    fetchPlaylists(categoryParam, searchParam);
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      setSearchParams({ query: search }); // ✅ URL update karega bina reload kiye
    }
  };

  return (
    <SidebarInset>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div>
          <p className="md:text-4xl text-2xl font-semibold">Search Result</p>
        </div>

        <div className="grid auto-rows-min gap-4 mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {playlists.length > 0 &&
            playlists.map((playlist) => (
              <Link to={`/playlists/${playlist._id}`} key={playlist._id}>
                <div className="w-[100%] md:w-[90%]">
                  <div className="w-full aspect-video group rounded cursor-pointer relative overflow-hidden ">
                    <img
                      src="https://plus.unsplash.com/premium_photo-1699025726754-8da11fa3fb58?q=80&w=1971&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="random"
                      className="object-cover w-full rounded h-full group-hover:opacity-85 transition-all duration-300 ease-in-out"
                    />

                    <div className="rounded-full bg-black bg-opacity-50 w-10 h-10 justify-center items-center absolute top-2 right-16 flex opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out">
                      <HeartIcon className="text-white" />
                    </div>

                    <div className="rounded-full bg-black bg-opacity-50 w-10 h-10 justify-center items-center absolute top-2 right-2 flex opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out">
                      <Share2 className="text-white" />
                    </div>

                    <div className="absolute bottom-2 left-2 right-0 px-3 py-1 font-bold text-white/85 text-md uppercase w-fit bg-black bg-opacity-80 rounded-full opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out">
                      {playlist.category}
                    </div>
                  </div>

                  <div className="pt-2 flex gap-4 bg-black bg-opacity-50 rounded-b-xl">
                    <div>
                      <img
                        src={`${playlist.user?.profilePic}`}
                        width={62}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <p className="text-md line-clamp-1 text-white/90 font-bold capitalize">
                        {playlist.name}
                      </p>
                      <p className="text-white/60 text-sm capitalize">
                        {playlist.user?.username}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </SidebarInset>
  );
}
