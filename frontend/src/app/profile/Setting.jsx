import React, { useState } from "react";
import { useAuth } from "@/userContext/AuthProvider";
import { Trash2, UserRoundPen } from "lucide-react";
import { Link } from "react-router-dom";
import PopUp from "./PopUp";
import axiosInstance from "@/axiosInstance";
import ChangeAvatar from "./ChangeAvatar";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom";


function Setting() {
  const { user, setUser } = useAuth();
  const { username, profilePic } = user;
  const [newusername, setUsername] = useState(username);
  const [isOpenAvatar, setIsOpenAvatar] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [userNameChecker, setUserNameChecker] = useState('');
  const { toast } = useToast()
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
          username: newusername,
        }));
        toast({
          description: "Username updated successfully.",
        });
      } else {
        console.error("Failed to update username:", res.data.message);
      }
    } catch (error) {
      console.error("Failed to update username:", error);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if(user.username !== userNameChecker) {
      toast({
        description: "Username does not match.",
      });
      return;
    }

    try {
      await axiosInstance.delete("/auth/delete-account", { data: { userId: user._id } });
      toast({
        description: "Account deleted successfully.",
      });
      setUser(null);
      navigate("/login");
    } catch (error) {
      toast({
        description: "Error deleting account. Please try again.",
      });
    }
  };

  return (
    <div className="max-w-[800px] mx-auto p-6 shadow-lg rounded-lg bg-white dark:bg-gray-900 transition-all duration-300">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
        Profile Settings
      </h2>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Profile Picture with Edit Icon */}
        <div className="relative w-72 h-auto">
          <img
            src={profilePic}
            className="w-full h-full rounded-full border-4 border-gray-300 dark:border-gray-700 object-cover"
            alt="Profile"
          />
            <div className="absolute bottom-2 right-2 bg-gray-800 p-2 rounded-full cursor-pointer hover:bg-gray-900 transition-all">
              <UserRoundPen onClick={()=>setIsOpenAvatar(!isOpenAvatar)} size={18} className="text-white" />
            </div>
          <ChangeAvatar isOpenAvatar={isOpenAvatar} setIsOpenAvatar={setIsOpenAvatar} />
        </div>

        {/* User Settings */}
        <div className="w-full">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Change */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <label className="text-lg font-medium text-gray-700 dark:text-gray-300 w-full md:w-auto">
                Change Username:
              </label>
              <div className="relative w-full md:max-w-[300px]">
                <input
                  type="text"
                  value={newusername}
                  onChange={handleUsernameChange}
                  className="border border-gray-300 dark:border-gray-700 p-2 pl-3 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Enter new username"
                />
              </div>
            

            {/* Save Button */}
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition-all duration-300"
              >
                Save
              </button>
              </div>
          </form>
          

          {/* Additional Settings */}
          <div className="flex flex-col md:flex-row items-center gap-4 mt-6">
            
            <PopUp />

            {/* Delete Account Button */}
            <button
              onClick={() => setIsOpenDelete(!isOpenDelete)}
              className="flex items-center gap-2 bg-red-600 text-white px-2 py-2 rounded-lg hover:bg-red-800 transition-all duration-300"
            >
              <Trash2 size={20} />
              <span>Delete Account</span>
            </button>

            {isOpenDelete && (
              <div className="fixed inset-0 m-3 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full relative"
                >
                  <button
                    onClick={() => setIsOpenDelete(!isOpenDelete)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
                  >
                    <X size={24} />
                  </button>
                  <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">
                    Are you sure you want to delete your account?
                  </h2>
                    <div>
                      <label className="block text-gray-600 dark:text-gray-300">
                        Enter your UserName i.e "{user.username}" to confirm:
                      </label>
                      <input
                        type="text"
                        value={userNameChecker}
                        onChange={(e) => setUserNameChecker(e.target.value)}
                        className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-400"
                        placeholder="your username"
                      />
                    </div>

                    <div className="flex justify-center mt-4">
                      
                      <button
                        onClick={handleDeleteAccount}
                        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                      >
                        Confirm Delete
                      </button>
                    </div>
                </motion.div>
              </div>
            )}
          </div>

          
        </div>
      </div>
    </div>
  );
}

export default Setting;
