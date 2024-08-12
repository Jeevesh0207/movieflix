import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import searchRoutes from "./routes/search.route.js";

import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import { protectRoute } from "./middleware/protectRoute.js";
import mongoose from "mongoose";

const app = express();

const PORT = ENV_VARS.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ["https://movieflixbackend.vercel.app", "http://localhost:5173"];

app.options('*', cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movie", protectRoute, movieRoutes);
app.use("/api/v1/tv", protectRoute, tvRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);
app.use("/api", (req, res) => {
  res.send("Welcome to the API");
});

app.get('/', (req, res) => {
  res.send({
    msg: "Hi, I am Backend",
    success: true,
  });
});

if (ENV_VARS.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

mongoose.connect(ENV_VARS.MONGO_URI)
  .then(() => {
    console.log("Database is Ready...");
  })
  .catch((err) => {
    console.log("Error :" + err);
  });


app.listen(PORT, () => {
  console.log("Server started at http://localhost:" + PORT);
  // connectDB();
});
