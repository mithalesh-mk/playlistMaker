import React, { useState } from "react";
import axiosInstance from "@/axiosInstance";
const PopupForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setPassword] = useState("");
  const [renewPassword, setRenewPassword] = useState("");

  const handleOldPasswordChange = (e) => setOldPassword(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleRenewPasswordChange = (e) => setRenewPassword(e.target.value);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (newPassword !== renewPassword) {
      alert("New passwords do not match.");
      return;
    }

    try {
      const res = await axiosInstance.post("/auth/change-password", {
        oldPassword,
        newPassword,
        reenterNewPassword: renewPassword,
      });
      console.log(res.data);
      alert("Password changed successfully!");
      togglePopup();
    } catch (error) {
      console.error("Error:", error);
      alert("Error changing password. Please try again.");
    }
    togglePopup();
  };

  return (
    <div className="my-[2rem]">
      <button
        onClick={togglePopup}
        className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-900"
      >
        Change Password
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-10"></div>

          <div className="fixed inset-0 flex justify-center items-center z-20">
            <div className="dark:bg-black bg-white p-8 rounded-md shadow-lg w-96">
              <h2 className="text-2xl font-bold mb-4">Change Password</h2>
              <form onSubmit={handleSave}>
                <div className="mb-4">
                  <label className="block">Old Password</label>
                  <input
                    type="text"
                    value={oldPassword}
                    onChange={handleOldPasswordChange}
                    className="border p-2 rounded dark:bg-black dark:text-white w-full max-w-[250px]"
                    placeholder="Enter Old Password"
                  />
                </div>
                <div className="mb-4">
                  <label className="block">New Password:</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    className="border p-2 rounded dark:bg-black dark:text-white w-full max-w-[250px]"
                    placeholder="Enter New Password"
                  />
                </div>
                <div className="mb-4">
                  <label className="block">Confirm Password:</label>
                  <input
                    type="text"
                    value={renewPassword}
                    onChange={handleRenewPasswordChange}
                    className="border p-2 rounded dark:bg-black dark:text-white w-full max-w-[250px]"
                    placeholder="Confirm New Password"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={togglePopup}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-900"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PopupForm;
