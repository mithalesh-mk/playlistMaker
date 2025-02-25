import React from "react";
import { useState } from "react";
import { useAuth } from "@/userContext/AuthProvider";
import { UserRoundPen } from "lucide-react";
import { Link } from "react-router-dom";
import PopUp from "./PopUp";
import axiosInstance from "@/axiosInstance";
function Setting() {
  const { user } = useAuth();
  const { username, email, profilePic } = user;
  const [newusername, setUsername] = useState(username);
  // const [newProfilePic, setProfilePic] = useState(profilePic);

  const handleUsernameChange = (e) => setUsername(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement your update logic here
    try {
      const res = await axiosInstance.put("/auth/change-username", {
        newUsername: newusername,
      });
      console.log(res.data);
    } catch (error) {
      alert(error);
      return error;
    }
  };

  return (
    <div className="max-w-[1024] mx-auto p-4 shadow-md">
      <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
      <div className="flex justify-between items-center  flex-col lg:flex-row  gap-2 lg:gap-0">
        <div className="relative max-w-[400px] w-full md:w-1/2">
          <img
            src={profilePic}
            className="w-full h-auto max-h-[350px] max-w-[350px]"
          ></img>
          <Link to={"/choose-avatar"}>
            <div className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-900 w-fit mx-auto md:mx-0">
              Change Profile
            </div>
          </Link>
        </div>
        <div className="w-full md:w-1/2 flex justify-center flex-col mt-5 md:mt-0">
          <form onSubmit={handleSubmit} className="max-w-[640px]">
            <div className="mb-4 flex justify-between flex-col md:flex-row">
              <label className="text-xl pt-1">Change Username </label>
              <input
                type="text"
                value={newusername}
                onChange={handleUsernameChange}
                className=" border p-2 rounded dark:bg-black dark:text-white w-full max-w-[300px] h-9 my-auto"
                placeholder="Enter new username"
              />
            </div>
            <div className="flex md:justify-end">
              <button
                type="submit"
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-900"
              >
                Save
              </button>
            </div>
          </form>
          <PopUp></PopUp>
        </div>
      </div>
    </div>
  );
}

export default Setting;
