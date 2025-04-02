import { useEffect, useRef, useState } from "react";
import { BookText, GitBranch, MoveLeft } from "lucide-react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./NewProject.css";
import GeneratingStatus from "./GeneratingStatus";

const steps = [
  "Parsing Code",
  "Extracting JSDoc",
  "Generating Markdown",
  "Finalizing Documentation",
];

const NewProject = () => {
  const [projectName, setProjectName] = useState("new-backend");
  const [detectedLanguage, setDetectedLanguage] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const statusRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const storedData = sessionStorage.getItem("newProjectData");
  const stateData =
    location.state || (storedData ? JSON.parse(storedData) : {});

  const { repoId, repoName, repoURL, username, branchName } = stateData;

  useEffect(() => {
    if (!location.state && storedData) {
      navigate("/new-project", { state: JSON.parse(storedData) });
    }
  }, [location.state, storedData, navigate]);

  useEffect(() => {
    if (repoName) {
      setProjectName(repoName);
    }

    const fetchLanguages = async () => {
      if (!repoName || !username) return;

      try {
        const response = await fetch(
          "http://localhost:8000/api/user/fetch-languages",
          {
            method: "POST",
            credentials: "include", // Ensures cookies are sent
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, repoName }),
          }
        );

        const data = await response.json();
        console.log("API Response:", data);

        if (data.error) {
          console.error("Error fetching languages:", data.error);
          return;
        }

        // Calculate percentages
        const languages = data.languages;
        const totalBytes = languages.reduce((sum, lang) => sum + lang.size, 0);
        const languagesWithPercentage = languages.map((lang) => ({
          ...lang,
          percentage: ((lang.size / totalBytes) * 100).toFixed(2), // Calculate percentage and round to 2 decimal places
        }));

        setDetectedLanguage(languagesWithPercentage);
        console.log(languagesWithPercentage);
      } catch (error) {
        console.error("Request failed", error);
      }
    };

    fetchLanguages();
  }, [repoName, username]);

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setCurrentStep((prevStep) => {
          if (prevStep < steps.length - 1) {
            return prevStep + 1;
          } else {
            clearInterval(interval);
            return prevStep;
          }
        });
      }); // Simulating step-by-step updates
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const handleGenerateDocs = async () => {
    try {
      setIsGenerating(true);
      setCurrentStep(0);

      const payload = {
        username,
        repoName,
        repoId,
        repoURL,
        branchName,
        projectName,
        detectedLanguages: detectedLanguage, // Ensure this matches the backend's expected field name
      };

      console.log("Sending Payload:", payload); // Debugging: Log the payload
      console.log("type of", typeof payload.repoName, typeof payload.username);

      // Step 1: Extract and filter files from GitHub repository
      const files = await fetchAllFilesWithContent(
        username,
        repoName,
        branchName
      ); // Corrected the parameters

      // Generate combined Markdown content
      const combinedMarkdown = files
        .map((file) => jsdocToMarkdown(file.docs))
        .join("\n\n");

      // Optionally: Do something with files (like uploading them to S3, generating docs, etc.)
      console.log("Fetched Files:", files);

      // Step 2: Send the payload to the backend
      const response = await axios.post(
        "http://localhost:8000/api/user/project-created",
        payload
      );

      // Scroll to GeneratingStatus component
      if (statusRef.current) {
        statusRef.current.scrollIntoView({ behavior: "smooth" });
      }

      navigate("/success", {state: {markdownContent: combinedMarkdown}});

      console.log("Project Created:", response.data);
    } catch (error) {
      console.error("Error occurred while creating project:", error);
      setError("Failed to create project. Please try again.");
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    console.log("Detected Languages:", detectedLanguage);
  }, [detectedLanguage]);

  // Function to fetch all JavaScript/TypeScript files and extract JSDoc comments
  const fetchAllFilesWithContent = async (username, repoName, branchName) => {
    try {
      const filePaths = await fetchFileTree(username, repoName, branchName);

      // Filter for only relevant source files
      const filteredPaths = filePaths.filter(
        (path) =>
          path.endsWith(".js") ||
          path.endsWith(".ts") ||
          path.endsWith(".jsx") ||
          path.endsWith(".tsx")
      );

      const fileContents = await Promise.all(
        filteredPaths.map(async (path) => {
          const file = await fetchFileContent(username, repoName, path);
          const parsedDocs = extractJSDoc(file.content); // Extract JSDoc from the content
          return { path, docs: parsedDocs };
        })
      );

      // Generate Markdown for each file
      fileContents.forEach((file) => {
        const markdown = jsdocToMarkdown(file.docs);
        console.log(`Markdown for ${file.path}:\n`, markdown);
        saveMarkdownFile(markdown, `${file.path}.md`);
      });

      console.log("Extracted JSDoc:", fileContents);
      return fileContents;
    } catch (error) {
      console.error("Error fetching or parsing files:", error);
      throw new Error("Error fetching or parsing files");
    }
  };

  // Function to extract JSDoc comments from a file's content
  const extractJSDoc = (code) => {
    console.log("Parsing file content:", code); // Debugging step

    // Regex to find JSDoc-style comments
    const jsdocRegex = /\/\*\*([\s\S]*?)\*\//g;
    const matches = [...code.matchAll(jsdocRegex)].map((match) => match[0]);

    console.log("Extracted Raw Comments:", matches); // Debugging step

    if (matches.length === 0) {
      console.warn("No JSDoc comments found!");
      return [];
    }

    // Parse each JSDoc comment into a simple structure
    const parsedComments = matches.map((comment) => {
      const lines = comment.split("\n").map((line) => line.trim());
      const description = lines
        .filter(
          (line) =>
            !line.startsWith("* @") &&
            !line.startsWith("*/") &&
            !line.startsWith("/*")
        )
        .join("\n")
        .trim();

      const tags = lines
        .filter((line) => line.startsWith("* @"))
        .map((line) => {
          const [tag, ...rest] = line.replace("* @", "").split(" ");
          return {
            title: tag,
            description: rest.join(" ").trim(),
          };
        });

      return {
        description,
        tags,
      };
    });

    console.log("Parsed Comments:", parsedComments); // Debugging step
    return parsedComments;
  };

  // Fetch file tree (list of all file paths) using GitHub API
  const fetchFileTree = async (username, repoName, branchName) => {
    console.log(username, repoName, branchName); // Debugging: Log the branchName

    const response = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/git/trees/${branchName}?recursive=1`
    );
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data.tree
      .filter((file) => file.type === "blob")
      .map((file) => file.path); // Only files (not directories)
  };

  // Fetch file content from GitHub repository (Base64 encoded)
  const fetchFileContent = async (username, repoName, path) => {
    const response = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/contents/${path}`
    );
    const data = await response.json();
    if (data.content) {
      const decodedContent = atob(data.content); // Decode from Base64 to text
      console.log("decodedContent: ", decodedContent);
      return { path, content: decodedContent };
    }
    throw new Error(`Error fetching content for ${path}`);
  };

  // Function to convert JSDoc data to Markdown
  const jsdocToMarkdown = (jsdocData) => {
    let markdownContent = "";

    jsdocData.forEach((comment) => {
      // Add the comment description
      if (comment.description) {
        markdownContent += `## ${comment.description}\n\n`;
      }

      // Add tags (e.g., @param, @returns, etc.)
      if (comment.tags && comment.tags.length > 0) {
        markdownContent += "### Tags\n";
        comment.tags.forEach((tag) => {
          markdownContent += `- **${tag.title}**: ${tag.description}\n`;
        });
        markdownContent += "\n";
      }

      markdownContent += "---\n\n"; // Separator between comments
    });

    return markdownContent;
  };

  // Function to save Markdown content to a file
  const saveMarkdownFile = (content, filename) => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-8 ">
      <div className="border border-zinc-800 rounded-md bg-[#0A0A0A]">
        <div className="w-[680px] max-w-2xl p-8 mx-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/repos")}
              className="flex items-center gap-1 text-base text-white underline mb-5 cursor-pointer"
            >
              <MoveLeft className="w-3 h-4" />
              back
            </button>
          </div>
          <h1 className="text-2xl font-bold text-white">New Project</h1>
          <p className="text-white mb-4">
            Create the project and give it a name.
          </p>

          {/* GitHub Import Info */}
          <div className="bg-[#1A1A1A] rounded-lg p-4 mb-8">
            <p className="text-gray-400 text-sm mb-1">Importing from GitHub</p>
            <div className="flex items-center gap-1">
              <img
                src="/github-icon.svg"
                alt="github logo"
                width={20}
                height={20}
              />
              <a
                href={repoURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-semibold hover:underline"
              >
                {username}/{repoName}
              </a>
              <GitBranch className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">{branchName}</span>
            </div>
          </div>

          {/* Team and Project Name */}
          <div className="grid grid-cols-2 mb-8">
            <div>
              <label className="block text-gray-400 mb-2">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full p-3 bg-[#111111] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#444444]"
              />
            </div>
          </div>

          {/* Languages Preset */}
          <div>
            <label className="block text-gray-400 mb-2">Languages Preset</label>
            <button className="flex items-center justify-between w-full p-3 bg-[#111111] border border-[#333333] rounded-lg text-white">
              <div className="flex items-center gap-2 w-full">
                {detectedLanguage.length > 0 ? (
                  <ul className="languages-list space-y-2 ">
                    {detectedLanguage.map((lang, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-full">{lang.name}</span>
                        <div className="w-20 h-2 bg-gray-700 rounded">
                          <div
                            className="h-full bg-linear-65 from-purple-500 to-pink-500 rounded"
                            style={{ width: `${lang.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">
                          {lang.percentage}%
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Unknown</p>
                )}
              </div>
            </button>
          </div>

          <button
            onClick={handleGenerateDocs}
            className="w-full bg-gray-200 py-2 rounded-md my-4 font-semibold cursor-pointer hover:bg-gray-300"
          >
            Generate Docs
          </button>
        </div>
      </div>
      <div ref={statusRef}>
        {isGenerating ? (
          <GeneratingStatus onComplete={() => setIsGenerating(false)} />
        ) : (
          <div className="bg-black text-white flex items-center justify-center p-4 mt-5">
            <div className="w-[686px] max-w-2xl bg-black border border-zinc-800 rounded-lg p-6">
              <h1 className="text-2xl font-bold flex items-center gap-1 mb-2 text-[#8F8F8F]">
                Generating Docs <BookText />
              </h1>
              <div className="flex items-center gap-2 mb-6 text-[#8F8F8F]">
                <span>
                  Once you're ready, start generating to see the progress here…
                </span>
              </div>
              <img src="/globe.svg" alt="Globe" width={688} height={256} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewProject;
