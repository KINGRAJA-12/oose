import React from 'react';
import { Link } from 'react-router-dom';

const Getstarted = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-400 to-yellow-300 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-black mb-10 drop-shadow-lg">
        Object Oriented Software Design
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 text-center text-lg font-semibold shadow-2xl hover:scale-105 transition-transform text-white">
          <p className="mb-2 text-white">
            MADASAMY
          </p>
          <p className="mb-2 text-white">
            KARTHICK RAJA S
          </p>
        </div>
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 text-center shadow-2xl flex flex-col justify-between hover:scale-105 transition-transform">
          <p className="text-lg font-bold text-white">
            SOFTWARE PERSONAL MANAGEMENT SYSTEM
          </p>
          <Link to={"/home"} className="mt-4 px-6 py-2 bg-black text-white rounded-lg shadow-lg hover:shadow-yellow-400/50 transition duration-300">
            Get Start →
          </Link>
        </div>
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 shadow-2xl flex items-center justify-center hover:scale-105 transition-transform">
        <img
  src="https://www.rexx-systems.com/wp-content/uploads/2024/02/personalmanagement_software-1024x687.webp"
  alt="Interview Illustration"
  className="w-full h-auto rounded-xl"
/>

        </div>
      </div>
    </div>
  );
};

export default Getstarted;
