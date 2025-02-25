import React from "react";
import { useAuth } from "@/userContext/AuthProvider";

function Details() {
  const { user } = useAuth();
  const { username, profilePic, bookmarks, email } = user;
  return (
    <section>
      <div className="flex flex-col md:flex-row my-[1rem]">
        <div className="basis-1/2">
          <div className="">
            <img
              src={profilePic}
              className="w-full h-auto max-h-[400px] max-w-[400px] mx-auto"
            ></img>
          </div>
          <div>
            <h1 className="text-center text-xl font-bold">
              {username.toUpperCase()}
            </h1>
          </div>
        </div>

        <div className="basis-1/2 flex items-center justify-center">
          <div className="h-auto md:h-[10rem] flex flex-col justify-around text-xl text-center md:text-left">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-300">
              Email: <span className="text-blue-600">{email}</span>
            </p>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-300">
              Total playlist: <span className="text-green-600">0</span>
            </p>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-300">
              Total bookmarks:{" "}
              <span className="text-purple-600">{bookmarks.length}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Details;
