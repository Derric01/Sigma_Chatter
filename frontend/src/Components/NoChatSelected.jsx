import { MessageSquare } from "lucide-react";

// Dragon Logo Component
const DragonLogo = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M21.5 4h-4.6c-3.4 0-6.2 2.5-6.9 5.7l-3.3-3.3c-.4-.4-1-.4-1.4 0L2.7 9c-.4.4-.4 1 0 1.4L4 11.7l2.7 2.7c.4.4 1 .4 1.4 0l2.8-2.8c3.2-.7 5.7-3.5 5.7-6.9V3.5c0-.3.2-.5.5-.5h4c.3 0 .5.2.5.5v.9c0 3.3-2.3 6.1-5.5 6.8-1 .2-1.9.7-2.7 1.5l-4.4 4.4c-.4.4-.4 1 0 1.4l1 1c.4.4 1 .4 1.4 0l4.4-4.4c.7-.7 1.2-1.7 1.5-2.7.7-3.1 3.5-5.4 6.8-5.4h.9c.3 0 .5.2.5.5v1c0 .3-.2.5-.5.5h-4.6" 
      strokeWidth="1.5" stroke="currentColor" />
    <path d="M16.5 6c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5zm0 2c-.3 0-.5-.2-.5-.5s.2-.5.5-.5.5.2.5.5-.2.5-.5.5z" />
    <path d="M9 20.5c-.3 0-.5-.2-.5-.5s.2-.5.5-.5.5.2.5.5-.2.5-.5.5zm0-2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" 
      strokeWidth=".5" stroke="currentColor" />
    <path d="M7.5 14.5l-1-1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50 relative overflow-hidden">
      {/* Background Pattern - Subtle Dragon Scales */}
      <div className="absolute inset-0 opacity-5 pattern-dragon-scales"></div>
      <div className="max-w-md text-center space-y-6 relative z-10">{/* Icon Display */}
        <div className="flex justify-center gap-4 mb-6">
          <div className="relative">
            <div
              className="w-20 h-20 rounded-2xl bg-primary flex items-center
             justify-center animate-pulse"
            >
              <DragonLogo className="w-12 h-12 text-primary-content" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Welcome to Sigma_Chatter!</h2>
        <p className="text-base-content/70 text-lg">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
