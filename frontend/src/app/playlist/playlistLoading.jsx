import React from "react";

const PlaylistLoading = () => {
  return (
    <div className="w-full bg-dark text-white flex flex-col lg:flex-row gap-4 p-4">
      {/* Left Section: Skeleton Thumbnail and Info */}
      <div className="lg:w-1/3 w-full flex-shrink-0 lg:sticky lg:top-4">
        <div className="bg-gray-900 lg:h-[calc(100vh-100px)] rounded-2xl p-5 shadow-lg animate-pulse">
          {/* Thumbnail Skeleton */}
          <div className="bg-gray-800 rounded-2xl w-full h-[200px] mb-4"></div>

          {/* Buttons Skeleton */}
          <div className="flex items-center justify-between gap-5 mb-6">
            <div className="flex items-center gap-5">
              <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
              <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
              <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
              <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
            </div>
          </div>

          {/* Owner Details Skeleton */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
            <div className="w-20 h-4 bg-gray-700 rounded"></div>
          </div>

          {/* Playlist Info Skeleton */}
          <div className="h-6 bg-gray-700 w-2/3 rounded mb-3"></div>
          <div className="h-4 bg-gray-700 w-1/3 rounded mb-6"></div>
          <div className="h-12 bg-gray-700 w-full rounded mb-5"></div>
        </div>
      </div>

      {/* Right Section: Skeleton Video List */}
      <div className="lg:w-2/3 w-full overflow-hidden">
        <div className="rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="w-1/3 h-6 bg-gray-700 rounded mb-4"></div>
          </div>

          {/* Skeleton for Video List */}
          <ul className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <li key={i} className="h-16 bg-gray-700 rounded w-full"></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlaylistLoading;
