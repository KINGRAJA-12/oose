import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaTimes, FaCloudUploadAlt } from 'react-icons/fa';
import { axiosInstance } from '../axiosInstance';
import { ClipLoader } from 'react-spinners';

const UpdateEmployeeModal = ({ handleVis, existingData }) => {
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState('');
  const [salary, setSalary] = useState('');
  const [gender, setGender] = useState('');
  const [isLoading, setIsLoading] = useState(false); // loading state

  useEffect(() => {
    if (existingData) {
      setEmail(existingData.email || '');
      setSalary(existingData.salary || '');
      setGender(existingData.gender || 'M');
      setImage(existingData.image || null);
    }
  }, [existingData]);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const updatedData = {
        email,
        salary,
        gender,
        image,
      };

      await axiosInstance.post(`/admin/update-exployee/${existingData?._id}`, updatedData);
      toast.success("Employee updated successfully!");
      handleVis(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update employee.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <button
          onClick={() => handleVis(false)}
          className="absolute top-3 right-3 text-white hover:text-red-300"
        >
          <FaTimes size={20} />
        </button>
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Update Employee</h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded-lg bg-white/30 text-white placeholder-white focus:outline-none"
          />

          <div className="w-full flex items-center gap-4">
            <div className="w-24 h-24 bg-white/30 rounded-lg flex items-center justify-center overflow-hidden shadow-md">
              {image ? (
                <img
                  src={image}
                  alt="Employee"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-xs text-center px-2">No Image</span>
              )}
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="update-file"
                className="flex items-center gap-2 bg-purple-700 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-purple-800 transition"
              >
                <FaCloudUploadAlt />
                <span>Change Image</span>
              </label>
              <span className="text-xs text-gray-400 mt-1">Only JPG/PNG, max 5MB</span>
              <input
                id="update-file"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </div>
          </div>

          <input
            type="number"
            placeholder="Salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full p-2 rounded-lg bg-white/30 text-white placeholder-white focus:outline-none"
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-2 rounded-lg bg-white/30 text-white focus:outline-none"
          >
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>

          <button
            type="button"
            onClick={handleUpdate}
            disabled={isLoading}
            className="w-full bg-purple-700 text-white py-2 rounded-lg font-semibold hover:bg-purple-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? <ClipLoader color="#fff" size={20} /> : 'Update Employee'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateEmployeeModal;
