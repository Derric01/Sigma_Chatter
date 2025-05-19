import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useThemeStore } from "../store/useThemeStore";

import AuthImagePattern from "../Components/AuthImagePattern";
import toast from "react-hot-toast";

// const SignUpPage = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//   });

//   const { signup, isSigningUp } = useAuthStore();

//   const validateForm = () => {
//     if (!formData.fullName.trim()) return toast.error("Full name is required");
//     if (!formData.email.trim()) return toast.error("Email is required");
//     if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
//     if (!formData.password) return toast.error("Password is required");
//     if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

//     return true;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const success = validateForm();

//     if (success === true) signup(formData);
//   };

//   return (
//     <div className="min-h-screen grid lg:grid-cols-2">
//       {/* left side */}
//       <div className="flex flex-col justify-center items-center p-6 sm:p-12">
//         <div className="w-full max-w-md space-y-8">
//           {/* LOGO */}
//           <div className="text-center mb-8">
//             <div className="flex flex-col items-center gap-2 group">
//               <div
//                 className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
//               group-hover:bg-primary/20 transition-colors"
//               >
//                 <MessageSquare className="size-6 text-primary" />
//               </div>
//               <h1 className="text-2xl font-bold mt-2">Create Account</h1>
//               <p className="text-base-content/60">Get started with your free account</p>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-medium">Full Name</span>
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <User className="size-5 text-base-content/40" />
//                 </div>
//                 <input
//                   type="text"
//                   className={`input input-bordered w-full pl-10`}
//                   placeholder="John Doe"
//                   value={formData.fullName}
//                   onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
//                 />
//               </div>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-medium">Email</span>
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail className="size-5 text-base-content/40" />
//                 </div>
//                 <input
//                   type="email"
//                   className={`input input-bordered w-full pl-10`}
//                   placeholder="you@example.com"
//                   value={formData.email}
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 />
//               </div>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-medium">Password</span>
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="size-5 text-base-content/40" />
//                 </div>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   className={`input input-bordered w-full pl-10`}
//                   placeholder="••••••••"
//                   value={formData.password}
//                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                 />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="size-5 text-base-content/40" />
//                   ) : (
//                     <Eye className="size-5 text-base-content/40" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
//               {isSigningUp ? (
//                 <>
//                   <Loader2 className="size-5 animate-spin" />
//                   Loading...
//                 </>
//               ) : (
//                 "Create Account"
//               )}
//             </button>
//           </form>

//           <div className="text-center">
//             <p className="text-base-content/60">
//               Already have an account?{" "}
//               <Link to="/login" className="link link-primary">
//                 Sign in
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* right side */}

//       <AuthImagePattern
//         title="Join our community"
//         subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
//       />
//     </div>
//   );
// };
// export default SignUpPage;

import React from 'react';
// Removed duplicate imports as they're already imported at the top of the file

// Custom Sigma Logo Component with muscular styling

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

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const { signup, isSigningUp } = useAuthStore();
  // Only import useThemeStore if we actually need it
  useThemeStore(); // Keep the hook if it has side effects, or remove it if not needed

  const validateForm = () => {
    if (!formData.fullName?.trim()) return toast.error("Full name is required");
    if (!formData.email?.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formData);
  };
    return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-base-100">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center 
                group-hover:shadow-lg transition-all duration-300"
              >
                <SigmaLogo className="w-9 h-9 text-primary-content" />
              </div>
              <h1 className="text-3xl font-bold mt-3 text-base-content">Create Account</h1>
              <p className="text-base-content/70 text-lg">Join Sigma_Chatter today</p>
            </div>
          </div>          <form onSubmit={handleSubmit} className="space-y-6 bg-base-200 p-7 rounded-xl shadow-lg border border-base-300 auth-form">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-1.5">
                  <User className="w-4 h-4 text-primary" /> Full Name
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="input input-bordered w-full transition-all duration-200 focus:border-primary"
                  placeholder="John Doe"
                  value={formData.fullName || ''}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-primary" /> Email
                </span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  className="input input-bordered w-full transition-all duration-200 focus:border-primary"
                  placeholder="you@example.com"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-primary" /> Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full transition-all duration-200 focus:border-primary"
                  placeholder="••••••••"
                  value={formData.password || ''}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-base-content/60" />
                  ) : (
                    <Eye className="w-5 h-5 text-base-content/60" />
                  )}
                </button>
              </div>
            </div>            <button 
              type="submit" 
              className="btn btn-primary w-full hover:shadow-md transition-all duration-300" 
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/70">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title="Join Sigma_Chatter"
        subtitle="Connect with friends, share moments, and stay in touch with your network."
      />
    </div>
  );
};

export default SignUpPage;