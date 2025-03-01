import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import ProfileCard from "../components/ProfileCard";
import ChatBox from "../components/ChatBox";
import SharedProfile from "../components/SharedProfile";

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token); 

    if (!token) {
      navigate("/login"); 
      return;
    }

    const apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}/profile/${id}`;
    console.log("Fetching Profile from:", apiUrl); 
  
    fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/profile/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => {
        console.log("Profile Data:", data);
        setUser(data);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        navigate("/login"); 
      });
  }, [id, navigate]);

  if (!user) return <div className="text-center text-gray-600 text-lg">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md">
      
        <ProfileCard user={user} />

     
        <div className="mt-6">
          <SharedProfile user={user} />
        </div>
      </div>

      <div className="mt-6 w-full max-w-md">
        <ChatBox currentUser={user.username} targetUser="admin" />
      </div>
    </div>
  );
};

export default ProfilePage;
