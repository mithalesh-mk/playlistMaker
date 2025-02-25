import { SidebarInset } from "@/components/ui/sidebar";
import { useAuth } from "@/userContext/AuthProvider";
import Details from "./Details";
import Setting from "./Setting";
import { useState } from "react";
import React from "react";

const Profile = () => {
  const [profileCurrComponent, setCurComponent] = useState(<Details></Details>);
  const [flag, setFlag] = useState(true);

  const changeToDetails = (flag) => {
    setFlag(flag);
    if (flag) {
      setCurComponent(<Details></Details>);
    } else {
      setCurComponent(<Setting></Setting>);
    }
  };
  return (
    <SidebarInset>
      <section id="profile" className="px-[1rem]">
        <div className="max-w-[1024px] mx-auto ">
          <h1 className="text-5xl my-[2rem]">Profile</h1>
          <div className="flex justify-around">
            <div
              className={
                flag
                  ? "w-1/2 flex justify-center border-gray-100 border-r border-l border-t text-xl dark:bg-gray-700 bg-gray-200"
                  : "w-1/2 flex justify-center border-gray-100 border-r border-l border-t text-xl"
              }
              onClick={() => {
                changeToDetails(true);
              }}
            >
              Details
            </div>
            <div
              className={
                flag
                  ? "w-1/2 flex justify-center border-gray-100 border-r border-l border-t text-xl "
                  : "w-1/2 flex justify-center border-gray-100 border-r border-l border-t text-xl dark:bg-gray-700 bg-gray-200"
              }
              onClick={() => {
                changeToDetails(false);
              }}
            >
              Setting
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full mb-4"></div>
          {profileCurrComponent}
        </div>
      </section>
    </SidebarInset>
  );
};

export default Profile;
