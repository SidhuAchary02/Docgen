"use client";

const ColorPicker = ({ editor, setShowColorPicker }) => {
  const colors = [
    "#000000",
    "#434343",
    "#666666",
    "#999999",
    "#b7b7b7",
    "#cccccc",
    "#d9d9d9",
    "#efefef",
    "#f3f3f3",
    "#ffffff",
    "#980000",
    "#ff0000",
    "#ff9900",
    "#ffff00",
    "#00ff00",
    "#00ffff",
    "#4a86e8",
    "#0000ff",
    "#9900ff",
    "#ff00ff",
    "#e6b8af",
    "#f4cccc",
    "#fce5cd",
    "#fff2cc",
    "#d9ead3",
    "#d0e0e3",
    "#c9daf8",
    "#cfe2f3",
    "#d9d2e9",
    "#ead1dc",
  ];

  const setColor = (color) => {
    editor.chain().focus().setColor(color).run();
    setShowColorPicker(false);
  };

  return (
    <div className="p-2 bg-gray-800 rounded shadow-lg border border-gray-700 z-10">
      <div className="grid grid-cols-10 gap-1">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => setColor(color)}
            className="w-5 h-5 rounded-sm border border-gray-700 hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
      <button
        onClick={() => {
          editor.chain().focus().unsetColor().run();
          setShowColorPicker(false);
        }}
        className="mt-2 text-xs text-gray-300 hover:text-white w-full text-center"
      >
        Reset color
      </button>
    </div>
  );
};

export default ColorPicker;
