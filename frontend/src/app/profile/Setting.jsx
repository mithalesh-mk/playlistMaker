import React, { useState } from "react";
import { useAuth } from "@/userContext/AuthProvider";
import { UserRoundPen, Trash2 } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import PopUp from "./PopUp";
import axiosInstance from "@/axiosInstance";
import { useEffect } from "react";


function Setting() {
  const { user, logout, setUser } = useAuth();
  const { username, email, profilePic } = user;
  const [newusername, setUsername] = useState(username);
  const navigate = useNavigate();

  const handleUsernameChange = (e) => setUsername(e.target.value);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put("/auth/change-username", {
        newUsername: newusername,
      });
  
      if (res.data.success) {
        setUser((prevUser) => ({
          ...prevUser,
          username: newusername, // Update username in context
        }));
        
      } else {
        console.error("Failed to update username:", res.data.message);
      }
    } catch (error) {
      console.error("Failed to update username:", error);
      console.error(error);
    }
  };
  
  const handleDeleteAccount = async () => {
    const confirm = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirm){
      return ;
    }
    try {
      await axiosInstance.delete("/auth/delete-account", { data: { userId: user._id } });
      alert("Account deleted successfully");
      window.location.href = "/login";
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert("Something went wrong while deleting the account");
    }
  };

  return (
    <div className="max-w-[1024] mx-auto p-4 shadow-md">
      <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
      <div className="flex justify-between items-center flex-col lg:flex-row gap-2 lg:gap-0">
        <div className="relative max-w-[400px] w-full md:w-1/2">
          <img src={profilePic} className="w-full h-auto max-h-[350px] max-w-[350px]" alt="Profile" />
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
                className="border p-2 rounded dark:bg-black dark:text-white w-full max-w-[300px] h-9 my-auto"
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
          <PopUp />
          <div className="flex justify-end mt-4">
            <button
              onClick={handleDeleteAccount}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800"
            >
              <Trash2 size={20} /> Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;
