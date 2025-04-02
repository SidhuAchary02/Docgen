import { useState } from "react";
import { useCallback } from "react";
import {
  Bold,
  Italic,
  UnderlineIcon,
  List,
  ListOrdered,
  CodeIcon,
  LinkIcon,
  X,
  TextQuote,
  ChevronDown,
  CodeXml,
  Minus,
  ImagePlus,
  ListTodo,
  Strikethrough,
  SubscriptIcon,
  SuperscriptIcon,
  Undo,
  Redo,
} from "lucide-react";
import "./TiptapEditor.css";

const MenuBar = ({ editor }) => {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);
  const [height, setHeight] = useState(480);
  const [width, setWidth] = useState(640);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl("");
      setShowLinkInput(false);
    }
  };

  // Get the current active heading level or check if it's a paragraph
  const getActiveHeading = () => {
    for (let i = 1; i <= 6; i++) {
      if (editor.isActive("heading", { level: i })) {
        return i;
      }
    }
    if (editor.isActive("paragraph")) {
      return "normal";
    }
    return null;
  };

  const activeHeading = getActiveHeading();

  // Get display text for the dropdown button
  const getHeadingButtonText = () => {
    if (activeHeading === "normal") {
      return "Normal";
    } else if (activeHeading) {
      return `H${activeHeading}`;
    }
    return "Heading";
  };

  const addImage = useCallback(() => {
    const url = window.prompt("URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addYoutubeVideo = () => {
    const url = prompt("Enter YouTube URL");

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: Math.max(320, parseInt(width, 10)) || 640,
        height: Math.max(180, parseInt(height, 10)) || 480,
      });
    }
  };

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    try {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } catch (e) {
      alert(e.message);
    }
  }, [editor]);

  const percentage = editor
    ? Math.round((100 / 240) * editor.storage.characterCount.characters())
    : 0;

  return (
    <div className="menu-bar">
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
      >
        <Italic size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "is-active" : ""}
      >
        <UnderlineIcon size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active" : ""}
      >
        <Strikethrough size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        className={editor.isActive("subscript") ? "is-active" : ""}
      >
        <SubscriptIcon size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        className={editor.isActive("superscript") ? "is-active" : ""}
      >
        <SuperscriptIcon size={18} />
      </button>
      <div className="divider"></div>
      <div className="heading-dropdown">
        <button
          onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
          className={activeHeading ? "is-active" : ""}
        >
          {getHeadingButtonText()}
          <ChevronDown size={14} className="dropdown-arrow" />
        </button>
        {showHeadingDropdown && (
          <div className="dropdown-content">
            <button
              onClick={() => {
                editor.chain().focus().setParagraph().run();
                setShowHeadingDropdown(false);
              }}
              className={activeHeading === "normal" ? "is-active" : ""}
            >
              Normal
            </button>
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <button
                key={level}
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level }).run();
                  setShowHeadingDropdown(false);
                }}
                className={
                  editor.isActive("heading", { level }) ? "is-active" : ""
                }
              >
                H{level}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="divider"></div>
      <div className="font-family-dropdown">
        <select
          value={editor.getAttributes("textStyle").fontFamily || ""}
          onChange={(e) => {
            const fontFamily = e.target.value;
            if (fontFamily) {
              editor.chain().focus().setFontFamily(fontFamily).run();
            } else {
              editor.chain().focus().unsetFontFamily().run();
            }
          }}
          data-test-id="font-family-select"
        >
          <option value="">Default</option>
          <option value="Inter">Inter</option>
          <option value='"Comic Sans MS", "Comic Sans"'>Comic Sans</option>
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
          <option value="cursive">Cursive</option>
          <option value="var(--title-font-family)">CSS Variable</option>
          <option value='"Exo 2"'>Exo 2</option>
        </select>
      </div>
      <div className="divider"></div>
      <div className="text-align-dropdown">
        <select
          value={editor.getAttributes("textStyle").textAlign || "left"}
          onChange={(e) => {
            const align = e.target.value;
            editor.chain().focus().setTextAlign(align).run();
          }}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
          <option value="justify">Justify</option>
        </select>
      </div>
      <div className="divider"></div>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        <List size={18} className="text-white" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
      >
        <ListOrdered size={18} />
      </button>
      <div className="divider"></div>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "is-active" : ""}
      >
        <TextQuote size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={editor.isActive("codeBlock") ? "is-active" : ""}
      >
        <Minus size={18} />
      </button>
      <button onClick={addImage}>
        <ImagePlus size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive("code") ? "is-active" : ""}
      >
        <CodeIcon size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? "is-active" : ""}
      >
        <CodeXml size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={editor.isActive("taskList") ? "is-active" : ""}
      >
        <ListTodo size={18} />
      </button>
      <button
        onClick={setLink}
        className={editor.isActive("link") ? "is-active" : ""}
      >
        <LinkIcon size={18} />
      </button>
      <input
        type="color"
        onInput={(event) =>
          editor.chain().focus().setColor(event.target.value).run()
        }
        value={editor.getAttributes("textStyle").color}
        data-testid="setColor"
      />
      <div className="divider"></div>
      <button
        onClick={() =>
          editor.chain().focus().unsetAllMarks().clearNodes().run()
        }
      >
        <X size={18} />
      </button>
      <div className="control-group">
        <div className="button-group">
          <input
            id="width"
            type="number"
            min="320"
            max="1024"
            placeholder="width"
            value={width}
            onChange={(event) => setWidth(event.target.value)}
          />
          <input
            id="height"
            type="number"
            min="180"
            max="720"
            placeholder="height"
            value={height}
            onChange={(event) => setHeight(event.target.value)}
          />
          <button id="add" onClick={addYoutubeVideo}>
            Add YouTube video
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
