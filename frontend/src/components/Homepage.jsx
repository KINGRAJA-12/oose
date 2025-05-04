import React, { useEffect, useState } from 'react';
import { FaTrashAlt, FaSignOutAlt, FaSearch, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd } from 'react-icons/io';
import AddEmployeeModal from './AddEmployeeModal';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { axiosInstance } from '../axiosInstance';
import useAuth from '../Hooks/useAuth';

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [vis, setVis] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [users, setUsers] = useState([]);
  const { logoutHandle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axiosInstance.get('/admin/get-all-employee');
        setUsers(res.data);
      } catch (err) {
        toast.error(err?.message || 'Failed to fetch users');
      } finally {
        setIsFetching(false);
      }
    };

    fetchAll();
  }, [vis]);

  const handleLogout = async () => {
    try {
      await logoutHandle();
      window.location.reload()
    } catch (err) {
      console.log(err?.message);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axiosInstance.get(`/admin/delete-employee/${userId}`);
      toast.success('User deleted successfully');
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (err) {
      toast.error(err?.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVis = (info) => {
    setVis(info);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-400 to-yellow-300 flex items-center justify-center p-6 relative">
      <button
        type="button"
        className="absolute top-6 right-6 text-white hover:text-gray-300"
        title="Logout"
        onClick={handleLogout}
      >
        <FaSignOutAlt size={24} />
      </button>

      <Link
        to={"/profile"}
        type="button"
        className="absolute top-6 right-14 text-white hover:text-gray-300"
        title="Profile"
      >
        <FaUser size={24} />
      </Link>

      <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-white mb-6">User List</h2>

        <div className="flex justify-between items-center mb-6">
          <div className="relative w-2/3 sm:w-1/2">
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/30 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
            />
            <div className="absolute right-0 top-0 bottom-0 px-4 py-2 bg-purple-600 text-white rounded-r-lg">
              <FaSearch />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setVis(true)}
            className="bg-green-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-600 transition flex items-center gap-2"
          >
            <IoMdAdd />
          </button>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {isFetching ? (
            <div className="text-center text-white py-10">
              <ClipLoader size={30} color="white" />
              <p>Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <p className="text-white text-center">No users found.</p>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user?._id || user.email}
                className="flex items-center justify-between bg-white/30 p-4 rounded-lg hover:bg-white/40 transition"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={user?.image}
                    alt={user.name || 'User'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-white font-semibold">{user?.name || 'Unnamed'}</p>
                    <p className="text-sm text-white">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Link
                    to={`/view/${user?._id}`}
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 text-sm"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => deleteUser(user._id)}
                    className="text-red-500 hover:text-red-700 transition"
                    title="Delete User"
                  >
                    <FaTrashAlt size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {vis && <AddEmployeeModal handleVis={handleVis} />}
    </div>
  );
};

export default Homepage;
