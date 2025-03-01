import React, { useState, useEffect } from "react";

const CommentSection = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/blogs/${blogId}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((error) => console.error("Error fetching comments:", error));
  }, [blogId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, user might not be logged in.");
        return;
      }
            const res = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/blogs/${blogId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ content: comment }),
      });
  
      if (!res.ok) throw new Error("Failed to post comment");
  
      const createdComment = await res.json();
      setComments([...comments, createdComment.comment]);
      setComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };
  
  return (
    <div className="comments mt-6">
      <h4 className="text-xl font-bold mb-4">Comments:</h4>
      <ul className="mb-4">
        {comments.map((c, index) => (
          <li key={index} className="mb-2 p-2 bg-gray-100 rounded-lg">
            {c.content}
          </li>
        ))}
      </ul>
      <form onSubmit={handleCommentSubmit} className="flex flex-col">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment"
          className="p-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
