const mongoose = require("mongoose");
require("dotenv").config();

const DB_URI = import.meta.env.DB_URI;

const testConnection = async () => {
  try {
    const conn = await mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB at:", conn.connection.host);
    process.exit();
  } catch (error) {
    console.error("Connection failed:", error);
    process.exit(1);
  }
};

testConnection();