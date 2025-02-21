import { SidebarInset } from "@/components/ui/sidebar";
import { useAuth } from "@/userContext/AuthProvider";
import Details from "./Details";
import Setting from "./Setting";
import { useState } from "react";
import React from "react";

const Profile = () => {
  const [profileCurrComponent, setCurComponent] = useState(<Details></Details>);

  const changeToDetails = (flag) => {
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
          <div className="flex gap-[1rem] border-b-2 border-grey">
            <button
              onClick={() => {
                changeToDetails(true);
              }}
            >
              Details
            </button>
            <button
              onClick={() => {
                changeToDetails(false);
              }}
            >
              Setting
            </button>
          </div>
          {profileCurrComponent}
        </div>
      </section>
    </SidebarInset>
  );
};

export default Profile;
