import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CommentSection from "../components/CommentSection.jsx";
import { FaHeart, FaRegHeart } from 'react-icons/fa'; 
const BlogPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [liked, setLiked] = useState(false); 
  const [likes, setLikes] = useState(0); 
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/blogs/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch blog");
        }
        return res.json();
      })
      .then((data) => {
        setBlog(data);
        setLikes(data.likes); 
        setLiked(data.userLiked);
      })
      .catch((error) => console.error("Error fetching blog:", error));
  }, [id]);

  const toggleLike = () => {
    const updatedLikes = liked ? likes - 1 : likes + 1;
    setLiked(!liked);
    setLikes(updatedLikes);

    fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/blogs/${id}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ liked: !liked }), 
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to toggle like");
        }
      })
      .catch((error) => console.error("Error liking blog:", error));
  };

  const deleteBlog = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;
  
    fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/blogs/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete blog");
        }
        navigate("/"); 
      })
      .catch((error) => console.error("Error deleting blog:", error));
  };
  

  if (!blog) return <div className="text-center text-gray-600 text-lg">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{blog.title}</h2>

      {blog.image && (
        <img
          src={`${import.meta.env.VITE_REACT_APP_IMAGE_URL}uploads/${blog.image.replace("uploads/", "")}`}
          alt="Blog Cover"
          className="w-full h-64 object-cover rounded-md mb-4"
        />
      )}

      <p className="text-gray-700 mb-4">{blog.content}</p>

      <div className="flex items-center mb-4">
        <div
          onClick={toggleLike}
          className={`cursor-pointer text-2xl ${liked ? 'text-red-500' : 'text-gray-500'}`}
        >
          {liked ? <FaHeart /> : <FaRegHeart />}
        </div>
        <span className="ml-2">{likes}</span>
      </div>

      <button
        onClick={deleteBlog}
        className="mt-4 text-white bg-red-500 hover:bg-red-700 px-4 py-2 rounded-md"
      >
        Delete Blog
      </button>

      <CommentSection blogId={id} />
    </div>
  );
};

export default BlogPage;
