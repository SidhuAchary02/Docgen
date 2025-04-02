import { useEffect, useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { Outlet } from "react-router-dom";

function GitProviderSelection({ name, plan }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Email validation regex
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // Password validation (minimum 6 characters)
  const isValidPassword = (password) => password.trim().length >= 6;

  // Check if the form is valid
  const isFormValid = isValidEmail(email) && isValidPassword(password);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      console.log("form submitted");
    }
  };

  // Handle Continue with GitHub
  const handleContinueWithGitHub = () => {
    window.location.href = "http://localhost:8000/api/auth/github";
  };

  // Add keyboard event listener for the Enter key (Continue with GitHub)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        handleContinueWithGitHub();
      }
    };

    // Attach the event listener
    const githubButton = document.getElementById("github-button");
    if (githubButton) {
      githubButton.addEventListener("keydown", handleKeyDown);
    }

    // Clean up the event listener
    return () => {
      if (githubButton) {
        githubButton.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, []); // No dependencies, runs once on mount

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 mx-auto bg-[#111111] border border-zinc-800 rounded-lg text-center">
        <h1 className="text-2xl font-bold text-white mb-6">
          Let's connect your Github
        </h1>

        {/* Continue with GitHub Button */}
        <button
          id="github-button" // Add an ID for the event listener
          onClick={handleContinueWithGitHub}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleContinueWithGitHub();
            }
          }}
          className="w-full py-3 mb-4 bg-zinc-800 border border-zinc-700 text-white rounded-md flex gap-2 items-center justify-center cursor-pointer hover:bg-zinc-900"
        >
          <img
            src="/github-icon.svg"
            alt="github logo"
            width={22}
            height={22}
          />
          <span className="font-semibold">Continue with GitHub</span>
        </button>
      </div>
    </div>
  );
}

export default function Signup() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [name, setName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [showGithubSelection, setShowGithubSelection] = useState(false);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setName("");
    setTeamName("");
  };

  const handleContinue = () => {
    const enteredName = selectedPlan === "hobby" ? name : teamName;
    console.log(
      `ur selected plan is ${selectedPlan}, and ur name is ${enteredName}`
    );
    setShowGithubSelection(true);
  };

  const isContinueDisabled =
    selectedPlan === null ||
    (selectedPlan === "hobby" && name.trim() === "") ||
    (selectedPlan === "pro" && teamName.trim() === "");

  // Add keyboard event listener for the Enter key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && !isContinueDisabled) {
        event.preventDefault();
        handleContinue();
      }
    };

    // Attach the event listener
    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isContinueDisabled]); // Re-run effect if isContinueDisabled changes

  if (showGithubSelection) {
    return <GitProviderSelection name={name} plan={selectedPlan} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 mx-auto bg-[#0A0A0A] border border-zinc-800 rounded-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">From code to docs</h1>
          <h2 className="text-3xl font-bold text-white">
            one sign-up is all it takes.
          </h2>
        </div>

        <div className="mb-6">
          <p className="text-gray-400 mb-2">Plan Type</p>
          <div className="space-y-2">
            <div
              className="flex items-center justify-between p-3 rounded-md border border-zinc-800 cursor-pointer"
              onClick={() => handlePlanSelect("hobby")}
            >
              <div className="flex items-center">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedPlan === "hobby"
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-500"
                  }`}
                >
                  {selectedPlan === "hobby" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="ml-2 text-white">
                  I'm working on personal projects
                </span>
              </div>
              <span className="px-3 py-1 text-xs text-black bg-gray-200 rounded-full">
                Hobby
              </span>
            </div>

            <div
              className="flex items-center justify-between p-3 rounded-md border border-zinc-800 cursor-pointer"
              onClick={() => handlePlanSelect("pro")}
            >
              <div className="flex items-center">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedPlan === "pro"
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-500"
                  }`}
                >
                  {selectedPlan === "pro" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="ml-2 text-white">
                  I'm working on commercial projects
                </span>
              </div>
              <span className="px-3 py-1 text-xs text-white bg-blue-500 rounded-full">
                Pro
              </span>
            </div>
          </div>
        </div>

        {selectedPlan === "hobby" && (
          <div className="mb-6">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevent default form submission behavior
                  if (!isContinueDisabled) {
                    handleContinue();
                  }
                }
              }}
              className="w-full p-3 bg-transparent border border-zinc-800 rounded text-white focus:outline-none focus:border-zinc-700"
              placeholder="Your Name"
            />
          </div>
        )}
        {selectedPlan === "pro" && (
          <div className="mb-6">
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevent default form submission behavior
                  if (!isContinueDisabled) {
                    handleContinue();
                  }
                }
              }}
              className="w-full p-3 bg-transparent border border-zinc-800 rounded text-white focus:outline-none focus:border-zinc-700"
              placeholder="Your Organisation Name"
            />
          </div>
        )}

        <button
          onClick={handleContinue}
          className="w-full py-3 bg-white text-black rounded-md mb-6 transition-colors cursor-pointer disabled:bg-[#1a1a1a] border border-zinc-800 disabled:text-white disabled:cursor-not-allowed"
          disabled={isContinueDisabled}
        >
          Continue
        </button>
      </div>
      <Outlet />
    </div>
  );
}
