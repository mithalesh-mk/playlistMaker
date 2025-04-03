import axiosInstance from "@/axiosInstance";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Trash2 } from "lucide-react"; // Import Trash icon
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

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
        <motion.h1
        className="text-white text-4xl font-bold mb-5"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <svg width="180" height="180" viewBox="0 0 1089 1335" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M809 240L667 576.5C560.6 415.46 447 307.067 403.5 273C529.1 423.8 693.167 735.5 759.5 872.5L1030 240H809Z" fill="#FF0000"/>
        <path d="M712.5 981H492C238.4 301.8 58.3333 44 0 0C399.2 235.2 641.333 752 712.5 981Z" fill="#FF0000"/>
        <path d="M795.5 788L676.5 554.5L713 467.5L834 698L795.5 788Z" fill="#A60000"/>
        <path d="M339.98 1060C343.78 1063.8 345.68 1068.7 345.68 1074.7C345.68 1079.7 344.58 1084.8 342.38 1090L265.58 1270L262.28 1271.5L186.68 1060H212.18L274.88 1237.6L338.78 1090C340.98 1085 342.08 1079.8 342.08 1074.4C342.08 1069 340.58 1064.8 337.58 1061.8L339.98 1060ZM393.091 1196.8C393.091 1221.6 397.391 1239.8 405.991 1251.4C414.791 1263 426.291 1268.8 440.491 1268.8C460.491 1268.8 478.291 1265.8 493.891 1259.8L494.791 1261.9C478.791 1268.1 460.691 1271.2 440.491 1271.2C420.491 1271.2 404.191 1265.2 391.591 1253.2C378.991 1241.2 372.691 1222.7 372.691 1197.7C372.691 1172.7 379.291 1153.3 392.491 1139.5C405.691 1125.7 422.491 1118.8 442.891 1118.8C459.291 1118.8 473.091 1123.7 484.291 1133.5C495.491 1143.3 501.091 1157.8 501.091 1177C501.091 1178 501.091 1179 501.091 1180H393.991C393.391 1185.4 393.091 1191 393.091 1196.8ZM480.691 1177.6C480.491 1158.4 476.791 1144.2 469.591 1135C462.391 1125.8 453.091 1121.2 441.691 1121.2C430.291 1121.2 420.091 1126.2 411.091 1136.2C402.291 1146.2 396.691 1160 394.291 1177.6H480.691ZM630.998 1130.5C627.798 1127.9 622.598 1125.7 615.398 1123.9C608.398 1122.1 603.098 1121.2 599.498 1121.2C595.898 1121.2 593.798 1121.2 593.198 1121.2C582.398 1121.4 574.598 1124.2 569.798 1129.6C564.998 1134.8 562.598 1140.7 562.598 1147.3C562.598 1153.9 564.698 1159.5 568.898 1164.1C573.098 1168.5 578.298 1172 584.498 1174.6C590.898 1177 597.698 1179.8 604.898 1183C612.298 1186.2 619.098 1189.5 625.298 1192.9C631.698 1196.1 636.998 1200.9 641.198 1207.3C645.398 1213.5 647.498 1221.3 647.498 1230.7C647.498 1240.1 644.198 1248.1 637.598 1254.7C630.998 1261.3 623.598 1265.7 615.398 1267.9C607.398 1270.1 598.698 1271.2 589.298 1271.2C568.898 1271.2 553.598 1266.7 543.398 1257.7L545.198 1255.9C549.198 1259.7 555.098 1262.8 562.898 1265.2C570.898 1267.6 578.598 1268.8 585.998 1268.8C597.798 1268.8 607.498 1265.6 615.098 1259.2C622.898 1252.6 626.798 1244.5 626.798 1234.9C626.798 1225.1 623.898 1217.3 618.098 1211.5C612.298 1205.5 605.198 1200.9 596.798 1197.7C588.598 1194.3 580.298 1191 571.898 1187.8C563.498 1184.4 556.398 1179.8 550.598 1174C544.798 1168 541.898 1161.1 541.898 1153.3C541.898 1145.5 543.698 1139.2 547.298 1134.4C550.898 1129.4 555.698 1125.9 561.698 1123.9C571.898 1120.5 582.098 1118.8 592.298 1118.8C609.498 1118.8 622.898 1122 632.498 1128.4L630.998 1130.5ZM775.631 1130.5C772.431 1127.9 767.231 1125.7 760.031 1123.9C753.031 1122.1 747.731 1121.2 744.131 1121.2C740.531 1121.2 738.431 1121.2 737.831 1121.2C727.031 1121.4 719.231 1124.2 714.431 1129.6C709.631 1134.8 707.231 1140.7 707.231 1147.3C707.231 1153.9 709.331 1159.5 713.531 1164.1C717.731 1168.5 722.931 1172 729.131 1174.6C735.531 1177 742.331 1179.8 749.531 1183C756.931 1186.2 763.731 1189.5 769.931 1192.9C776.331 1196.1 781.631 1200.9 785.831 1207.3C790.031 1213.5 792.131 1221.3 792.131 1230.7C792.131 1240.1 788.831 1248.1 782.231 1254.7C775.631 1261.3 768.231 1265.7 760.031 1267.9C752.031 1270.1 743.331 1271.2 733.931 1271.2C713.531 1271.2 698.231 1266.7 688.031 1257.7L689.831 1255.9C693.831 1259.7 699.731 1262.8 707.531 1265.2C715.531 1267.6 723.231 1268.8 730.631 1268.8C742.431 1268.8 752.131 1265.6 759.731 1259.2C767.531 1252.6 771.431 1244.5 771.431 1234.9C771.431 1225.1 768.531 1217.3 762.731 1211.5C756.931 1205.5 749.831 1200.9 741.431 1197.7C733.231 1194.3 724.931 1191 716.531 1187.8C708.131 1184.4 701.031 1179.8 695.231 1174C689.431 1168 686.531 1161.1 686.531 1153.3C686.531 1145.5 688.331 1139.2 691.931 1134.4C695.531 1129.4 700.331 1125.9 706.331 1123.9C716.531 1120.5 726.731 1118.8 736.931 1118.8C754.131 1118.8 767.531 1122 777.131 1128.4L775.631 1130.5ZM855.994 1196.8C855.994 1221.6 860.294 1239.8 868.894 1251.4C877.694 1263 889.194 1268.8 903.394 1268.8C923.394 1268.8 941.194 1265.8 956.794 1259.8L957.694 1261.9C941.694 1268.1 923.594 1271.2 903.394 1271.2C883.394 1271.2 867.094 1265.2 854.494 1253.2C841.894 1241.2 835.594 1222.7 835.594 1197.7C835.594 1172.7 842.194 1153.3 855.394 1139.5C868.594 1125.7 885.394 1118.8 905.794 1118.8C922.194 1118.8 935.994 1123.7 947.194 1133.5C958.394 1143.3 963.994 1157.8 963.994 1177C963.994 1178 963.994 1179 963.994 1180H856.894C856.294 1185.4 855.994 1191 855.994 1196.8ZM943.594 1177.6C943.394 1158.4 939.694 1144.2 932.494 1135C925.294 1125.8 915.994 1121.2 904.594 1121.2C893.194 1121.2 882.994 1126.2 873.994 1136.2C865.194 1146.2 859.594 1160 857.194 1177.6H943.594ZM1044.4 1270C1026.8 1270 1015.7 1265.4 1011.1 1256.2C1010.1 1254.2 1009.6 1252.4 1009.6 1250.8V1045.3H1030.6V1248.7C1030.6 1254.5 1031.7 1259 1033.9 1262.2C1036.3 1265.2 1038.7 1266.8 1041.1 1267L1044.4 1267.6H1053.7V1270H1044.4Z" fill="white"/>
        </svg>

      </motion.h1>
        <Loader2 className="animate-spin text-gray-300" size={40} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-20 text-red-400">{error}</div>;
  }

  if (playlists.length === 0) {
    return <h1 className="text-center text-2xl mt-20 text-gray-300">No Playlists Found</h1>;
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
