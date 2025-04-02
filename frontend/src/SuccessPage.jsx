import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./markdown-styles.css"; // Import the custom CSS

export default function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { markdownContent } = location.state || { markdownContent: "" };

  const handlePreview = () => {
    navigate('/preview', {state: {markdownContent}})
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Rainbow gradient effect */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-green-500 to-blue-500 animate-gradient-x"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-4 py-3">
        <div className="text-white">▲</div>
      </nav>

      {/* Main content */}
      <main className="relative z-10 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl bg-zinc-900/50 backdrop-blur-sm rounded-lg border border-zinc-800">
          <div className="p-8">
            <h1 className="text-2xl font-semibold mb-4">Congratulations!</h1>
            <p className="text-gray-300 flex items-center gap-2 mb-6">
              You just deployed a new project to
              <span className="flex items-center gap-1">
                Mentorix
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
              </span>
            </p>

            {/* Markdown Preview Container */}
            <div className="mb-6 cursor-pointer"
            onClick={handlePreview}>
              <div className="w-full h-96 p-4 bg-white rounded-md text-gray-900 text-sm overflow-y-auto markdown-preview">
                <ReactMarkdown>{markdownContent}</ReactMarkdown>
              </div>
            </div>

            {/* Next Steps */}
            <div className="text-gray-300">Next Steps</div>
          </div>
        </div>
      </main>

      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
    </div>
  );
}