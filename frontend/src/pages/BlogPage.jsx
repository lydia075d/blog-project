import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CommentSection from "../components/CommentSection.jsx";

const BlogPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate(); // to redirect the user after deletion

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/blogs/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch blog");
        }
        return res.json();
      })
      .then((data) => setBlog(data))
      .catch((error) => console.error("Error fetching blog:", error));
  }, [id]);

  const deleteBlog = () => {
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
        // Redirect after successful deletion
        navigate("/"); // Redirect to home or any page you prefer
      })
      .catch((error) => console.error("Error deleting blog:", error));
  };

  if (!blog) return <div className="text-center text-gray-600 text-lg">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{blog.title}</h2>
      
      {blog.image && (
        <img
          src={`${import.meta.env.VITE_REACT_APP_IMAGE_URL}${blog.image.replace("uploads/", "")}`}
          alt="Blog Cover"
          className="w-full h-64 object-cover rounded-md mb-4"
        />
      )}

      <p className="text-gray-700 mb-4">{blog.content}</p>

      {/* Delete button (only visible if the user is authorized) */}
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
