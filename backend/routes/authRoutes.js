import express from "express";
import passport from "passport";
import User from "../models/User.js";

const router = express.Router();

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email", "repo"] })
);

// router.get(
//   "/github/callback",
//   passport.authenticate("github", { failureRedirect: "/login" }),
//   (req, res) => {
//     res.cookie("accessToken", req.user.accessToken, {
//       httpOnly: false,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       maxAge: 1000 * 60 * 60 * 24,
//     });

//     res.redirect("http://localhost:5173/repos");
//   }
// );

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("User after authentication:", req.user); // Debugging: Log the user object
    if (!req.user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    res.cookie("accessToken", req.user.accessToken, {
      httpOnly: false,
      // secure: process.env.NODE_ENV === "production",
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    });

    // Debugging: Log the session and cookies
    console.log("Session after authentication:", req.session);
    console.log("Cookies after authentication:", req.cookies);

    res.redirect("http://localhost:5173/repos");
  }
);

export default router;
