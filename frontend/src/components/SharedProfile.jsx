import React from 'react';

const SharedProfile = ({ user }) => {
  const shareProfile = () => {
    const profileLink = `${window.location.origin}/profile/${user.username}`;
    navigator.clipboard.writeText(profileLink).then(() => {
      alert(`Profile link copied to clipboard: ${profileLink}`);
    });
  };

  return (
    <div>
      <button
        onClick={shareProfile}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-300"
      >
        Share Profile
      </button>
    </div>
  );
};

export default SharedProfile;