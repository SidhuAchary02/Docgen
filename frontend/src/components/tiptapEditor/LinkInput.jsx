"use client"

import { useState } from "react"

const LinkInput = ({ editor, setShowLinkInput }) => {
  const [linkUrl, setLinkUrl] = useState("")

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
      setLinkUrl("")
      setShowLinkInput(false)
    }
  }

  const removeLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run()
    setShowLinkInput(false)
  }

  return (
    <div className="p-2 bg-gray-800 rounded shadow-lg border border-gray-700 z-10">
      <div className="flex">
        <input
          type="text"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="https://example.com"
          className="bg-gray-900 text-white px-2 py-1 rounded-l border border-gray-700 focus:outline-none focus:border-purple-500"
        />
        <button onClick={addLink} className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded-r">
          Add
        </button>
      </div>
      {editor.isActive("link") && (
        <button onClick={removeLink} className="mt-2 text-xs text-red-400 hover:text-red-300">
          Remove link
        </button>
      )}
    </div>
  )
}

export default LinkInput

