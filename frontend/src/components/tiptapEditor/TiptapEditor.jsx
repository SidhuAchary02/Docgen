import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import Color from "@tiptap/extension-color"
import TextStyle from "@tiptap/extension-text-style"
import Image from "@tiptap/extension-image"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import Table from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"

import Toolbar from "./Toolbar"

const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Image,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: "<p>Hello, start typing here...</p>",
  })

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-black text-white">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="prose prose-invert max-w-none p-4 focus:outline-none min-h-[200px]" />
    </div>
  )
}

export default TiptapEditor

