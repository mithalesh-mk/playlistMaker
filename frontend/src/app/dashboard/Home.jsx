import axiosInstance from "@/axiosInstance";
import { SidebarInset } from "@/components/ui/sidebar";
import { PlayIcon, ListCollapse, HeartIcon, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [top2Data, setTop2Data] = useState([]);
  const categoies = ["Education", "Music", "Travel", "Series", "Others"];

  // const getPlaylists = async (category, search, sort) => {
  //   try {
  //     const params = {};
  //     if (category) params.category = category.toLowerCase();
  //     if (search) params.search = search.toLowerCase();
  //     if (sort) params.sort = sort.toLowerCase();
  //     const response = await axiosInstance.get("/playlist/allplaylists", {
  //       params,
  //     });
  //     if (response.data.success) {
  //       const allPlaylists = response.data.data;
  //       console.log(response.data.data);
  //       setTop2Data(allPlaylists.slice(0, 2)); // First 2 items
  //       setPlaylists(allPlaylists.slice(2)); // Rest of the items
  //     }
  //   } catch (error) {
  //     console.error("Error fetching playlists:", error);
  //   }
  // };

  const fetchPlaylists = async (category, search, sort) => {
    try {
      const params = {};
      if (category) params.category = category.toLowerCase();
      if (search) params.search = search.toLowerCase();
      if (sort) params.sort = sort.toLowerCase();
      setLoading(true);
      const response = await axiosInstance.get("/playlist/allplaylists", {
        params,
      });
      const allPlaylists = response.data.data;
      setTop2Data(allPlaylists.slice(0, 2)); // First 2 items
      setPlaylists(allPlaylists.slice(2)); // Rest of the items
      setLoading(false);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);
  return (
    <SidebarInset>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* First two playlist*/}
        <div className="grid auto-rows-min gap-4 grid-cols-1 xl:grid-cols-2">
          {top2Data.length > 0 &&
            top2Data.map((playlist) => {
              return (
                <Link to={`/playlists/${playlist._id}`}>
                  <div key={playlist._id} className="w-[100%] xl:w-[90%]">
                    <div className="w-full md:h-[400px] lg:h-[400px] xl:h-[450px]  group rounded cursor-pointer relative">
                      <img
                        src="https://plus.unsplash.com/premium_photo-1699025726754-8da11fa3fb58?q=80&w=1971&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="random"
                        className="object-cover w-full h-full rounded group-hover:opacity-85 transition-all duration-300 ease-in-out"
                      />

                      {/* Heart Icon */}
                      <div
                        className="rounded-full bg-black bg-opacity-50 w-10 h-10 justify-center items-center absolute top-2 right-16 
                                 flex opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out"
                      >
                        <HeartIcon className="text-white" />
                      </div>

                      {/* Share Icon */}
                      <div
                        className="rounded-full bg-black bg-opacity-50 w-10 h-10 justify-center items-center absolute top-2 right-2
                                 flex opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out"
                      >
                        <Share2 className="text-white" />
                      </div>

                      {/* Category Label */}
                      <div
                        className="absolute bottom-2 left-2 right-0 px-3 py-1 font-bold text-white/85 text-md uppercase w-fit 
                                  bg-black bg-opacity-80 rounded-full opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out"
                      >
                        {playlist.category}
                      </div>
                    </div>

                    {/* Playlist Info */}
                    <div className="pt-2 flex gap-4 bg-black bg-opacity-50 rounded-b-xl">
                      <div>
                        <img
                          src={`${playlist.user?.profilePic}`}
                          className="rounded-full w-10 h-10 md:w-14 md:h-14"
                        />
                      </div>
                      <div>
                        <p className="md:text-2xl text-xl text-white/90 font-bold capitalize">
                          {playlist.name}
                        </p>
                        <p className="text-white/60 text-sm capitalize">
                          {playlist.user?.username}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
        {/*Categories section*/}
        <div>
          <p className="md:text-4xl text-2xl font-semibold">
            Explore by Categories
          </p>
          <div className="flex gap-4  flex-wrap  mt-4">
            {categoies.map((category) => {
              return (
                <div
                  key={category}
                  className="bg-muted lg:py-3 lg:px-6 px-4 py-2 rounded-full cursor-pointer"
                  onClick={() => {
                    fetchPlaylists(category);
                  }}
                >
                  <p className="md:text-lg text-base font-semibold uppercase">
                    {category}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="grid auto-rows-min gap-4 mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {playlists.length > 0 &&
            playlists.map((playlist) => {
              return (
                <Link to={`/playlists/${playlist._id}`}>
                  <div key={playlist._id} className="w-[100%] md:w-[90%]">
                    <div className="w-full aspect-video group rounded cursor-pointer relative overflow-hidden ">
                      <img
                        src="https://plus.unsplash.com/premium_photo-1699025726754-8da11fa3fb58?q=80&w=1971&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="random"
                        className="object-cover w-full rounded h-full group-hover:opacity-85 transition-all duration-300 ease-in-out"
                      />

                      {/* Heart Icon */}
                      <div
                        className="rounded-full bg-black bg-opacity-50 w-10 h-10 justify-center items-center absolute top-2 right-16 
                               flex opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out"
                      >
                        <HeartIcon className="text-white" />
                      </div>

                      {/* Share Icon */}
                      <div
                        className="rounded-full bg-black bg-opacity-50 w-10 h-10 justify-center items-center absolute top-2 right-2
                               flex opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out"
                      >
                        <Share2 className="text-white" />
                      </div>

                      {/* Category Label */}
                      <div
                        className="absolute bottom-2 left-2 right-0 px-3 py-1 font-bold text-white/85 text-md uppercase w-fit 
                                bg-black bg-opacity-80 rounded-full opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out"
                      >
                        {playlist.category}
                      </div>
                    </div>

                    {/* Playlist Info */}
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
              );
            })}
        </div>
      </div>
    </SidebarInset>
  );
}
