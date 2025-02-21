import React from "react";
import { useState } from "react";
import { useAuth } from "@/userContext/AuthProvider";

function Setting() {
  const { user } = useAuth();
  const { username, email } = user;
  const [newemail, setEmail] = useState(email);
  const [newusername, setUsername] = useState(username);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleCurrentPasswordChange = (e) => setCurrentPassword(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your update logic here
    console.log("Email:", email);
    console.log("Username:", username);
    console.log("Current Password:", currentPassword);
    console.log("New Password:", newPassword);
  };

  return (
    <div className="max-w-[1024] mx-auto p-4 shadow-md">
      <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
      <form onSubmit={handleSubmit} className="max-w-[640px]">
        <div className="mb-4">
          <label className="block">Change Email:</label>
          <input
            type="email"
            value={newemail}
            onChange={handleEmailChange}
            className="w-full border p-2 rounded text-black"
            placeholder="Enter new email"
          />
        </div>
        <div className="mb-4">
          <label className="block">Change Username:</label>
          <input
            type="text"
            value={newusername}
            onChange={handleUsernameChange}
            className="w-full border p-2 rounded text-black"
            placeholder="Enter new username"
          />
        </div>
        <div className="mb-4">
          <label className="block">Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={handleCurrentPasswordChange}
            className="w-full border p-2 rounded text-black"
            placeholder="Enter current password"
          />
        </div>
        <div className="mb-4">
          <label className="block">New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            className="w-full border p-2 rounded text-black"
            placeholder="Enter new password"
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
