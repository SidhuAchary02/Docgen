import { useState } from "react"
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Code,
  LinkIcon,
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Minus,
  Undo,
  Redo,
  ImageIcon,
  Table,
  CheckSquare,
  Palette,
} from "lucide-react"
import LinkInput from "./LinkInput"
import ColorPicker from "./ColorPicker"
import TableMenu from "./TableMenu"

const Toolbar = ({ editor }) => {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showTableMenu, setShowTableMenu] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [showImageInput, setShowImageInput] = useState(false)

  if (!editor) {
    return null
  }

  const toggleLinkInput = () => {
    setShowLinkInput(!showLinkInput)
    setShowColorPicker(false)
    setShowTableMenu(false)
    setShowImageInput(false)
  }

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker)
    setShowLinkInput(false)
    setShowTableMenu(false)
    setShowImageInput(false)
  }

  const toggleTableMenu = () => {
    setShowTableMenu(!showTableMenu)
    setShowLinkInput(false)
    setShowColorPicker(false)
    setShowImageInput(false)
  }

  const toggleImageInput = () => {
    setShowImageInput(!showImageInput)
    setShowLinkInput(false)
    setShowColorPicker(false)
    setShowTableMenu(false)
  }

  const insertImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl("")
      setShowImageInput(false)
    }
  }

  return (
    <div className="bg-gray-900 border-b border-gray-700 p-2 flex flex-wrap items-center">
      {/* Text Formatting */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          icon={<Bold size={18} />}
          tooltip="Bold"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          icon={<Italic size={18} />}
          tooltip="Italic"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          icon={<Underline size={18} />}
          tooltip="Underline"
        />
        <ToolbarButton onClick={toggleColorPicker} isActive={false} icon={<Palette size={18} />} tooltip="Text Color" />
      </ToolbarGroup>

      <ToolbarDivider />

      {/* Headings */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          icon={<Heading1 size={18} />}
          tooltip="Heading 1"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          icon={<Heading2 size={18} />}
          tooltip="Heading 2"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          icon={<Quote size={18} />}
          tooltip="Blockquote"
        />
      </ToolbarGroup>

      <ToolbarDivider />

      {/* Lists */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          icon={<List size={18} />}
          tooltip="Bullet List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          icon={<ListOrdered size={18} />}
          tooltip="Ordered List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editor.isActive("taskList")}
          icon={<CheckSquare size={18} />}
          tooltip="Task List"
        />
      </ToolbarGroup>

      <ToolbarDivider />

      {/* Alignment */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          icon={<AlignLeft size={18} />}
          tooltip="Align Left"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          icon={<AlignCenter size={18} />}
          tooltip="Align Center"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          icon={<AlignRight size={18} />}
          tooltip="Align Right"
        />
      </ToolbarGroup>

      <ToolbarDivider />

      {/* Insert */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          icon={<Code size={18} />}
          tooltip="Code Block"
        />
        <ToolbarButton
          onClick={toggleLinkInput}
          isActive={editor.isActive("link")}
          icon={<LinkIcon size={18} />}
          tooltip="Add Link"
        />
        <ToolbarButton
          onClick={toggleImageInput}
          isActive={false}
          icon={<ImageIcon size={18} />}
          tooltip="Insert Image"
        />
        <ToolbarButton
          onClick={toggleTableMenu}
          isActive={editor.isActive("table")}
          icon={<Table size={18} />}
          tooltip="Insert Table"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          icon={<Minus size={18} />}
          tooltip="Horizontal Rule"
        />
      </ToolbarGroup>

      <ToolbarDivider />

      {/* History */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          icon={<Undo size={18} />}
          tooltip="Undo"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          icon={<Redo size={18} />}
          tooltip="Redo"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          icon={<X size={18} />}
          tooltip="Clear Formatting"
        />
      </ToolbarGroup>

      {/* Floating Menus */}
      {showLinkInput && (
        <div className="absolute mt-10 z-10">
          <LinkInput editor={editor} setShowLinkInput={setShowLinkInput} />
        </div>
      )}

      {showColorPicker && (
        <div className="absolute mt-10 z-10">
          <ColorPicker editor={editor} setShowColorPicker={setShowColorPicker} />
        </div>
      )}

      {showTableMenu && (
        <div className="absolute mt-10 z-10">
          <TableMenu editor={editor} setShowTableMenu={setShowTableMenu} />
        </div>
      )}

      {showImageInput && (
        <div className="absolute mt-10 p-2 bg-gray-800 rounded shadow-lg border border-gray-700 z-10">
          <div className="flex">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="bg-gray-900 text-white px-2 py-1 rounded-l border border-gray-700 focus:outline-none focus:border-purple-500"
            />
            <button onClick={insertImage} className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded-r">
              Insert
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const ToolbarGroup = ({ children }) => {
  return <div className="flex items-center">{children}</div>
}

const ToolbarButton = ({ onClick, isActive, icon, tooltip, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded hover:bg-gray-800 relative group ${
        isActive ? "text-purple-400 bg-purple-900/30" : "text-gray-300"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      title={tooltip}
    >
      {icon}
      <span className="sr-only">{tooltip}</span>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {tooltip}
      </div>
    </button>
  )
}

const ToolbarDivider = () => {
  return <div className="h-6 w-px bg-gray-700 mx-1.5" />
}

export default Toolbar

