import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const ChatBox = ({ currentUser, targetUser }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_REACT_APP_SOCKET_URL, {
      transports: ["websocket"], 
      query: { token: localStorage.getItem("token") }, 
    });
  
    socketRef.current.on("connect", () => {
      console.log("Connected to WebSocket server");
    });
  
    socketRef.current.on("message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  
    return () => {
      socketRef.current.disconnect();
    };
  }, []);
  

  const sendMessage = () => {
    if (message.trim() === "") return;
    const newMessage = { sender: currentUser, receiver: targetUser, text: message };

    socketRef.current.emit("message", newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <div className="chat-box border p-4 rounded-lg shadow-md w-80">
      <h3 className="text-xl font-bold mb-4">Chat with {targetUser}</h3>
      <div className="messages h-48 overflow-y-auto mb-4 border p-2 rounded-md bg-gray-100">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.sender === currentUser ? "text-blue-600" : "text-gray-800"}`}>
              <span className="font-semibold">{msg.sender}: </span>
              <span>{msg.text}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No messages yet.</p>
        )}
      </div>
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
          className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 transition-colors duration-300"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
