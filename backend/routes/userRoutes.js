import express from "express";
import cookieParser from "cookie-parser";
import User from "../models/User.js";
import Project from '../models/Project.js'
import fetch from "node-fetch"; // Ensure node-fetch is installed
import { ensureAuth } from "../middlewares/authMiddleware.js";
import { fetchUserRepositories } from "../services/githubService.js";

const router = express.Router();

router.use(cookieParser());

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

// Signup route
router.post("/signup", async (req, res) => {
  const { name, email, password, plan } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const user = new User({ name, email, password, plan });
    await user.save();

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/repos", ensureAuth, async (req, res) => {
  try {
    const repositories = await fetchUserRepositories(req.accessToken);
    res.json(repositories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching repositories", error: error.message });
  }
});

// Fetch branches for a repository
// router.get("/repos/:repoName/branches", ensureAuth, async (req, res) => {
//   const { repoName } = req.params; 
//   const accessToken = req.accessToken; 

//   console.log('User routes: ', req.user)
//   console.log('Username: ', req.user.username)

//   if (!accessToken) {
//     return res.status(401).json({ error: "Unauthorized: No access token found" });
//   }

//   try {
//     // Fetch branches from GitHub API
//     const response = await fetch(
//       `https://api.github.com/repos/${req.user.username}/${repoName}/branches`, // Use req.user.username
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           Accept: "application/vnd.github.v3+json",
//         },
//       }
//     );

//     if (!response.ok) {
//       // Handle GitHub API errors
//       const errorData = await response.json();
//       return res.status(response.status).json({
//         error: "GitHub API Error",
//         message: errorData.message || "Failed to fetch branches",
//       });
//     }

//     const branches = await response.json();
//     res.json(branches); // Return the list of branches
//   } catch (error) {
//     console.error("Error fetching branches:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// Fetch branches for a repository
router.get("/repos/:repoName/branches", ensureAuth, async (req, res) => {
  const { repoName } = req.params;
  const accessToken = req.accessToken;

  console.log("User routes: ", req.user); // Debugging: Log the user object
  console.log("Access Token: ", accessToken); // Debugging: Log the access token

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized: No access token found" });
  }

  try {
    // Fetch the username from GitHub API
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      return res.status(userResponse.status).json({
        error: "GitHub API Error",
        message: errorData.message || "Failed to fetch user details",
      });
    }

    const userData = await userResponse.json();
    const username = userData.login; // Extract the username

    console.log("Fetched username from GitHub API:", username); // Debugging: Log the username

    // Fetch branches from GitHub API
    const branchesResponse = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/branches`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!branchesResponse.ok) {
      // Handle GitHub API errors
      const errorData = await branchesResponse.json();
      return res.status(branchesResponse.status).json({
        error: "GitHub API Error",
        message: errorData.message || "Failed to fetch branches",
      });
    }

    const branches = await branchesResponse.json();
    res.json(branches); // Return the list of branches
  } catch (error) {
    console.error("Error fetching branches:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/new-project", async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const user = await User.findOne({ email: req.session.user.email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    res.json({ username: user.username, email: user.email });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});

// API to fetch repository languages
router.post("/fetch-languages", async (req, res) => {
  const { username, repoName } = req.body;
  const githubAccessToken = req.cookies.accessToken; // Extract from cookies/session

  if (!githubAccessToken) {
    console.error("❌ No GitHub token found in cookies.");
    return res
      .status(401)
      .json({ error: "Unauthorized: No GitHub token found" });
  }

  const query = `
    query {
      repository(owner: "${username}", name: "${repoName}") {
        languages(first: 10) {
          edges {
            node {
              name
            }
            size
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${githubAccessToken}`,
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error("❌ GitHub API Error:", data.errors);
      return res.status(400).json({ error: data.errors });
    }

    const languages = data.data.repository.languages.edges.map((edge) => ({
      name: edge.node.name,
      size: edge.size,
    }));

    res.json({ languages });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch repository languages" });
  }
});

// Get current user (for GitHub login)
router.get("/user", (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

router.post("/project-created", async (req, res) => {
  const { username, repoName, repoId, repoURL, branchName, projectName, detectedLanguages } = req.body;

  if (!username || !repoName || !repoId || !projectName || !repoURL || !branchName) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    // Check if project already exists
    const existingProject = await Project.findOne({ repoId });

    if (existingProject) {
      return res.status(400).json({ error: "Project already exists!" });
    }

    // Create new project
    const newProject = new Project({
      username,
      repoName,
      repoId,
      repoURL,
      branchName,
      projectName,
      detectedLanguages,
    });

    await newProject.save();

    res.status(201).json({ message: "Project created successfully!", project: newProject });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 📌 Route: Get all projects
router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;