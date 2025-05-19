// 
import { SigmaIcon } from "lucide-react";

// Custom Sigma Logo Component with muscular styling
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

const AuthImagePattern = ({ title, subtitle }) => {
  // theme is inherited from parent through data-theme on root element
    return (
    <div className="hidden lg:flex items-center justify-center relative auth-container p-12 overflow-hidden">
      {/* Theme-adaptive background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute w-96 h-96 rounded-full bg-primary-content/20 -top-20 -right-20"></div>
        <div className="absolute w-96 h-96 rounded-full bg-primary-content/10 bottom-20 -left-20"></div>
        <div className="absolute inset-0 pattern-overlay"></div>
      </div>
        <div className="relative z-10 max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-primary-content/10 border border-primary-content/20 backdrop-blur-sm ${
                i === 4 ? "flex items-center justify-center" : i % 2 === 0 ? "animate-pulse" : ""
              }`}
            >
              {i === 4 && <SigmaLogo className="w-12 h-12 text-primary-content" />}
            </div>
          ))}
        </div>
        
        <h2 className="text-3xl font-bold mb-4 text-primary-content">{title}</h2>
        <p className="text-primary-content/80 text-xl">{subtitle}</p>
        
        <div className="mt-12 flex items-center justify-center gap-2">
          <span className="px-4 py-2 bg-primary-content/10 rounded-full border border-primary-content/20 text-primary-content font-semibold flex items-center gap-2">
            <SigmaLogo className="w-5 h-5" />
            Sigma_Chatter
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthImagePattern;