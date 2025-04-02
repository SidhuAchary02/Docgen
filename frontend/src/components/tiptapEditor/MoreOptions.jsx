"use client"
import { Quote, Minus, ImageIcon, Table, CheckSquare } from "lucide-react"

const MoreOptions = ({ editor, setShowMoreOptions }) => {
  const options = [
    {
      title: "Blockquote",
      icon: <Quote size={16} />,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive("blockquote"),
    },
    {
      title: "Horizontal Rule",
      icon: <Minus size={16} />,
      action: () => editor.chain().focus().setHorizontalRule().run(),
      isActive: false,
    },
    {
      title: "Insert Image",
      icon: <ImageIcon size={16} />,
      action: () => {
        const url = prompt("Enter image URL")
        if (url) {
          editor.chain().focus().setImage({ src: url }).run()
        }
      },
      isActive: false,
    },
    {
      title: "Insert Table",
      icon: <Table size={16} />,
      action: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
      isActive: false,
    },
    {
      title: "Task List",
      icon: <CheckSquare size={16} />,
      action: () => editor.chain().focus().toggleTaskList().run(),
      isActive: editor.isActive("taskList"),
    },
  ]

  const handleOptionClick = (action) => {
    action()
    setShowMoreOptions(false)
  }

  return (
    <div className="absolute mt-2 p-1 bg-gray-800 rounded shadow-lg border border-gray-700 z-10 min-w-[180px]">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleOptionClick(option.action)}
          className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded hover:bg-gray-700 ${
            option.isActive ? "text-purple-400 bg-purple-900/30" : "text-gray-300"
          }`}
        >
          {option.icon}
          <span>{option.title}</span>
        </button>
      ))}
    </div>
  )
}

export default MoreOptions

