import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Homepage from './components/Homepage';
import Viewpage from './components/Viewpage';
import Getstarted from './components/Getstarted';
import Loginpage from './components/Loginpage';
import Home from './components/Home';
import { axiosInstance } from './axiosInstance.js';
import Profilepage from './components/Profilepage.jsx';
import ForgotPassword from './components/Forgetpassword.jsx';

const App = () => {
  let [user, setUser] = useState(null);
  let [auth, setAuth] = useState(false);

  useEffect(() => {
    let fetch = async () => {
      try {
        let res = await axiosInstance.get('/auth/getme');
        console.log(res?.data);
        setUser(res?.data);
        setAuth(true);
      } catch (err) {
        setUser(null);
        setAuth(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen w-full h-full">
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Getstarted />} />
          <Route
            path="home"
            element={
              user ? (user.role === 'admin' ? <Homepage /> : <Navigate to="/profile" />) : <Navigate to="/login" />
            }
          />
          <Route
            path="view/:id"
            element={user ? (user.role === 'admin' ? <Viewpage /> : <Navigate to="/home" />) : <Navigate to="/login" />}
          />
          <Route path='forget-password' element={user?<Navigate to={"/profile"}/>:<ForgotPassword/>}/>
          <Route path="login" element={user ? <Navigate to="/home" /> : <Loginpage />} />
          <Route path="profile" element={user ? <Profilepage user={user} /> : <Loginpage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
