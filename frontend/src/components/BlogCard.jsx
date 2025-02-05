import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  return (
    <div className="border p-4 m-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      {blog.image && (
        <img
          src={`${import.meta.env.VITE_REACT_APP_API_URL}${blog.image}`}
          alt="Blog Cover"
          className="w-full h-48 object-cover rounded-md"
        />
      )}
      <h3 className="font-bold text-xl mb-2">{blog.title}</h3>
      <p className="text-gray-700 mb-4">{blog.content.slice(0, 100)}...</p>
      <Link to={`/blog/${blog._id}`} className="text-blue-500 hover:text-blue-700">
        Read more
      </Link>
    </div>
  );
};