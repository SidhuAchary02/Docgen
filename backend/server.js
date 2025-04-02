import dotenv from "dotenv";
import express from "express";
import connectDB from "./db.js";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import "./config/passport.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import docsRoutes from "./routes/docsRoutes.js";

dotenv.config();
const PORT = 8000;
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Debugging: Log session creation
app.use((req, res, next) => {
  console.log("Session:", req.session); // Debugging: Log the session
  console.log("User:", req.user); // Debugging: Log the user object
  next();
});

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/docs", docsRoutes);

// Start Server
connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
