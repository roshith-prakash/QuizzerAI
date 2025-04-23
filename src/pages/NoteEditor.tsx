import { useState, useRef, KeyboardEvent, useEffect } from "react";
import ReactQuill from "react-quill";
import type { Quill } from "quill";
import "react-quill/dist/quill.bubble.css";

type FormatType = string | { [key: string]: string | number | boolean };

interface Command {
  label: string;
  format: FormatType;
}

const COMMANDS: Command[] = [
  { label: "Heading 1", format: { header: 1 } },
  { label: "Heading 2", format: { header: 2 } },
  { label: "Quote", format: "blockquote" },
  { label: "Code Block", format: "code-block" },
  { label: "Bullet List", format: { list: "bullet" } },
  { label: "Normal Text", format: "normal" },
];

const NoteEditor = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [currentMode, setCurrentMode] = useState<string>("normal"); // Track the current mode
  const [editor, setEditor] = useState<Quill | null>(null);
  const quillRef = useRef<ReactQuill | null>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "/") {
      if (editor) {
        const range = editor?.getSelection();
        if (range) {
          const bounds = editor.getBounds(range.index);
          setMenuPosition({ top: bounds.top + 30, left: bounds.left });
          setShowMenu(true);
        }
      }
    } else if (e.key === "Escape") {
      setShowMenu(false);
    } else if (e.key === "ArrowDown") {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % COMMANDS.length);
    } else if (e.key === "ArrowUp") {
      setSelectedIndex(
        (prevIndex) => (prevIndex - 1 + COMMANDS.length) % COMMANDS.length
      );
    } else if (e.key === "Enter") {
      applyCommand(COMMANDS[selectedIndex].format);
    }
  };

  const applyCommand = (format: Command["format"]) => {
    if (!editor) return;

    const range = editor.getSelection();
    if (!range) return;

    setShowMenu(false);

    // Get the current content before applying the format
    const currentText = editor.getText();
    const isCommandSelected = currentText.startsWith("/");

    if (isCommandSelected) {
      // Remove the `/` from the start if it's there
      editor.deleteText(0, 1); // Delete first character (the `/`)
    }

    if (format === "normal") {
      // Remove any block-level formatting (quote, code block, etc.)
      editor.format("blockquote", false);
      editor.format("code-block", false);
      editor.format("header", false);
      editor.format("list", false);
    } else {
      // Apply other formats (e.g., heading, quote, etc.)
      if (typeof format === "string") {
        editor.format(format, true);
      } else {
        for (const key in format) {
          editor.format(key, format[key]);
        }
      }
    }

    // Refocus editor and restore cursor position
    setTimeout(() => {
      editor.focus();
      editor.setSelection(range.index, range.length);
    }, 0);
  };

  // Function to check the current format at the cursor
  const checkCurrentMode = () => {
    if (editor) {
      const format = editor.getFormat();
      if (format["blockquote"]) {
        setCurrentMode("blockquote");
      } else if (format["code-block"]) {
        setCurrentMode("code-block");
      } else if (format["header"] === 1) {
        setCurrentMode("heading1");
      } else if (format["header"] === 2) {
        setCurrentMode("heading2");
      } else if (format["list"] === "bullet") {
        setCurrentMode("bullet-list");
      } else {
        setCurrentMode("normal");
      }
    }
  };

  useEffect(() => {
    if (editor) {
      // Monitor changes in the editor to check the current format
      editor.on("text-change", checkCurrentMode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  return (
    <div
      className="relative max-w-[95%] md:max-w-5xl mx-auto mt-10 px-4 py-6 bg-white dark:bg-white/5 rounded-xl shadow-sm"
      onKeyDown={handleKeyDown}
    >
      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled"
        className="w-full text-3xl font-semibold bg-transparent outline-none mb-6 placeholder-gray-400 dark:placeholder-white"
      />

      {/* Editor */}
      <ReactQuill
        ref={(el) => {
          quillRef.current = el;
          if (el) setEditor(el.getEditor());
        }}
        theme="bubble"
        value={content}
        onChange={setContent}
        modules={{ toolbar: false }}
        placeholder="Type '/' for commands..."
        className="text-lg focus:outline-none min-h-[300px] placeholder-gray-400 dark:placeholder-white"
      />

      {/* Slash command menu */}
      {showMenu && (
        <div
          className="absolute z-10 overflow-hidden bg-white dark:bg-secondarydarkbg shadow-lg rounded-md border w-56"
          style={{ top: menuPosition.top, left: menuPosition.left }}
        >
          {COMMANDS.map((cmd, idx) => {
            const isActiveMode =
              (typeof cmd.format === "string" && cmd.format === currentMode) ||
              (typeof cmd.format === "object" &&
                cmd.format["header"] === currentMode);

            return (
              <div
                key={idx}
                className={`px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer ${
                  selectedIndex === idx ? "bg-gray-200 dark:bg-white/20" : ""
                } ${isActiveMode ? "bg-gray-100 dark:bg-white/10" : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  applyCommand(cmd.format);
                }}
                onMouseEnter={() => setSelectedIndex(idx)} // Highlight on hover
              >
                {cmd.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NoteEditor;
