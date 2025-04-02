import { ArrowUpRight, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Utility function to get a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function Repos() {
  const [repos, setRepos] = useState([]);
  const [username, setUsername] = useState(""); // Store GitHub username
  const [selectedBranch, setSelectedBranch] = useState({}); // Use an object to store branch names
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = getCookie("accessToken");

    if (!accessToken) {
      navigate("/"); // Redirect to login if accessToken is missing
      return;
    }

    // Fetch user repositories
    fetch("http://localhost:8000/api/user/repos", {
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) navigate("/");
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setRepos(data);
          if (data.length > 0) {
            setUsername(data[0].owner.login); // Extract GitHub username
            // Fetch branches for each repository
            data.forEach((repo) => fetchBranches(repo));
          }
        } else {
          throw new Error("Invalid data format: expected an array");
        }
      })
      .catch((error) => {
        console.error("Error fetching repositories:", error);
        setError(error.message);
      });
  }, [navigate]);

  // Fetch branches for a repository
  function fetchBranches(repo) {
    const accessToken = getCookie("accessToken");
    console.log("Fetching branches for repository:", repo.name); // Debugging: Log the repository name

    fetch(`http://localhost:8000/api/user/repos/${repo.name}/branches`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: "include", // Ensure cookies are sent
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((branches) => {
        console.log("Branches fetched:", branches); // Debugging: Log the fetched branches
        // Set the default branch for the repository
        setSelectedBranch((prev) => ({
          ...prev,
          [repo.id]: branches[0]?.name || "master", // Default to "master" if no branch is found
        }));
      })
      .catch((err) => {
        console.error("Error fetching branches:", err);
        // Set a default branch if fetching fails
        setSelectedBranch((prev) => ({
          ...prev,
          [repo.id]: "master", // Default to "master" if an error occurs
        }));
      });
  }

  if (error) return <div>Error: {error}</div>;

  // Handle next button click
  function handleNext(repo) {
    const stateData = {
      repoId: repo.id,
      repoName: repo.name,
      repoURL: repo.html_url,
      username: username,
      branchName: selectedBranch[repo.id] || "master", // Default to "main" if no branch is set
    };

    sessionStorage.setItem("newProjectData", JSON.stringify(stateData));
    navigate("/new-project", { state: stateData });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-lg p-8 mx-auto bg-[#0a0a0a] rounded-lg border border-[#222222]">
        <h1 className="text-2xl font-bold text-white mb-6">
          Import Git Repository
        </h1>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <div className="flex items-center justify-between w-full p-3 bg-[#111111] border border-[#333333] rounded-lg text-white cursor-pointer">
              <div className="flex items-center gap-2">
                <img
                  src="/github-icon.svg"
                  alt="github logo"
                  width={20}
                  height={20}
                />
                <span className="text-white">
                  {username && <h2>{username}</h2>}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#151515] rounded-lg border border-[#222222] mb-6">
          {repos.map((repo) => (
            <div
              key={repo.id}
              className="flex items-center justify-between p-4 border-b border-[#222222]"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#222222] rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 3h18v18H3z" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white flex items-center gap-1 font-medium cursor-pointer hover:underline"
                    >
                      {repo.name}
                      <ArrowUpRight className="w-4 h-4 text-white" />
                    </a>
                    {repo.private && (
                      <Lock className="w-4 h-4 ml-2 text-gray-400" />
                    )}
                  </div>
                  <span className="text-gray-400 text-sm">
                    {" "}
                    - Created on{" "}
                    {new Date(repo.created_at).toLocaleDateString()}{" "}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleNext(repo)}
                className="px-4 py-2 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Import
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* <a
        href="#"
        className="text-gray-400 hover:text-white transition-colors"
      >
        Import Third-Party Git Repository →
      </a> */}
    </div>
  );
}

export default Repos;
