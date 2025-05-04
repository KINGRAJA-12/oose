import React, { useState } from 'react';
import useAuth from '../Hooks/useAuth';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import { Link, useNavigate } from 'react-router-dom';

const Loginpage = () => {
  let [username, setUsername] = useState('');
  let [password, setPassword] = useState('');
  let { isLogin, login } = useAuth();
  let navigate=useNavigate();
  let handleLogin = async () => {
    try {
      if (!username || !password) return toast.error('Please provide valid credentials');
      await login({ username, password });
      window.location.reload()
      setUsername('');
      setPassword('');
    } catch (err) {
      console.log(err?.message);
      toast.error(err?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-400 to-yellow-300 flex items-center justify-center p-6">
      <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Welcome Back
        </h2>
        <div className="space-y-5">
          <div>
            <label className="block text-white font-medium mb-1">Username</label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="A12RELA123"
              className="w-full px-4 py-2 rounded-lg bg-white/30 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-1">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg bg-white/30 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <button
            type="button"
            className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition"
            onClick={handleLogin}
          >
            {isLogin ? <ClipLoader size={20} color="white" /> : "Login"}
          </button>
        </div>
        <p className="text-white text-sm text-center mt-4">
           <Link to="/forget-password" className="underline">Forget password</Link>
        </p>
      </div>
    </div>
  );
};

export default Loginpage;
