import { useState } from "react"
import { Trash2 } from "lucide-react"

const TableMenu = ({ editor, setShowTableMenu }) => {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
    setShowTableMenu(false)
  }

  const tableControls = [
    {
      title: "Add Column Before",
      action: () => editor.chain().focus().addColumnBefore().run(),
      isDisabled: !editor.can().addColumnBefore(),
    },
    {
      title: "Add Column After",
      action: () => editor.chain().focus().addColumnAfter().run(),
      isDisabled: !editor.can().addColumnAfter(),
    },
    {
      title: "Delete Column",
      action: () => editor.chain().focus().deleteColumn().run(),
      isDisabled: !editor.can().deleteColumn(),
    },
    {
      title: "Add Row Before",
      action: () => editor.chain().focus().addRowBefore().run(),
      isDisabled: !editor.can().addRowBefore(),
    },
    {
      title: "Add Row After",
      action: () => editor.chain().focus().addRowAfter().run(),
      isDisabled: !editor.can().addRowAfter(),
    },
    {
      title: "Delete Row",
      action: () => editor.chain().focus().deleteRow().run(),
      isDisabled: !editor.can().deleteRow(),
    },
    {
      title: "Delete Table",
      action: () => editor.chain().focus().deleteTable().run(),
      isDisabled: !editor.can().deleteTable(),
      icon: <Trash2 size={14} className="text-red-400" />,
    },
  ]

  return (
    <div className="p-2 bg-gray-800 rounded shadow-lg border border-gray-700 z-10 min-w-[200px]">
      {!editor.isActive("table") ? (
        <div>
          <div className="mb-2">
            <label className="block text-sm text-gray-300 mb-1">Rows</label>
            <input
              type="number"
              min="2"
              max="10"
              value={rows}
              onChange={(e) => setRows(Number.parseInt(e.target.value))}
              className="w-full bg-gray-900 text-white px-2 py-1 rounded border border-gray-700 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm text-gray-300 mb-1">Columns</label>
            <input
              type="number"
              min="2"
              max="10"
              value={cols}
              onChange={(e) => setCols(Number.parseInt(e.target.value))}
              className="w-full bg-gray-900 text-white px-2 py-1 rounded border border-gray-700 focus:outline-none focus:border-purple-500"
            />
          </div>
          <button
            onClick={insertTable}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded mt-1"
          >
            Insert Table
          </button>
        </div>
      ) : (
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2">Table Controls</h3>
          <div className="space-y-1">
            {tableControls.map((control, index) => (
              <button
                key={index}
                onClick={() => {
                  control.action()
                  if (control.title === "Delete Table") {
                    setShowTableMenu(false)
                  }
                }}
                disabled={control.isDisabled}
                className={`flex items-center w-full text-left px-2 py-1 rounded text-sm ${
                  control.isDisabled
                    ? "opacity-50 cursor-not-allowed text-gray-400"
                    : "hover:bg-gray-700 text-gray-300 hover:text-white"
                }`}
              >
                {control.icon && <span className="mr-1">{control.icon}</span>}
                {control.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TableMenu

