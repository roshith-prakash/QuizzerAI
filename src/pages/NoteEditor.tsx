import { useState, useRef, useEffect, KeyboardEvent } from "react";
import ReactQuill from "react-quill";
import type { Quill } from "quill";
import "react-quill/dist/quill.bubble.css";

type BlockFormat =
  | "blockquote"
  | "code-block"
  | "normal"
  | { header: 1 | 2 }
  | { list: "bullet" };

interface Command {
  label: string;
  format: BlockFormat;
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
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentMode, setCurrentMode] = useState("normal");
  const [editor, setEditor] = useState<Quill | null>(null);
  const quillRef = useRef<ReactQuill | null>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      if (editor) {
        const range = editor.getSelection();
        if (range) {
          const bounds = editor.getBounds(range.index);
          setMenuPosition({ top: bounds.top + 30, left: bounds.left });
          setShowMenu(true);
        }
      }
    } else if (e.key === "Escape") {
      setShowMenu(false);
    } else if (showMenu && e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => (prevIndex + 1) % COMMANDS.length);
    } else if (showMenu && e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (prevIndex) => (prevIndex - 1 + COMMANDS.length) % COMMANDS.length
      );
    } else if (showMenu && e.key === "Enter") {
      e.preventDefault();
      applyCommand(COMMANDS[selectedIndex].format);
    } else if (showMenu) {
      e.preventDefault();
      setShowMenu(false);
    }
  };

  const applyCommand = (format: BlockFormat) => {
    if (!editor) return;
    const range = editor.getSelection();
    if (!range) return;

    const [line, offset] = editor.getLine(range.index);
    const lineStart = range.index - offset;
    const lineLength = line.length();

    if (format === "normal") {
      editor.formatLine(lineStart, lineLength, {
        blockquote: false,
        "code-block": false,
        header: false,
        list: false,
      });
    } else if (typeof format === "string") {
      editor.formatLine(lineStart, lineLength, format, true);
    } else {
      editor.formatLine(lineStart, lineLength, format);
    }

    editor.setSelection(lineStart + lineLength, 0, "silent");
    editor.focus();
    setShowMenu(false);
  };

  const checkCurrentMode = () => {
    if (editor) {
      const format = editor.getFormat();
      if (format.blockquote) {
        setCurrentMode("blockquote");
      } else if (format["code-block"]) {
        setCurrentMode("code-block");
      } else if (format.header === 1) {
        setCurrentMode("heading1");
      } else if (format.header === 2) {
        setCurrentMode("heading2");
      } else if (format.list === "bullet") {
        setCurrentMode("bullet-list");
      } else {
        setCurrentMode("normal");
      }
    }
  };

  useEffect(() => {
    if (editor) {
      editor.on("text-change", checkCurrentMode);
    }
    return () => {
      if (editor) {
        editor.off("text-change", checkCurrentMode);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  return (
    <div
      className="relative max-w-[95%] md:max-w-5xl mx-auto mt-10 px-4 py-6 bg-white dark:bg-white/5 rounded-xl shadow-sm"
      onKeyDown={handleKeyDown}
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled"
        className="w-full text-3xl font-semibold bg-transparent outline-none mb-6 placeholder-gray-400 dark:placeholder-white"
      />

      <ReactQuill
        ref={(el) => {
          quillRef.current = el;
          if (el) setEditor(el.getEditor());
        }}
        theme="bubble"
        value={content}
        onChange={setContent}
        modules={{ toolbar: false }}
        placeholder="Press 'Tab' for commands..."
        className="text-lg focus:outline-none min-h-[300px] placeholder-gray-400 dark:placeholder-white"
      />

      {showMenu && (
        <div
          className="absolute z-10 overflow-hidden bg-white dark:bg-secondarydarkbg shadow-lg rounded-md border w-56"
          style={{ top: menuPosition.top, left: menuPosition.left }}
        >
          {COMMANDS.map((cmd, idx) => {
            const isActiveMode =
              (typeof cmd.format === "string" && cmd.format === currentMode) ||
              (typeof cmd.format === "object" &&
                (("header" in cmd.format &&
                  ((cmd.format.header === 1 && currentMode === "heading1") ||
                    (cmd.format.header === 2 && currentMode === "heading2"))) ||
                  ("list" in cmd.format &&
                    cmd.format.list === "bullet" &&
                    currentMode === "bullet-list")));

            return (
              <div
                key={idx}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 ${
                  selectedIndex === idx ? "bg-gray-200 dark:bg-white/20" : ""
                } ${isActiveMode ? "bg-gray-100 dark:bg-white/10" : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  applyCommand(cmd.format);
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
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
