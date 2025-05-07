import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { axiosInstance } from '../axiosInstance';

const AttendanceSheet = ({ handleAttendnceVis, users }) => {
  const [attendance, setAttendance] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = (userId, status) => {
    setAttendance(prev => {
      const filtered = prev.filter(entry => entry.user !== userId);
      return [...filtered, { user: userId, status }];
    });
  };

  const handleSubmit = async () => {
    try {
      if (attendance.length === 0) {
        return toast.error("Please mark attendance before submitting.");
      }

      setIsSubmitting(true);
      let res=await axiosInstance.post('/admin/submit-attendance',{data:attendance});
      console.log("response",res?.data)
      toast.success("Attendance submitted!");
      setAttendance([]);
      handleAttendnceVis(false);
    } catch (err) {
      console.error(err);
      toast.error("Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative">
        <button
          onClick={() => handleAttendnceVis(false)}
          className="absolute top-3 right-3 text-white hover:text-red-300"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 text-center">Take Attendance</h2>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {users.map(user => (
            <div
              key={user?._id}
              className="flex items-center justify-between bg-white/30 p-3 rounded-lg text-white"
            >
              <div className="flex items-center gap-4">
                <img
                  src={user?.image}
                  alt={user?.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sm text-white/80">{user?.email}</p>
                </div>
              </div>

              <div className="w-[30%] flex sm:gap-2 gap-1">
                <button
                  disabled={attendance.some(item => item.user === user?._id)}
                  onClick={() => handleClick(user?._id, "Present")}
                  className="bg-green-500 sm:p-2 p-1 text-sm rounded-lg hover:bg-green-800 disabled:opacity-50"
                >
                  Present
                </button>
                <button
                  onClick={() => handleClick(user?._id, "Absent")}
                  className="bg-red-600 sm:p-2 p-1 text-sm rounded-lg hover:bg-red-800"
                >
                  Absent
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-6 w-full bg-purple-700 text-white py-2 rounded-lg font-semibold hover:bg-purple-800 transition"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? <ClipLoader size={20} color="white" /> : "Submit Attendance"}
        </button>
      </div>
    </div>
  );
};

export default AttendanceSheet;
