import passport from "passport";
import GitHubStrategy from "passport-github2";
import axios from "axios";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/api/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Access Token:", accessToken); // Debugging: Log the access token
        console.log("GitHub Profile:", profile); // Debugging: Log the GitHub profile

        // Extract email from the profile
        let email = profile._json.email;

        // If email is not available in the profile, fetch it from the GitHub API
        if (!email) {
          const response = await axios.get("https://api.github.com/user/emails", {
            headers: { Authorization: `token ${accessToken}` },
          });

          const primaryEmail = response.data.find((email) => email.primary);
          if (!primaryEmail) return done(new Error("No primary email found"), null);
          email = primaryEmail.email;
        }

        // Extract username from the profile
        const username = profile.username || profile._json.login; // Ensure this line is present
        console.log("Extracted Username:", username); // Debugging: Log the username

        // Check if the user already exists in the database
        let user = await User.findOne({ email });

        if (!user) {
          console.log("Creating new user with username:", username); // Debugging: Log the username
          user = new User({
            name: profile.displayName || profile.username,
            email,
            plan: "hobby",
            provider: "github",
            githubId: profile.id,
            accessToken,
          });
          await user.save();
        }

        // Update the user's access token
        user.accessToken = accessToken;
        await user.save();

        return done(null, user);
      } catch (error) {
        console.error("Error during GitHub authentication:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// });

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return done(new Error("User not found"), null);
    }
    console.log("Deserialized user:", user); // Debugging: Log the deserialized user
    done(null, user);
  } catch (error) {
    console.error("Deserialization error:", error);
    done(error, null);
  }
});
