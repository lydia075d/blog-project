import React, { useState, useEffect } from "react";
import BlogCard from "../components/BlogCard.jsx";
import { useNavigate } from "react-router-dom";
import CreateBlogPage from "./CreateBlogPage.jsx";  

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateBlog, setShowCreateBlog] = useState(false);
  const navigate = useNavigate();

  const addBlog = (newBlog) => {
    setBlogs((prevBlogs) => [...prevBlogs, newBlog]);
  };

  const fetchBlogs = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setLoading(true);
    setError(null);

    try {
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/blogs`, {
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }

      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Failed to fetch blogs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Effect hook to fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCreateBlogClick = () => {
    setShowCreateBlog(true);
  };

  const handleCreateBlogClose = () => {
    setShowCreateBlog(false);
    fetchBlogs(); // Optionally refresh the blogs after creating one
  };

  if (loading) {
    return <div className="text-center text-gray-700 mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 border border-gray-300 text-center">
        <div className="flex flex-col items-center">
          <header>
            <h1 className="text-3xl font-bold text-gray-800">Welcome to the Place of Curious Minds</h1>
            <p className="text-lg text-gray-600 mt-2">Let's adventure together</p>
          </header>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRurxTt1UbVDQfOEUXR7b7g2rq87vNA59TFFQ&s"
            alt="Adventure"
            className="w-full h-56 object-cover rounded-md mb-4"
          />
          <p className="text-gray-700 mt-4 leading-relaxed">
            Explore a world of ideas, knowledge, and adventures through our blogs.
          </p>
          {isAuthenticated && (
            <button
              onClick={handleCreateBlogClick}
              className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Create a New Blog
            </button>
          )}
        </div>
      </div>

      {showCreateBlog && <CreateBlogPage addBlog={addBlog} onClose={handleCreateBlogClose} />}

      <div className="w-full max-w-4xl mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {error && (
            <div className="text-center">
              <p className="text-red-500">{error}</p>
              <button
                onClick={fetchBlogs}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Retry Fetching Blogs
              </button>
            </div>
          )}

          {blogs.length > 0 ? (
            blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
          ) : (
            <div className="text-center">
              <p className="text-gray-500">No blogs available! Create one!!</p>
              <button
                onClick={fetchBlogs}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Refresh Blogs
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
