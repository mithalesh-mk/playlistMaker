import { SidebarInset } from '@/components/ui/sidebar';
import { PlayIcon, ListCollapse } from 'lucide-react';

export default function Home() {
  return (
    <SidebarInset>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-2">
          <div className="w-full h-[500px] relative">
            <img
              src="https://plus.unsplash.com/premium_photo-1699025726754-8da11fa3fb58?q=80&w=1971&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="random"
              className="object-cover w-full h-full rounded-xl"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 rounded-b-xl">
              <h3 className=" text-lg font-semibold">Random</h3>
              <div className="flex gap-4">
                <p className=" text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.{' '}
                </p>
                <ListCollapse className="w-[20px]" />
              </div>
            </div>
          </div>
          <div className="w-full h-[500px] rounded-xl relative">
            <img
              src="https://plus.unsplash.com/premium_photo-1699025726754-8da11fa3fb58?q=80&w=1971&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="random"
              className="object-cover w-full h-full rounded-xl"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 rounded-b-xl">
              <h3 className=" text-lg font-semibold">Random</h3>
              <div className="flex gap-4">
                <p className=" text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.{' '}
                </p>
                <ListCollapse className="w-[20px]" />
              </div>
            </div>
          </div>
        </div>
        <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="w-full rounded-xl relative">
            <img
              src="https://plus.unsplash.com/premium_photo-1699025726754-8da11fa3fb58?q=80&w=1971&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="random"
              className="object-cover w-full h-full rounded-xl"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 rounded-b-xl">
              <h3 className=" text-lg font-semibold">Random</h3>
              <div className="flex gap-4">
                <p className=" text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.{' '}
                </p>
                <ListCollapse className="w-[20px]" />
              </div>
            </div>
          </div>
          <div className="w-full  rounded-xl relative">
            <img
              src="https://plus.unsplash.com/premium_photo-1699025726754-8da11fa3fb58?q=80&w=1971&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="random"
              className="object-cover w-full h-full rounded-xl"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 rounded-b-xl">
              <h3 className=" text-lg font-semibold">Random</h3>
              <div className="flex gap-4">
                <p className=" text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.{' '}
                </p>
                <ListCollapse className="w-[20px]" />
              </div>
            </div>
          </div>
          <div className="w-full rounded-xl relative">
            <img
              src="https://plus.unsplash.com/premium_photo-1699025726754-8da11fa3fb58?q=80&w=1971&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="random"
              className="object-cover w-full h-full rounded-xl"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 rounded-b-xl">
              <h3 className=" text-lg font-semibold">Random</h3>
              <div className="flex gap-4">
                <p className=" text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.{' '}
                </p>
                <ListCollapse className="w-[20px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
