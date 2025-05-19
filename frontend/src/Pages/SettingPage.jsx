import { useState } from "react";
import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send, Search, SunMoon, Moon, LightbulbOff, PaintBucket } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey Derric! How's your chat app coming along?", isSent: false },
  { id: 2, content: "It's looking awesome! Just improving the theme selection right now.", isSent: true },
];

// Grouped themes by category
const THEME_CATEGORIES = {
  "Light Themes": ["light", "cupcake", "bumblebee", "emerald", "corporate", "lofi", "pastel", "lemonade", "winter", "acid", "fantasy"],
  "Dark Themes": ["dark", "synthwave", "halloween", "forest", "black", "luxury", "dracula", "night", "coffee"],
  "Special Themes": ["dim", "nord", "sunset", "retro", "cyberpunk", "valentine", "garden", "aqua", "wireframe", "cmyk", "autumn", "business"]
};

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Themes");
  
  // Filter themes based on search term and active category
  const filteredThemes = searchTerm 
    ? THEMES.filter(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
    : activeCategory === "All Themes" 
      ? THEMES
      : THEME_CATEGORIES[activeCategory] || [];
  
  // Special theme identifiers to help distinguish similar-looking themes
  const getThemeIcon = (themeName) => {
    switch(themeName) {
      case 'dim': return <LightbulbOff className="w-3 h-3 absolute top-0 left-0 text-base-content" title="Dim - A subtle dark theme"/>;
      case 'nord': return <SunMoon className="w-3 h-3 absolute top-0 left-0 text-base-content" title="Nord - A cool blue dark theme"/>;
      case 'sunset': return <PaintBucket className="w-3 h-3 absolute top-0 left-0 text-base-content" title="Sunset - A warm dark theme"/>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen container mx-auto px-4 pt-20 max-w-5xl pb-10">
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-primary">Theme Settings</h2>
          <p className="text-sm text-base-content/70">Customize the look and feel of your chat interface</p>
        </div>

        {/* Search and category filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50" />
            <input 
              type="text"
              placeholder="Search themes..." 
              className="input input-bordered pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="tabs tabs-boxed bg-base-200">
            <button 
              className={`tab ${activeCategory === "All Themes" ? "tab-active" : ""}`}
              onClick={() => setActiveCategory("All Themes")}
            >
              All
            </button>
            {Object.keys(THEME_CATEGORIES).map(category => (
              <button 
                key={category} 
                className={`tab ${activeCategory === category ? "tab-active" : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                {category.replace(" Themes", "")}
              </button>
            ))}
          </div>
        </div>

        {searchTerm && filteredThemes.length === 0 && (
          <div className="text-center py-6">No themes match your search</div>
        )}

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {filteredThemes.map((t) => (
            <button
              key={t}
              className={`
                group flex flex-col items-center gap-1.5 p-3 rounded-lg transition-all
                ${theme === t ? "ring-2 ring-primary bg-base-200" : "hover:bg-base-200/50"}
              `}
              onClick={() => setTheme(t)}
            >              <div className={`relative h-12 w-full rounded-md overflow-hidden ${t === "dim" || t === "nord" || t === "sunset" ? "border-2" : ""} ${
                t === "dim" ? "border-gray-500" : 
                t === "nord" ? "border-blue-500" : 
                t === "sunset" ? "border-orange-500" : ""
              } ${theme === t && t === "dim" ? "theme-dim-active" : 
                 theme === t && t === "nord" ? "theme-nord-active" : 
                 theme === t && t === "sunset" ? "theme-sunset-active" : ""
              }`} data-theme={t}>
                {getThemeIcon(t)}
                <div className="absolute inset-0 grid grid-cols-5 gap-px p-1">
                  <div className="rounded bg-primary"></div>
                  <div className="rounded bg-secondary"></div>
                  <div className="rounded bg-accent"></div>
                  <div className="rounded bg-neutral"></div>
                  <div className="rounded bg-base-300"></div>
                </div>
                
                {/* Enhanced indicators for similar dark themes */}                {t === "dim" && (
                  <div className="absolute inset-0 flex flex-col">
                    <div className="h-1/3 w-full bg-gradient-to-r from-gray-800/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 text-center text-xs px-1.5 py-0.5 bg-gray-600 text-white font-bold">
                      DIM • SUBTLE
                    </div>
                    <div className="absolute top-0 right-0 w-5 h-5 rounded-bl overflow-hidden">
                      <div className="w-full h-full bg-gray-500 flex items-center justify-center">
                        <LightbulbOff className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                )}
                {t === "nord" && (
                  <div className="absolute inset-0 flex flex-col">
                    <div className="h-1/3 w-full bg-gradient-to-r from-blue-900/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 text-center text-xs px-1.5 py-0.5 bg-blue-600 text-white font-bold">
                      NORD • COOL
                    </div>
                    <div className="absolute top-0 right-0 w-5 h-5 rounded-bl overflow-hidden">
                      <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                        <SunMoon className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                )}
                {t === "sunset" && (
                  <div className="absolute inset-0 flex flex-col">
                    <div className="h-1/3 w-full bg-gradient-to-r from-orange-800/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 text-center text-xs px-1.5 py-0.5 bg-orange-600 text-white font-bold">
                      SUNSET • WARM
                    </div>
                    <div className="absolute top-0 right-0 w-5 h-5 rounded-bl overflow-hidden">
                      <div className="w-full h-full bg-orange-500 flex items-center justify-center">
                        <PaintBucket className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <span className="text-xs font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Preview Section */}
        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
          <div className="p-4 bg-base-200">
            <div className="max-w-lg mx-auto">
              {/* Mock Chat UI */}
              <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                {/* Chat Header */}                <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                      D
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Derric</h3>
                      <p className="text-xs text-base-content/70">Online</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`
                          max-w-[80%] rounded-xl p-3 shadow-sm
                          ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200"}
                        `}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`
                            text-[10px] mt-1.5
                            ${message.isSent ? "text-primary-content/70" : "text-base-content/70"}
                          `}
                        >
                          12:00 PM
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-base-300 bg-base-100">
                  <div className="flex gap-2">                    <input
                      type="text"
                      className="input input-bordered flex-1 text-sm h-10"
                      placeholder="Type a message..."
                      value="Looking great with this theme!"
                      readOnly
                    />
                    <button className="btn btn-primary h-10 min-h-0">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
