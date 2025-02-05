import React from 'react';

const ProfileCard = ({ user }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md text-center">
      <img
        src={user.profileImage || "https://via.placeholder.com/150"}
        alt="profile"
        className="w-24 h-24 rounded-full mx-auto mb-4"
      />
      <h3 className="text-xl font-bold">{user.username}</h3>
      <p className="text-gray-700">{user.bio || "No bio available."}</p>
    </div>
  );
};

export default ProfileCard;