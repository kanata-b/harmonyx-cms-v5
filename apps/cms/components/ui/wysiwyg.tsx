import React, { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Quote,
  Undo,
  Redo,
} from "lucide-react";

// Type definitions
interface ToolbarButton {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  command: string;
  title: string;
  value?: string;
}

interface EditorStats {
  characters: number;
  words: number;
}

interface WYSIWYGEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  readonly?: boolean;
}

type FormatBlockValue = "h1" | "h2" | "h3" | "p" | "blockquote" | "pre" | "";
type FontSizeValue = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "";
type EditorCommand =
  | "bold"
  | "italic"
  | "underline"
  | "justifyLeft"
  | "justifyCenter"
  | "justifyRight"
  | "insertUnorderedList"
  | "insertOrderedList"
  | "formatBlock"
  | "undo"
  | "redo"
  | "createLink"
  | "insertImage"
  | "fontSize";

const WYSIWYGEditor: React.FC<WYSIWYGEditorProps> = ({
  initialContent = "",
  onChange,
  placeholder = "Start typing your content here...",
  readonly = false,
}) => {
  const [content, setContent] = useState<string>(initialContent);
  const [isHtmlView, setIsHtmlView] = useState<boolean>(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("WYSIWYGEditor mounted", initialContent);
  }, []);

  useEffect(() => {
    console.log("Content updated:", content);
    if (editorRef.current && !isHtmlView) {
      editorRef.current.innerHTML = content;
    }
  }, [isHtmlView, content]);

  const executeCommand = (
    command: EditorCommand,
    value: string | null = null
  ): void => {
    document.execCommand(command, false, value ?? "");
    updateContent();
  };

  const updateContent = (): void => {
    if (editorRef.current) {
      const newContent: string = editorRef.current.innerHTML;
      setContent(newContent);
      onChange?.(newContent);
    }
  };

  const handleInput = (): void => {
    updateContent();
  };

  const handleHtmlChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const newContent: string = e.target.value;
    setContent(newContent);
    onChange?.(newContent);
  };

  const insertLink = (): void => {
    const url: string | null = prompt("Enter URL:");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  const insertImage = (): void => {
    const url: string | null = prompt("Enter image URL:");
    if (url) {
      executeCommand("insertImage", url);
    }
  };

  const handleFormatChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const value: FormatBlockValue = e.target.value as FormatBlockValue;
    if (value) {
      executeCommand("formatBlock", value);
    }
  };

  const handleFontSizeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const value: FontSizeValue = e.target.value as FontSizeValue;
    if (value) {
      executeCommand("fontSize", value);
    }
  };

  const getEditorStats = (): EditorStats => {
    const textContent: string = content.replace(/<[^>]*>/g, "");
    const characters: number = textContent.length;
    const words: number = textContent
      .trim()
      .split(/\s+/)
      .filter((word: string) => word.length > 0).length;

    return { characters, words };
  };

  const stats: EditorStats = getEditorStats();

  const toolbarButtons: ToolbarButton[] = [
    { icon: Bold, command: "bold", title: "Bold" },
    { icon: Italic, command: "italic", title: "Italic" },
    { icon: Underline, command: "underline", title: "Underline" },
    { icon: AlignLeft, command: "justifyLeft", title: "Align Left" },
    { icon: AlignCenter, command: "justifyCenter", title: "Align Center" },
    { icon: AlignRight, command: "justifyRight", title: "Align Right" },
    { icon: List, command: "insertUnorderedList", title: "Bullet List" },
    { icon: ListOrdered, command: "insertOrderedList", title: "Numbered List" },
    {
      icon: Quote,
      command: "formatBlock",
      value: "blockquote",
      title: "Quote",
    },
    { icon: Code, command: "formatBlock", value: "pre", title: "Code Block" },
    { icon: Undo, command: "undo", title: "Undo" },
    { icon: Redo, command: "redo", title: "Redo" },
  ];

  const formatOptions: Array<{ value: FormatBlockValue; label: string }> = [
    { value: "", label: "Format" },
    { value: "h1", label: "Heading 1" },
    { value: "h2", label: "Heading 2" },
    { value: "h3", label: "Heading 3" },
    { value: "p", label: "Paragraph" },
  ];

  const fontSizeOptions: Array<{ value: FontSizeValue; label: string }> = [
    { value: "", label: "Size" },
    { value: "1", label: "10px" },
    { value: "2", label: "13px" },
    { value: "3", label: "16px" },
    { value: "4", label: "18px" },
    { value: "5", label: "24px" },
    { value: "6", label: "32px" },
    { value: "7", label: "48px" },
  ];

  if (readonly) {
    return (
      <div className="mx-auto max-w-4xl bg-white p-6">
        <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm">
          <div
            className="min-h-64 p-4"
            style={{ minHeight: "256px" }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl bg-white p-6">
      <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm">
        {/* Toolbar */}
        <div className="border-b border-gray-300 bg-gray-50 p-3">
          <div className="flex flex-wrap gap-1">
            {/* Format dropdown */}
            <select
              className="mr-2 rounded border border-gray-300 bg-white px-3 py-1 text-sm"
              onChange={handleFormatChange}
              defaultValue=""
            >
              {formatOptions.map(
                (option: { value: FormatBlockValue; label: string }) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                )
              )}
            </select>

            {/* Font size dropdown */}
            <select
              className="mr-2 rounded border border-gray-300 bg-white px-3 py-1 text-sm"
              onChange={handleFontSizeChange}
              defaultValue=""
            >
              {fontSizeOptions.map(
                (option: { value: FontSizeValue; label: string }) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                )
              )}
            </select>

            {/* Divider */}
            <div className="mx-2 w-px bg-gray-300"></div>

            {/* Toolbar buttons */}
            {toolbarButtons.map((button: ToolbarButton, index: number) => (
              <button
                key={index}
                onClick={() =>
                  button.value
                    ? executeCommand(
                        button.command as EditorCommand,
                        button.value
                      )
                    : executeCommand(button.command as EditorCommand)
                }
                className="rounded p-2 transition-colors hover:bg-gray-200"
                title={button.title}
                type="button"
              >
                <button.icon size={16} className="text-gray-700" />
              </button>
            ))}

            {/* Divider */}
            <div className="mx-2 w-px bg-gray-300"></div>

            {/* Link and Image buttons */}
            <button
              onClick={insertLink}
              className="rounded p-2 transition-colors hover:bg-gray-200"
              title="Insert Link"
              type="button"
            >
              <Link size={16} className="text-gray-700" />
            </button>
            <button
              onClick={insertImage}
              className="rounded p-2 transition-colors hover:bg-gray-200"
              title="Insert Image"
              type="button"
            >
              <Image size={16} className="text-gray-700" />
            </button>

            {/* View toggle */}
            <div className="ml-auto">
              <button
                onClick={() => setIsHtmlView(!isHtmlView)}
                className={`rounded px-3 py-1 text-sm transition-colors ${
                  isHtmlView
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                type="button"
              >
                {isHtmlView ? "Visual" : "HTML"}
              </button>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="relative">
          {isHtmlView ? (
            <textarea
              value={content}
              onChange={handleHtmlChange}
              className="h-64 w-full resize-none border-none p-4 font-mono text-sm focus:outline-none"
              placeholder="Enter HTML here..."
              style={{ minHeight: "256px" }}
            />
          ) : (
            <div
              ref={editorRef}
              contentEditable
              onInput={handleInput}
              className="min-h-64 p-4 focus:outline-none"
              style={{ minHeight: "256px" }}
              dangerouslySetInnerHTML={{ __html: content }}
              data-placeholder={placeholder}
            />
          )}
        </div>

        {/* Footer with word count */}
        <div className="border-t border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>Characters: {stats.characters}</span>
            <span>Words: {stats.words}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WYSIWYGEditor;

// Additional TypeScript interfaces for  integration
export interface FieldMeta {
  id: number;
  collection: string;
  field: string;
  interface: string;
  options: FieldOptions;
  display: string;
  display_options: Record<string, unknown>;
  readonly: boolean;
  hidden: boolean;
  sort: number;
  width: string;
  translations: Record<string, unknown>;
  note: string;
  conditions: Record<string, unknown>;
  required: boolean;
  group: string;
  validation: Record<string, unknown>;
  validation_message: string;
}

export interface FieldOptions {
  placeholder?: string;
  readonly?: boolean;
  maxLength?: number;
  allowHtml?: boolean;
  toolbar?: string[];
}

export interface InterfaceProps {
  value: string;
  field: FieldMeta;
  collection: string;
  primaryKey: string | number;
  loading: boolean;
  disabled: boolean;
  direction: "ltr" | "rtl";
}
