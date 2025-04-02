import React from "react";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./markdown-styles.css"; // Import the custom CSS


const PreviewPage = () => {
  const location = useLocation();
  const { markdownContent } = location.state || { markdownContent: "" };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md markdown-preview">
        <ReactMarkdown>{markdownContent}</ReactMarkdown>
      </div>
    </div>
  );
};

export default PreviewPage;