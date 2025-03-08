import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import connectDB from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const frontendPath = path.join(__dirname, "frontend", "dist");

if (process.env.NODE_ENV === "production") {
  console.log("Serving static files from:", frontendPath);
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    const indexPath = path.join(frontendPath, "index.html");
    console.log("Looking for index.html at:", indexPath);
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error("Error serving index.html:", err);
        res.status(500).send("Internal Server Error");
      }
    });
  });
}

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
