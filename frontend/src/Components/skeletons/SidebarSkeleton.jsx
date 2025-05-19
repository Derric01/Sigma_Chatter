import React from 'react';

const SidebarSkeleton = () => {
  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 animate-pulse">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <div className="size-6 bg-base-300 rounded"></div>
          <div className="h-4 w-20 bg-base-300 rounded hidden lg:block"></div>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <div className="h-4 w-4 bg-base-300 rounded"></div>
          <div className="h-3 w-24 bg-base-300 rounded"></div>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {Array(5).fill(0).map((_, i) => (
          <div 
            key={i}
            className="w-full p-3 flex items-center gap-3"
          >
            <div className="relative mx-auto lg:mx-0">
              <div className="size-12 bg-base-300 rounded-full"></div>
            </div>

            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="h-4 w-24 bg-base-300 rounded mb-2"></div>
              <div className="h-3 w-16 bg-base-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
