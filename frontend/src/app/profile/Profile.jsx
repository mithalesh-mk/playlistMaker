import { SidebarInset } from "@/components/ui/sidebar";
import { useAuth } from "@/userContext/AuthProvider";
import Details from "./Details";
import Setting from "./Setting";
import { useState } from "react";
import React from "react";
import { motion } from "framer-motion";

const Profile = () => {
  const [profileCurrComponent, setCurComponent] = useState(<Details />);
  const [flag, setFlag] = useState(true);

  const changeToDetails = (flag) => {
    setFlag(flag);
    setCurComponent(flag ? <Details /> : <Setting />);
  };

  return (
    <SidebarInset>
      <section id="profile" className="px-4 md:px-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 md:p-10">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white my-6">
            Profile
          </h1>
          
          <div className="flex justify-center gap-4 mb-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer px-6 py-2 rounded-t-lg text-lg font-semibold transition-all duration-300 shadow-md ${flag ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
              onClick={() => changeToDetails(true)}
            >
              Details
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer px-6 py-2 rounded-t-lg text-lg font-semibold transition-all duration-300 shadow-md ${!flag ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
              onClick={() => changeToDetails(false)}
            >
              Setting
            </motion.div>
          </div>
          
          <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full mb-6"></div>
          
          <motion.div
            key={flag ? "details" : "setting"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {profileCurrComponent}
          </motion.div>
        </div>
      </section>
    </SidebarInset>
  );
};

export default Profile;