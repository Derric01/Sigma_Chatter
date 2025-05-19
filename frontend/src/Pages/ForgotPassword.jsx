import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { axiosInstance } from "../lib/axios";
import toast from 'react-hot-toast';
import AuthImagePattern from "../Components/AuthImagePattern";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsLoading(true);
    try {
      // This is a placeholder - backend needs to implement this endpoint
      await axiosInstance.post('/auth/forgot-password', { email });
      setIsSuccess(true);
      toast.success("Recovery email sent! Check your inbox.");
    } catch (error) {
      console.error("Error requesting password reset:", error);
      toast.error("Unable to process your request. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4 overflow-hidden relative">
      <AuthImagePattern />
      
      <div className="card w-full max-w-md bg-base-100 shadow-xl z-10">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-6">Password Recovery</h2>
          
          {!isSuccess ? (
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="input input-bordered"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-control mt-6">
                <button 
                  className="btn btn-primary" 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Recovery Email"}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="text-success text-5xl mb-4">✓</div>
              <h3 className="text-xl font-semibold mb-2">Email Sent!</h3>
              <p className="mb-4">Check your email for recovery instructions.</p>
              <Link to="/login" className="btn btn-outline">Back to Login</Link>
            </div>
          )}
          
          <div className="divider">OR</div>
          
          <div className="text-center">
            <Link to="/login" className="link link-hover">
              Remember your password? Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
