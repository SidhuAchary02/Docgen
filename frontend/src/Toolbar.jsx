import { useEffect, useState } from "react";

const Toolbar = ({ editor }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !editor) {
    return (
      <div className="flex gap-2 mb-2 p-2 bg-gray-800 rounded-lg text-white">
        <p>Initializing toolbar...</p>
      </div>
    );
  }

  return (
    <div className="flex gap-2 mb-2 p-2 bg-gray-800 rounded-lg overflow-x-auto">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-3 py-1 rounded ${
          editor.isActive("bold") ? "bg-blue-500" : "bg-gray-700"
        } text-white hover:bg-gray-600`}
      >
        Bold
      </button>
      {/* Keep other buttons the same as before */}
    </div>
  );
};

export default Toolbar;