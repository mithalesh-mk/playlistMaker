import React from "react";
import { useState } from "react";
import { useAuth } from "@/userContext/AuthProvider";
import { UserRoundPen } from "lucide-react";
import { Link } from "react-router-dom";
import PopUp from "./PopUp";
function Setting() {
  const { user } = useAuth();
  const { username, email, profilePic } = user;
  const [newusername, setUsername] = useState(username);
  // const [newProfilePic, setProfilePic] = useState(profilePic);

  const handleUsernameChange = (e) => setUsername(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your update logic here
  };

  return (
    <div className="max-w-[1024] mx-auto p-4 shadow-md">
      <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
      <div className="relative max-w-[400px]">
        <img
          src={profilePic}
          className="w-full h-auto max-h-[350px] max-w-[350px]"
        ></img>
        <Link to={"/choose-avatar"}>
          <UserRoundPen className="absolute bottom-[2rem] right-[7rem] dark:bg-black rounded-sm bg-white" />
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="max-w-[640px]">
        <div className="mb-4">
          <label className="block">Change Username:</label>
          <input
            type="text"
            value={newusername}
            onChange={handleUsernameChange}
            className=" border p-2 rounded dark:bg-black dark:text-white w-full max-w-[250px]"
            placeholder="Enter new username"
          />
        </div>
        <button
          type="submit"
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Update
        </button>
      </form>

      <PopUp></PopUp>
    </div>
  );
}

export default Setting;
