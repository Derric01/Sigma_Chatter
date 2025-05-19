import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants";
import { Camera, Mail, User, Calendar, CheckCircle, Palette, Search, Moon, SunMoon, LightbulbOff, PaintBucket } from "lucide-react";

// Group themes by category for better organization
const THEME_CATEGORIES = {
  "Light": ["light", "cupcake", "bumblebee", "emerald", "corporate", "lofi", "pastel", "lemonade", "winter", "acid", "fantasy"],
  "Dark": ["dark", "synthwave", "halloween", "forest", "black", "luxury", "dracula", "night", "coffee"],
  "Special": ["dim", "nord", "sunset", "retro", "cyberpunk", "valentine", "garden", "aqua", "wireframe", "cmyk", "autumn", "business"]
};

// Custom Sigma Logo Component to maintain branding consistency
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

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();  const { theme, setTheme } = useThemeStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [showThemes, setShowThemes] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");  const [activeCategory, setActiveCategory] = useState("All");

  // Filter themes based on search and category
  const filteredThemes = THEMES.filter(t => {
    const matchesSearch = searchTerm ? t.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    const matchesCategory = activeCategory === "All" ? true : THEME_CATEGORIES[activeCategory]?.includes(t);
    return matchesSearch && matchesCategory;
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };
  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-200 rounded-xl p-6 space-y-8 shadow-md border border-base-300">
          <div className="text-center relative">
            <h1 className="text-2xl font-bold text-primary">Profile</h1>
            <p className="mt-2 text-base-content/70">Your profile information</p>
            
            {/* Theme toggle button - simplified */}
            <button 
              onClick={() => setShowThemes(!showThemes)} 
              className="absolute right-0 top-0 p-2 rounded-full hover:bg-base-300"
              title="Change theme"
            >
              <Palette className="w-5 h-5 text-primary" />
            </button>
              {/* Enhanced Theme selector dropdown */}
            {showThemes && (
              <div className="absolute right-0 top-10 z-50 mt-2 p-3 bg-base-100 rounded-lg shadow-lg border border-base-300 w-72 max-h-96 overflow-y-auto">
                <h3 className="font-medium mb-2 text-sm pb-1 border-b border-base-300">Select Theme</h3>
                
                {/* Search bar */}
                <div className="relative mb-2">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-base-content/50" />
                  <input 
                    type="text"
                    placeholder="Search themes..." 
                    className="input input-sm input-bordered pl-8 w-full text-xs"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Category tabs */}
                <div className="tabs tabs-sm mb-2">
                  <button 
                    className={`tab tab-xs ${activeCategory === "All" ? "tab-active" : ""}`}
                    onClick={() => setActiveCategory("All")}
                  >
                    All
                  </button>
                  {Object.keys(THEME_CATEGORIES).map(category => (
                    <button 
                      key={category}
                      className={`tab tab-xs ${activeCategory === category ? "tab-active" : ""}`}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                
                {/* Theme grid */}
                {filteredThemes.length > 0 ? (
                  <div className="grid grid-cols-2 gap-1.5 mt-2">
                    {filteredThemes.map((t) => (                      <button
                        key={t}
                        onClick={() => {
                          // Debounced theme change to prevent flickering
                          if (theme !== t) {
                            setTheme(t);
                          }
                          // Close theme selector after a short delay to prevent flicker
                          setTimeout(() => setShowThemes(false), 50);
                        }}
                        className={`
                          text-xs rounded p-2 flex items-center gap-1.5 group relative
                          ${theme === t ? 'bg-primary/20 font-semibold' : 'hover:bg-base-300'}
                        `}
                      ><div className={`w-6 h-6 rounded overflow-hidden relative ${
                          t === "dim" ? "border-2 border-gray-500" : 
                          t === "nord" ? "border-2 border-blue-500" : 
                          t === "sunset" ? "border-2 border-orange-500" : "border border-base-content/20"
                        } ${theme === t && t === "dim" ? "shadow-[0_0_4px_rgba(75,85,99,0.8)]" : 
                           theme === t && t === "nord" ? "shadow-[0_0_4px_rgba(94,129,172,0.8)]" : 
                           theme === t && t === "sunset" ? "shadow-[0_0_4px_rgba(249,115,22,0.8)]" : ""
                        }`} data-theme={t}>
                          <div className="w-full h-1/2 bg-primary"></div>
                          <div className="w-full h-1/2 bg-secondary"></div>
                          
                          {/* Enhanced Special theme indicators */}                          {t === "dim" && (
                            <div className="absolute inset-0 flex flex-col">
                              <div className="h-1/2 bg-gradient-to-r from-gray-900/50 to-transparent"></div>
                              <div className="h-1/2 flex items-center justify-center">
                                <LightbulbOff className="w-3 h-3 text-gray-300" />
                              </div>
                              <div className="absolute top-0 left-0 w-full h-full bg-gray-900/10"></div>
                            </div>
                          )}
                          {t === "nord" && (
                            <div className="absolute inset-0 flex flex-col">
                              <div className="h-1/2 bg-gradient-to-r from-blue-900/50 to-transparent"></div>
                              <div className="h-1/2 flex items-center justify-center">
                                <SunMoon className="w-3 h-3 text-blue-300" />
                              </div>
                              <div className="absolute top-0 left-0 w-full h-full bg-blue-900/10"></div>
                            </div>
                          )}
                          {t === "sunset" && (
                            <div className="absolute inset-0 flex flex-col">
                              <div className="h-1/2 bg-gradient-to-r from-orange-900/50 to-transparent"></div>
                              <div className="h-1/2 flex items-center justify-center">
                                <PaintBucket className="w-3 h-3 text-orange-300" />
                              </div>
                              <div className="absolute top-0 left-0 w-full h-full bg-orange-900/10"></div>
                            </div>
                          )}</div>
                        {/* Enhanced text labels for special themes */}                        {t === "dim" ? (
                          <span className="flex items-center gap-1">
                            <LightbulbOff className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-500 font-medium">Dim</span>
                            <span className="text-xs text-gray-400 italic">(Subtle Gray)</span>
                          </span>
                        ) : t === "nord" ? (
                          <span className="flex items-center gap-1">
                            <SunMoon className="w-3 h-3 text-blue-500" />
                            <span className="text-blue-500 font-medium">Nord</span>
                            <span className="text-xs text-blue-400 italic">(Cool Blue)</span>
                          </span>
                        ) : t === "sunset" ? (
                          <span className="flex items-center gap-1">
                            <PaintBucket className="w-3 h-3 text-orange-500" />
                            <span className="text-orange-500 font-medium">Sunset</span>
                            <span className="text-xs text-orange-400 italic">(Warm Orange)</span>
                          </span>
                        ) : (
                          t.charAt(0).toUpperCase() + t.slice(1)
                        )}
                          {/* Selected indicator */}                        {theme === t && (
                          <div className={`absolute -right-1 -top-1 w-3 h-3 rounded-full border ${
                            t === "dim" ? "bg-gray-500 border-gray-300" :
                            t === "nord" ? "bg-blue-500 border-blue-300" : 
                            t === "sunset" ? "bg-orange-500 border-amber-300" :
                            "bg-primary border-primary-content"
                          }`}></div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-sm text-base-content/70">
                    No matching themes found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* avatar upload section - simplified */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-base-100 overflow-hidden">
                <img
                  src={selectedImg || authUser?.profilePic || authUser?.profilepic || "/avatar.png"}
                  onError={(e) => {
                    console.log("Image load error, falling back to default");
                    e.target.onerror = null;
                    e.target.src = "/avatar.png";
                  }}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-primary p-2 rounded-full cursor-pointer"
              >
                <Camera className="w-4 h-4 text-primary-content" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-base-content/70">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-base-content/70 flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-primary" />
                Full Name
              </div>
              <p className="px-4 py-2 bg-base-100 rounded-lg border border-base-300">
                {authUser?.fullName || "Not available"}
              </p>
            </div>

            <div>
              <div className="text-sm font-medium text-base-content/70 flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-primary" />
                Email Address
              </div>
              <p className="px-4 py-2 bg-base-100 rounded-lg border border-base-300">
                {authUser?.email || "Not available"}
              </p>
            </div>
          </div>

          <div className="bg-base-100 rounded-xl p-4 border border-base-300">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <SigmaLogo className="w-5 h-5 text-primary" />
              Account Information
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-base-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Member Since</span>
                </div>
                <span>
                  {authUser?.createdAt ? authUser.createdAt.split("T")[0] : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Account Status</span>
                </div>
                <span className="badge badge-success badge-sm">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;