import React from "react";
import { useState } from "react";
import { useAuth } from "@/userContext/AuthProvider";
import { UserRoundPen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
function Setting() {
  const { user } = useAuth();
  const { username, email, profilePic } = user;
  const [newusername, setUsername] = useState(username);
  // const [newProfilePic, setProfilePic] = useState(profilePic);
  const [newPassword, setPassword] = useState("");

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const changeProfile = () => {
    useNavigate("/choose-avatar");
  };

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
          <UserRoundPen
            onClick={() => {
              changeProfile;
            }}
            className="absolute bottom-[2rem] right-[7rem] dark:bg-black rounded-sm bg-white"
          />
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
        <div className="mb-4">
          <label className="block">Change Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={handlePasswordChange}
            className=" border p-2 rounded dark:bg-black dark:text-white w-full max-w-[250px]"
            placeholder="Enter new Password"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update
        </button>
      </form>
    </div>
  );
}

export default Setting;
