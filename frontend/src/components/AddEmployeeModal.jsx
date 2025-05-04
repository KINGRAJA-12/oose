import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaTimes, FaCloudUploadAlt } from 'react-icons/fa';
import useAuth from '../Hooks/useAuth';
import { ClipLoader } from 'react-spinners';

const AddEmployeeModal = ({ handleVis }) => {
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [salary, setSalary] = useState('');
  const [gender, setGender] = useState('');
  const { isCreate, createEmployee } = useAuth();

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

  const handleCreate = async () => {
    try {
      if (!email || !password || !salary || !gender || !image) {
        return toast.error("All fields are required");
      }

      await createEmployee({ email, password, salary, gender, image });
      setEmail('');
      setPassword('');
      setSalary('');
      setGender('');
      setImage(null);
      handleVis(false)
    } catch (err) {
      console.log(err?.message);
      toast.error(err?.message || "Failed to create employee");
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

        <h2 className="text-2xl font-bold text-white mb-4 text-center">Add New Employee</h2>

        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 rounded-lg bg-white/30 text-white placeholder-white focus:outline-none"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
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
                htmlFor="file"
                className="flex items-center gap-2 bg-purple-700 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-purple-800 transition"
              >
                <FaCloudUploadAlt />
                <span>Select Image</span>
              </label>
              <span className="text-xs text-gray-400 mt-1">Only JPG/PNG, max 5MB</span>
              <input
                id="file"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </div>
          </div>

          <input
            type="text"
            value={salary}
            placeholder="Salary"
            className="w-full p-2 rounded-lg bg-white/30 text-white placeholder-white focus:outline-none"
            onChange={(e) => setSalary(e.target.value)}
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-2 rounded-lg bg-white/30 text-white focus:outline-none"
          >
            <option value="" disabled>Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>

          <button
            type="button"
            className="w-full bg-purple-700 text-white py-2 rounded-lg font-semibold hover:bg-purple-800 transition"
            disabled={isCreate}
            onClick={handleCreate}
          >
            {isCreate ? <ClipLoader size={20} color="white" /> : "Add Employee"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
