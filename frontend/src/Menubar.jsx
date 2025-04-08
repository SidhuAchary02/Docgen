"use client"

import { useState, useCallback } from "react"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  CodeIcon,
  LinkIcon,
  X,
  Quote,
  ChevronDown,
  FileCode,
  Minus,
  Image,
  CheckSquare,
  Strikethrough,
  Subscript,
  Superscript,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Youtube,
  Type,
} from "lucide-react"
import "./TiptapEditor.css"

const MenuBar = ({ editor }) => {
  const [linkUrl, setLinkUrl] = useState("")
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false)
  const [height, setHeight] = useState(480)
  const [width, setWidth] = useState(640)

  const addImage = useCallback(() => {
    if (editor) {
      const url = window.prompt("URL")

      if (url) {
        editor.chain().focus().setImage({ src: url }).run()
      }
    }
  }, [editor])

  const setLink = useCallback(() => {
    if (editor) {
      const previousUrl = editor.getAttributes("link").href
      const url = window.prompt("URL", previousUrl)

      // cancelled
      if (url === null) {
        return
      }

      // empty
      if (url === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run()

        return
      }

      // update link
      try {
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
      } catch (e) {
        alert(e.message)
      }
    }
  }, [editor])

  if (!editor) {
    return null
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
      setLinkUrl("")
      setShowLinkInput(false)
    }
  }

  // Get the current active heading level or check if it's a paragraph
  const getActiveHeading = () => {
    for (let i = 1; i <= 6; i++) {
      if (editor.isActive("heading", { level: i })) {
        return i
      }
    }
    if (editor.isActive("paragraph")) {
      return "normal"
    }
    return null
  }

  const activeHeading = getActiveHeading()

  // Get display text for the dropdown button
  const getHeadingButtonText = () => {
    if (activeHeading === "normal") {
      return "Normal"
    } else if (activeHeading) {
      return `H${activeHeading}`
    }
    return "Heading"
  }

  const addYoutubeVideo = () => {
    const url = prompt("Enter YouTube URL")

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: Math.max(320, Number.parseInt(width, 10)) || 640,
        height: Math.max(180, Number.parseInt(height, 10)) || 480,
      })
    }
  }

  const percentage = editor ? Math.round((100 / 240) * editor.storage.characterCount.characters()) : 0

  return (
    <div className="menu-bar">
      <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
        <Undo size={16} />
      </button>
      <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
        <Redo size={16} />
      </button>
      <div className="divider"></div>
      <div className="heading-dropdown">
        <button
          onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
          className={activeHeading ? "is-active" : ""}
          title="Text style"
        >
          <Type size={16} className="mr-1" />
          {getHeadingButtonText()}
          <ChevronDown size={14} className="dropdown-arrow" />
        </button>
        {showHeadingDropdown && (
          <div className="dropdown-content">
            <button
              onClick={() => {
                editor.chain().focus().setParagraph().run()
                setShowHeadingDropdown(false)
              }}
              className={activeHeading === "normal" ? "is-active" : ""}
            >
              Normal
            </button>
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <button
                key={level}
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level }).run()
                  setShowHeadingDropdown(false)
                }}
                className={editor.isActive("heading", { level }) ? "is-active" : ""}
              >
                H{level}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="divider"></div>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
        title="Bold"
      >
        <Bold size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
        title="Italic"
      >
        <Italic size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "is-active" : ""}
        title="Underline"
      >
        <Underline size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active" : ""}
        title="Strikethrough"
      >
        <Strikethrough size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        className={editor.isActive("subscript") ? "is-active" : ""}
        title="Subscript"
      >
        <Subscript size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        className={editor.isActive("superscript") ? "is-active" : ""}
        title="Superscript"
      >
        <Superscript size={16} />
      </button>
      <div className="divider"></div>
      <div className="font-family-dropdown">
        <select
          value={editor.getAttributes("textStyle").fontFamily || ""}
          onChange={(e) => {
            const fontFamily = e.target.value
            if (fontFamily) {
              editor.chain().focus().setFontFamily(fontFamily).run()
            } else {
              editor.chain().focus().unsetFontFamily().run()
            }
          }}
          data-test-id="font-family-select"
          title="Font family"
        >
          <option value="">Default</option>
          <option value="Inter">Inter</option>
          <option value='"Comic Sans MS", "Comic Sans"'>Comic Sans</option>
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
          <option value="cursive">Cursive</option>
          <option value='"Exo 2"'>Exo 2</option>
        </select>
      </div>
      <div className="divider"></div>
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
        title="Align left"
      >
        <AlignLeft size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={editor.isActive({ textAlign: "center" }) ? "is-active" : ""}
        title="Align center"
      >
        <AlignCenter size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
        title="Align right"
      >
        <AlignRight size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={editor.isActive({ textAlign: "justify" }) ? "is-active" : ""}
        title="Justify"
      >
        <AlignJustify size={16} />
      </button>
      <div className="divider"></div>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
        title="Bullet list"
      >
        <List size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
        title="Numbered list"
      >
        <ListOrdered size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={editor.isActive("taskList") ? "is-active" : ""}
        title="Task list"
      >
        <CheckSquare size={16} />
      </button>
      <div className="divider"></div>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "is-active" : ""}
        title="Quote"
      >
        <Quote size={16} />
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">
        <Minus size={16} />
      </button>
      <button onClick={addImage} title="Add image">
        <Image size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive("code") ? "is-active" : ""}
        title="Inline code"
      >
        <CodeIcon size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? "is-active" : ""}
        title="Code block"
      >
        <FileCode size={16} />
      </button>
      <button onClick={setLink} className={editor.isActive("link") ? "is-active" : ""} title="Add link">
        <LinkIcon size={16} />
      </button>
      <button onClick={addYoutubeVideo} title="Add YouTube video">
        <Youtube size={16} />
      </button>
      <div className="divider"></div>
      <input
        type="color"
        onInput={(event) => editor.chain().focus().setColor(event.target.value).run()}
        value={editor.getAttributes("textStyle").color}
        title="Text color"
      />
      <div className="divider"></div>
      <button onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear formatting">
        <X size={16} />
      </button>
    </div>
  )
}

export default MenuBar

