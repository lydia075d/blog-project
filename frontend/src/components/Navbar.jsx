import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const [userId, setUserId] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token); 
        setUserId(decodedToken.id); // ✅ Store the userId in state
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token"); // ✅ Clear invalid token
      }
    }
  }, []); // ✅ Runs only on component mount

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = `${import.meta.env.VITE_CLIENT_URL}/login`;
  };

  return (
    <nav className="w-full bg-black p-4">
      <ul className="flex justify-between text-white">
        <li><Link to="/home" className="hover:text-gray-300">Home</Link></li>
        <li><Link to="/create-blog" className="hover:text-gray-300">Create Blog</Link></li>
        {userId !== null ? (
          <li><Link to={`/profile/${userId}`} className="hover:text-gray-300">Profile</Link></li>
        ) : null}

        {!userId ? (
          <>
            <li><Link to="/login" className="hover:text-gray-300">Login</Link></li>
            <li><Link to="/signup" className="hover:text-gray-300">Sign Up</Link></li>
          </>
        ) : (
          <li><button onClick={handleLogout} className="hover:text-gray-300">Logout</button></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
