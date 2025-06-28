import { useState, useEffect } from "react";

const FeaturedListLoaderSkeleton = () => {
  return (
    <div className="relative w-full flex justify-center items-center px-4 sm:px-6 lg:px-8 py-10 md:py-20 overflow-hidden">
      <div className="w-full max-w-[calc(100vw-1rem)] lg:max-w-[calc(100vw-280px)] xl:max-w-[1000px] h-[400px] sm:h-[500px] md:h-[450px] lg:h-[400px] relative">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-full rounded-lg flex items-center justify-center animate-pulse"
          >
            <div className="w-full h-auto flex flex-col md:flex-row sm:flex-row bg-[#1c1c1c] rounded-lg overflow-hidden">
              <div className="w-full sm:w-1/2 bg-gray-700 h-full" />
              <div className="flex flex-col justify-between p-4 sm:p-6 w-full sm:w-1/2 bg-[#2a2a2a]">
                <div className="h-6 bg-gray-600 rounded w-1/2 mb-4" />
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-10 h-10 rounded-full bg-gray-600" />
                  <div className="h-4 bg-gray-600 rounded w-1/3" />
                </div>
                <div className="h-4 bg-gray-600 rounded w-2/3 mt-4" />
                <div className="h-4 bg-gray-600 rounded w-full mt-2" />
                <div className="flex items-center gap-3 mt-4">
                  <div className="h-4 w-8 bg-gray-600 rounded" />
                  <div className="h-4 w-8 bg-gray-600 rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedListLoaderSkeleton;
