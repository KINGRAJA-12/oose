import React, { useState, useEffect } from 'react';
import UpdateEmployeeModal from './EditEmployeeModal';
import { FaEdit, FaMale, FaFemale, FaRupeeSign, FaCheckCircle, FaCalendarAlt, FaShareAlt, FaCopy } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { axiosInstance } from '../axiosInstance';
import { ClipLoader } from 'react-spinners';

const Viewpage = () => {
  const [user, setUser] = useState(null);
  const [vis, setVis] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalPresentDays: 0,
    totalDays: 0,
    details: [],
  });

  const { id } = useParams();

  const handleVis = (info) => setVis(info);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [userRes, presentRes, summaryRes] = await Promise.all([
          axiosInstance.get(`/admin/view-employee/${id}`),
          axiosInstance.get(`/user/get-total-present/${id}`),
          axiosInstance.get(`/user/get-analysis/${id}`),
        ]);

        setUser(userRes?.data?.user);
        setAnalytics({
          totalPresentDays: presentRes?.data?.totalDays || 0,
          totalDays: summaryRes?.data?.totalPresentDays || 0,
          details: summaryRes?.data?.details || [],
        });
      } catch (err) {
        toast.error('Failed to load user data or analytics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);
  let handleShareWhatsApp=(url)=>{
    try{
    let whatsapp=`https://wa.me/?text=Username: ${user?.name}\nEmail: ${user?.email}\nSalary: ${user?.salary} Rs/day;`;
    window.open(whatsapp,"_blank")
    }catch(err){
      toast.error(err.message||"something went wrong")
    }
  }
  const handleShare = () => {
    const userInfo = `Username: ${user?.name}\nEmail: ${user?.email}\nSalary: ${user?.salary} Rs/day`;
    navigator.clipboard.writeText(userInfo).then(() => {
      toast.success('User info copied to clipboard!');
    }).catch((err) => {
      toast.error('Failed to copy user info');
      console.error(err);
    });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-400 to-yellow-300 flex items-center justify-center">
        <ClipLoader size={40} color="white" />
        <p className="ml-4 text-white text-lg">Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-400 to-yellow-300 flex items-center justify-center p-6">
      <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Profile View</h2>

        <div className="flex items-center space-x-6 mb-8">
          <img
            src={user?.image}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <p className="text-white text-2xl font-semibold">{user?.name}</p>
            <p className="text-sm text-white">{user?.email}</p>
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

        <div className="bg-white/20 p-6 rounded-xl mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">Data Analysis</h3>
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
              <p className="text-white text-sm mt-2">This Month Attendance Records</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center">
                <p className="text-white text-xl">
                  {analytics.totalDays > 0
                    ? `${Math.round(
                        (analytics.totalPresentDays / analytics.totalDays) * 100
                      )}%`
                    : '0%'}
                </p>
              </div>
              <p className="text-white text-sm mt-2">Attendance Rate</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            className="bg-green-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-600 transition"
            onClick={() => setVis(true)}
          >
            <FaEdit />
          </button>
          <button
            className="bg-blue-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-600 transition"
            onClick={handleShareWhatsApp}
          >
            <FaCopy />
          </button>
          <button
            className="bg-yellow-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-yellow-600 transition"
            onClick={handleShareWhatsApp}
          >
            <FaShareAlt />
          </button>
        </div>
      </div>

      {vis && <UpdateEmployeeModal handleVis={handleVis} existingData={user} />}
    </div>
  );
};

export default Viewpage;
``