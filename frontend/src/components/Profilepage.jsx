import React, { useState, useEffect } from 'react';
import { FaMale, FaFemale, FaRupeeSign, FaSignOutAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { axiosInstance } from '../axiosInstance.js';
import { ClipLoader } from 'react-spinners';
import useAuth from '../Hooks/useAuth';

const Profilepage = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalPresentDays: 0,
    totalDays: 0,
    details: [],
  });
  const { logoutHandle } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;

      try {
        setLoading(true);

        const [presentRes, summaryRes] = await Promise.all([
          axiosInstance.get(`/user/get-total-present/${user?._id}`),
          axiosInstance.get(`/user/get-analysis/${user?._id}`),
        ]);
        console.log(presentRes,summaryRes)
        setAnalytics({
          totalPresentDays: presentRes?.data?.totalDays || 0,
          totalDays: summaryRes?.data?.totalPresentDays || 0,
          details: summaryRes?.data?.details || [],
        });
        console.log(analytics)
      } catch (err) {
        toast.error('Failed to load your profile or analytics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logoutHandle();
      window.location.reload()
    } catch (err) {
      console.log(err?.message);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-400 to-yellow-300 flex items-center justify-center">
        <ClipLoader size={40} color="white" />
        <p className="ml-4 text-white text-lg">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br relative from-purple-500 via-pink-400 to-yellow-300 flex items-center justify-center p-6">
      <button
        type="button"
        className="absolute z-20 top-10 right-10 text-white hover:text-gray-300"
        title="Logout"
        onClick={handleLogout}
      >
        <FaSignOutAlt size={24} />
      </button>

      <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Your Profile</h2>
        <div className="flex items-center space-x-6 mb-8">
          <img
            src={user?.image}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-white"
          />
          <div>
            <p className="text-white text-2xl font-semibold">{user?.name}</p>
            <p className="text-sm text-white opacity-80">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center">
            <p className="text-white font-medium flex items-center gap-2">
              <FaRupeeSign /> Salary
            </p>
            <p className="text-white">{user?.salary} Rs / day</p>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-white font-medium flex items-center gap-2">
              {user?.gender === 'M' ? <FaMale /> : <FaFemale />} Gender
            </p>
            <p className="text-white">{user?.gender === 'M' ? 'Male' : 'Female'}</p>
          </div>
        </div>

        <div className="bg-white/20 p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-white mb-4">Attendance Analysis</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                <p className="text-white text-xl">{analytics.totalPresentDays}</p>
              </div>
              <p className="text-white text-sm mt-2">Total Present Days</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                <p className="text-white text-xl">{analytics.totalDays}</p>
              </div>
              <p className="text-white text-sm mt-2">This Month Days</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center">
                <p className="text-white text-xl">
                  {analytics.totalDays > 0
                    ? `${Math.round((analytics.totalPresentDays / analytics.totalDays) * 100)}%`
                    : '0%'}
                </p>
              </div>
              <p className="text-white text-sm mt-2">Attendance Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profilepage;
