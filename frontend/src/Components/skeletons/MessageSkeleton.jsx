import React from 'react';

const MessageSkeleton = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 animate-pulse">
      {/* Left aligned message skeleton (chat-start) */}
      <div className="chat chat-start">
        <div className="chat-image avatar">
          <div className="size-10 rounded-full bg-base-300"></div>
        </div>
        <div className="chat-header mb-1">
          <div className="h-3 w-16 bg-base-300 rounded"></div>
        </div>
        <div className="chat-bubble bg-base-300 flex flex-col">
          <div className="h-4 w-44 bg-base-300/50 rounded mb-2"></div>
          <div className="h-4 w-32 bg-base-300/50 rounded"></div>
        </div>
      </div>

      {/* Right aligned message skeleton (chat-end) */}
      <div className="chat chat-end">
        <div className="chat-image avatar">
          <div className="size-10 rounded-full bg-base-300"></div>
        </div>
        <div className="chat-header mb-1">
          <div className="h-3 w-16 bg-base-300 rounded"></div>
        </div>
        <div className="chat-bubble bg-base-300 flex flex-col">
          <div className="h-4 w-36 bg-base-300/50 rounded mb-2"></div>
          <div className="h-4 w-24 bg-base-300/50 rounded"></div>
        </div>
      </div>

      {/* Left aligned message skeleton (chat-start) */}
      <div className="chat chat-start">
        <div className="chat-image avatar">
          <div className="size-10 rounded-full bg-base-300"></div>
        </div>
        <div className="chat-header mb-1">
          <div className="h-3 w-16 bg-base-300 rounded"></div>
        </div>
        <div className="chat-bubble bg-base-300 flex flex-col">
          <div className="h-4 w-40 bg-base-300/50 rounded mb-2"></div>
          <div className="h-4 w-28 bg-base-300/50 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default MessageSkeleton;
