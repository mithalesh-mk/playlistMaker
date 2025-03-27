import React from "react";
import { useAuth } from "@/userContext/AuthProvider";
import { FaEnvelope, FaBookmark, FaMusic } from "react-icons/fa";

function Details() {
  const { user } = useAuth();
  const { username, profilePic, bookmarks, email } = user;

  return (
    <section className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 md:p-10 mx-auto w-full max-w-4xl">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Profile Image */}
        <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
          <img
            src={profilePic}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* User Info */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {username}
          </h1>
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
              <FaEnvelope className="text-blue-500" />
              <span className="text-blue-600 dark:text-blue-400">{email}</span>
            </p>
            <p className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
              <FaMusic className="text-green-500" />
              Total playlists: <span className="text-green-600">0</span>
            </p>
            <p className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
              <FaBookmark className="text-purple-500" />
              Total bookmarks: <span className="text-purple-600">{bookmarks.length}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Details;
