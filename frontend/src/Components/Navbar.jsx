// filepath: c:\Users\derric samson\OneDrive\Desktop\Chat_App\frontend\src\Components\Navbar.jsx
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, Settings, User } from "lucide-react";

// Custom Sigma Logo Component
const SigmaLogo = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M20.4 6H10.2L5.2 12l5 6h10.2v-3.6L13.5 12l6.9-2.4V6z" strokeWidth="1.5" stroke="currentColor" />
    <path d="M16 8.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z" />
    <path d="M6.5 8.5l2-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M6.5 15.5l2 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
      backdrop-blur-lg bg-base-100/90 shadow-sm"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <SigmaLogo className="w-6 h-6 text-primary-content" />
              </div>
              <h1 className="text-lg font-bold text-base-content">
                <span className="text-primary">
                  Sigma_Chatter
                </span>
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/settings"
              className="btn btn-sm btn-ghost text-base-content hover:bg-base-200 gap-2"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link 
                  to="/profile" 
                  className="btn btn-sm btn-ghost text-base-content hover:bg-base-200 gap-2"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button 
                  className="btn btn-sm btn-error btn-outline gap-2" 
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
