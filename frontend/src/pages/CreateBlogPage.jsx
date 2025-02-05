import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateBlogPage = ({ addBlog }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Title and content are required.");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    const res = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/blogs`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      const newBlog = await res.json();
      console.log("New Blog Created:", newBlog); // Log the new blog
      addBlog(newBlog);  // Should now work properly
      alert("Blog created successfully!");
      navigate("/home");
    } else {
      const errorData = await res.json();
      alert(`Error: ${errorData.message || "Failed to create blog"}`);
    }
  };
  console.log('addBlog function in HomePage:', addBlog);  // Log it here

  console.log("addBlog:", addBlog);  // Move it here to check when the component renders

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-8">
      <div className="bg-gray-500 text-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Create a New Blog</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 text-gray-900 rounded-lg"
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full px-4 py-2 text-gray-900 rounded-lg"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 bg-white"
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">
            Create Blog
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogPage;
