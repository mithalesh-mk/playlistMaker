import React, { useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/axiosInstance";
import { X } from "lucide-react";

const PopupForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [renewPassword, setRenewPassword] = useState("");

  const togglePopup = () => setIsOpen(!isOpen);

  const handleSave = async (e) => {
    e.preventDefault();
    if (newPassword !== renewPassword) {
      alert("New passwords do not match.");
      return;
    }
    try {
      await axiosInstance.post("/auth/change-password", {
        oldPassword,
        newPassword,
        reenterNewPassword: renewPassword,
      });
      alert("Password changed successfully!");
      togglePopup();
    } catch (error) {
      alert("Error changing password. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-auto">
      <button
        onClick={togglePopup}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-lg shadow-md hover:scale-105 transition-transform"
      >
        Change Password
      </button>

      {isOpen && (
        <div className="fixed inset-0 m-3 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full relative"
          >
            <button
              onClick={togglePopup}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">Change Password</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-gray-600 dark:text-gray-300">Old Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-400"
                  placeholder="Enter Old Password"
                />
              </div>
              <div>
                <label className="block text-gray-600 dark:text-gray-300">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-400"
                  placeholder="Enter New Password"
                />
              </div>
              <div>
                <label className="block text-gray-600 dark:text-gray-300">Confirm Password</label>
                <input
                  type="password"
                  value={renewPassword}
                  onChange={(e) => setRenewPassword(e.target.value)}
                  className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-400"
                  placeholder="Confirm New Password"
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={togglePopup}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                >
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PopupForm;