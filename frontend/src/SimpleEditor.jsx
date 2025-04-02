import { useCallback, useEffect, useState } from "react";
import {
  BubbleMenu,
  useEditor,
  EditorContent,
  FloatingMenu,
  mergeAttributes,
  Node,
} from "@tiptap/react";
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
} from "lucide-react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Dropcursor from "@tiptap/extension-dropcursor";
import Image from "@tiptap/extension-image";
import Mention from "@tiptap/extension-mention";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Youtube from "@tiptap/extension-youtube";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Code from "@tiptap/extension-code";
import Link from "@tiptap/extension-link";
import Strike from "@tiptap/extension-strike";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import CharacterCount from "@tiptap/extension-character-count";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";

import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import python from "highlight.js/lib/languages/python";
import suggestion from "./suggestion.js";
import "./TiptapEditor.css";
import "highlight.js/styles/github.css";

import { createLowlight } from "lowlight";

const lowlight = createLowlight();

lowlight.register({ javascript, css, html, typescript, python });
lowlight.register("javascript", javascript);
lowlight.register("typescript", typescript);
lowlight.register("html", html);
lowlight.register("css", css);

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

const SimpleEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
        blockquote: false,
        codeBlock: false,
        code: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      ListItem,
      BulletList.configure({
        HTMLAttributes: {
          class: "bullet-list",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "ordered-list",
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: "blockquote",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      HorizontalRule,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Dropcursor,
      Document,
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        renderText({ options, node }) {
          return `${options.suggestion.char}${
            node.attrs.label ?? node.attrs.id
          }`;
        },
        deleteTriggerWithBackspace: true,
        suggestion,
      }),
      Paragraph,
      Youtube.configure({
        controls: true,
        nocookie: true,
      }),
      TaskList.configure({
        itemTypeName: "taskItem",
      }),
      TaskItem.configure({
        nested: true,
      }),
      Code,
      Link.configure({
        openOnClick: true,
        autolink: false,
        linkOnPaste: false,
        defaultProtocol: "https",
        protocols: ["http", "https", "ftp", "mailto"],
        isAllowedUri: (url, ctx) => {
          try {
            // construct URL
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`${ctx.defaultProtocol}://${url}`);

            // use default validation
            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false;
            }

            // disallowed protocols
            const disallowedProtocols = ["ftp", "file", "mailto"];
            const protocol = parsedUrl.protocol.replace(":", "");

            if (disallowedProtocols.includes(protocol)) {
              return false;
            }

            // only allow protocols specified in ctx.protocols
            const allowedProtocols = ctx.protocols.map((p) =>
              typeof p === "string" ? p : p.scheme
            );

            if (!allowedProtocols.includes(protocol)) {
              return false;
            }

            // disallowed domains
            const disallowedDomains = [
              "example-phishing.com",
              "malicious-site.net",
            ];
            const domain = parsedUrl.hostname;

            if (disallowedDomains.includes(domain)) {
              return false;
            }

            // all checks have passed
            return true;
          } catch {
            return false;
          }
        },
        shouldAutoLink: (url) => {
          try {
            // construct URL
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`https://${url}`);

            // only auto-link if the domain is not in the disallowed list
            const disallowedDomains = [
              "example-no-autolink.com",
              "another-no-autolink.com",
            ];
            const domain = parsedUrl.hostname;

            return !disallowedDomains.includes(domain);
          } catch {
            return false;
          }
        },
        HTMLAttributes: {
          // Change rel to different value
          // Allow search engines to follow links(remove nofollow)
          rel: "noopener noreferrer",
          // Remove target entirely so links open in current tab
          target: "_blank",
        },
      }),
      Strike,
      Subscript,
      Superscript,
      CharacterCount.configure({
        limit: 240,
      }),
      TextStyle,
      Text,
      Color.configure({
        types: ["textStyle"],
      }),
      Placeholder.configure({
        placeholder: `Type '/' for commands`,
      }),
    ],
    content: `<p>Hello, start typing here...</p>
    <pre><code class="language-javascript">for (var i = 1; i <= 20; i++) { console.log(i); }</code></pre>
    <span data-type="mention" data-id="Jennifer Grey"></span>`,
  });

  const percentage = editor
    ? Math.round((100 / 240) * editor.storage.characterCount.characters())
    : 0;

  return (
    <>
      <div className="editor-container">
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="bubble-menu">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "is-active" : ""}
            >
              Bold
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "is-active" : ""}
            >
              Italic
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive("strike") ? "is-active" : ""}
            >
              Strike
            </button>
          </div>
        </BubbleMenu>
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>
      <div
        className={`character-count ${
          editor.storage.characterCount.characters() === 240
            ? "character-count--warning"
            : ""
        }`}
      >
        <svg height="20" width="20" viewBox="0 0 20 20">
          <circle r="10" cx="10" cy="10" fill="#e9ecef" />
          <circle
            r="5"
            cx="10"
            cy="10"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="10"
            strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
            transform="rotate(-90) translate(-20)"
          />
          <circle r="6" cx="10" cy="10" fill="white" />
        </svg>
        {editor.storage.characterCount.characters()} / {240} characters
        <br />
        {editor.storage.characterCount.words()} words
      </div>
    </>
  );
};

export default SimpleEditor;
