import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const Home = () => {
  return (
    <div>
      <Outlet/>
    </div>
  )
}

export default Home
