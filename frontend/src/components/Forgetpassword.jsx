import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../axiosInstance';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    // e.preventDefault();
    // if (!email) return toast.error("Please enter your email");
    // try {
    //   setIsLoading(true);
    //   const res = await axiosInstance.post("/auth/forget-password", { email });
    //   toast.success(res.data.message || "Reset link sent! to your mail");
    //   setEmail('');
    // } catch (err) {
    //   toast.error(err?.response?.data?.message || "Failed to send reset link");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-400 to-yellow-300 flex items-center justify-center p-6">
      <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Forgot Password
        </h2>
        <form className="space-y-5" onSubmit={handleForgotPassword}>
          <div>
            <label className="block text-white font-medium mb-1">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/30 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition"
            disabled={isLoading}
          >
            {isLoading ? <ClipLoader/>: "Send Reset Link"}
          </button>
        </form>
        <p className="text-white text-sm text-center mt-4">
          <Link to="/login" className="underline">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
