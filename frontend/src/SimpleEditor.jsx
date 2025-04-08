"use client"
import { BubbleMenu, useEditor, EditorContent, FloatingMenu } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import ListItem from "@tiptap/extension-list-item"
import OrderedList from "@tiptap/extension-ordered-list"
import BulletList from "@tiptap/extension-bullet-list"
import Blockquote from "@tiptap/extension-blockquote"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import HorizontalRule from "@tiptap/extension-horizontal-rule"
import Dropcursor from "@tiptap/extension-dropcursor"
import Image from "@tiptap/extension-image"
import Mention from "@tiptap/extension-mention"
import Document from "@tiptap/extension-document"
import Paragraph from "@tiptap/extension-paragraph"
import Youtube from "@tiptap/extension-youtube"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import Code from "@tiptap/extension-code"
import Link from "@tiptap/extension-link"
import Strike from "@tiptap/extension-strike"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import CharacterCount from "@tiptap/extension-character-count"
import TextStyle from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Placeholder from "@tiptap/extension-placeholder"
import FontFamily from "@tiptap/extension-font-family"
import TextAlign from "@tiptap/extension-text-align"
import Typography from "@tiptap/extension-typography"

import javascript from "highlight.js/lib/languages/javascript"
import typescript from "highlight.js/lib/languages/typescript"
import html from "highlight.js/lib/languages/xml"
import css from "highlight.js/lib/languages/css"
import python from "highlight.js/lib/languages/python"
import suggestion from "./suggestion.js"
import "./TiptapEditor.css"
import "highlight.js/styles/github-dark.css"

import { createLowlight } from "lowlight"
import MenuBar from "./Menubar.jsx"
import { Bold, CheckSquare, FileCode, Italic, List, ListOrdered, Quote, Strikethrough } from "lucide-react"

const lowlight = createLowlight()

lowlight.register({ javascript, css, html, typescript, python })
lowlight.register("javascript", javascript)
lowlight.register("typescript", typescript)
lowlight.register("html", html)
lowlight.register("css", css)

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
          return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
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
            const parsedUrl = url.includes(":") ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)

            // use default validation
            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false
            }

            // disallowed protocols
            const disallowedProtocols = ["ftp", "file", "mailto"]
            const protocol = parsedUrl.protocol.replace(":", "")

            if (disallowedProtocols.includes(protocol)) {
              return false
            }

            // only allow protocols specified in ctx.protocols
            const allowedProtocols = ctx.protocols.map((p) => (typeof p === "string" ? p : p.scheme))

            if (!allowedProtocols.includes(protocol)) {
              return false
            }

            // disallowed domains
            const disallowedDomains = ["example-phishing.com", "malicious-site.net"]
            const domain = parsedUrl.hostname

            if (disallowedDomains.includes(domain)) {
              return false
            }

            // all checks have passed
            return true
          } catch {
            return false
          }
        },
        shouldAutoLink: (url) => {
          try {
            // construct URL
            const parsedUrl = url.includes(":") ? new URL(url) : new URL(`https://${url}`)

            // only auto-link if the domain is not in the disallowed list
            const disallowedDomains = ["example-no-autolink.com", "another-no-autolink.com"]
            const domain = parsedUrl.hostname

            return !disallowedDomains.includes(domain)
          } catch {
            return false
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
      Color.configure({
        types: ["textStyle"],
      }),
      Placeholder.configure({
        placeholder: `Type '/' for commands`,
      }),
      FontFamily,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Typography,
      // History,
    ],
    content: `<p>Hello, start typing here...</p>
    <pre><code class="language-javascript">for (var i = 1; i <= 20; i++) { console.log(i); }</code></pre>
    <span data-type="mention" data-id="Jennifer Grey"></span>`,
  })

  const percentage = editor ? Math.round((100 / 240) * editor.storage.characterCount.characters()) : 0

  return (
    <>
      <div className="editor-container">
      {editor && (
          <FloatingMenu
            editor={editor}
            tippyOptions={{ duration: 100, maxWidth: "none" }}
            shouldShow={({ state }) => {
              const { $from } = state.selection
              const currentLineText = $from.nodeBefore?.textContent || ""
              return currentLineText === "/"
            }}
          >
            <div data-testid="floating-menu" className="slash-commands-menu">
              <div className="slash-commands-header">FORMAT</div>
              <div className="slash-commands-list">
                <button
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
                >
                  <span className="command-icon">H1</span>
                  <span className="command-label">Heading 1</span>
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
                >
                  <span className="command-icon">H2</span>
                  <span className="command-label">Heading 2</span>
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
                >
                  <span className="command-icon">H3</span>
                  <span className="command-label">Heading 3</span>
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                  className={editor.isActive("heading", { level: 4 }) ? "is-active" : ""}
                >
                  <span className="command-icon">H4</span>
                  <span className="command-label">Heading 4</span>
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                  className={editor.isActive("heading", { level: 5 }) ? "is-active" : ""}
                >
                  <span className="command-icon">H5</span>
                  <span className="command-label">Heading 5</span>
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                  className={editor.isActive("heading", { level: 6 }) ? "is-active" : ""}
                >
                  <span className="command-icon">H6</span>
                  <span className="command-label">Heading 6</span>
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={editor.isActive("bulletList") ? "is-active" : ""}
                >
                  <span className="command-icon">
                    <List size={16} />
                  </span>
                  <span className="command-label">Bullet List</span>
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={editor.isActive("orderedList") ? "is-active" : ""}
                >
                  <span className="command-icon">
                    <ListOrdered size={16} />
                  </span>
                  <span className="command-label">Ordered List</span>
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleTaskList().run()}
                  className={editor.isActive("taskList") ? "is-active" : ""}
                >
                  <span className="command-icon">
                    <CheckSquare size={16} />
                  </span>
                  <span className="command-label">Task List</span>
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  className={editor.isActive("blockquote") ? "is-active" : ""}
                >
                  <span className="command-icon">
                    <Quote size={16} />
                  </span>
                  <span className="command-label">Blockquote</span>
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                  className={editor.isActive("codeBlock") ? "is-active" : ""}
                >
                  <span className="command-icon">
                    <FileCode size={16} />
                  </span>
                  <span className="command-label">Code Block</span>
                </button>
              </div>
            </div>
          </FloatingMenu>
        )}
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="bubble-menu">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "is-active" : ""}
            >
              <Bold size={16} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "is-active" : ""}
            >
              <Italic size={16} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive("strike") ? "is-active" : ""}
            >
              <Strikethrough size={16} />
            </button>
          </div>
        </BubbleMenu>
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>
      <div
        className={`character-count ${
          editor?.storage.characterCount.characters() === 240 ? "character-count--warning" : ""
        }`}
      >
        <svg height="20" width="20" viewBox="0 0 20 20">
          <circle r="10" cx="10" cy="10" fill="#222" />
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
          <circle r="6" cx="10" cy="10" fill="#111" />
        </svg>
        {editor?.storage.characterCount.characters() || 0} / {240} characters
        <br />
        {editor?.storage.characterCount.words() || 0} words
      </div>
    </>
  )
}

export default SimpleEditor

