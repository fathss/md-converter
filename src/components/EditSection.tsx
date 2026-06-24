import { useEffect, useMemo, useState } from "react";
import { Edit, Trash2, Save, Copy } from "lucide-react";
import type { EditSectionProps } from "../types/components";

function EditSection({
  content,
  onChange,
  onScroll,
  scrollRef,
  files,
  selectedIndex = 0,
}: EditSectionProps) {
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const selectedFileName = files?.[selectedIndex]?.name;

  const markdownFileName = useMemo(() => {
    const baseName = selectedFileName
      ? selectedFileName.replace(/\.(md|markdown)$/i, "")
      : "document";
    return `${baseName || "document"}.md`;
  }, [selectedFileName]);

  const isEmpty = !content.trim();

  useEffect(() => {
    if (!copyMessage) return;
    const timeoutId = window.setTimeout(() => setCopyMessage(null), 1400);
    return () => window.clearTimeout(timeoutId);
  }, [copyMessage]);

  useEffect(() => {
    if (!saveMessage) return;
    const timeoutId = window.setTimeout(() => setSaveMessage(null), 1400);
    return () => window.clearTimeout(timeoutId);
  }, [saveMessage]);

  const handleCopy = async () => {
    if (isEmpty) {
      setCopyMessage("Nothing to copy");
      return;
    }
    try {
      await navigator.clipboard.writeText(content);
      setCopyMessage("Copied");
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleSave = () => {
    if (isEmpty) {
      setSaveMessage("Nothing to save");
      return;
    }
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = markdownFileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div className="w-full p-5 flex flex-col gap-4 border border-primary-3 rounded-2xl relative h-full">
      <div className="flex flex-row justify-between items-center text-white-3 border-b border-primary-3/20 pb-2">
        <div className="flex flex-row gap-4 items-center">
          <Edit size={18} />
          <h2 className="text-sm font-semibold">Editor</h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            title="Clear"
            className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-red-600/10 hover:text-white-3 transition-colors cursor-pointer"
            onClick={() => onChange("")}
          >
            <Trash2 size={14} />
            <span className="text-xs">Clear</span>
          </button>

          <button
            title="Copy"
            className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-primary-3/10 hover:text-white-3 transition-colors cursor-pointer"
            onClick={handleCopy}
          >
            <Copy size={14} />
            <span className="text-xs">Copy</span>
          </button>

          <button
            title="Save"
            className="flex items-center gap-2 px-3 py-1 rounded-md bg-primary-3/20 hover:bg-primary-3/30 hover:text-white-3 transition-colors cursor-pointer"
            onClick={handleSave}
          >
            <Save size={14} />
            <span className="text-xs">Save</span>
          </button>
        </div>
      </div>

      {copyMessage ? <p className="text-xs text-red-400">{copyMessage}</p> : null}
      {saveMessage ? <p className="text-xs text-red-400">{saveMessage}</p> : null}

      <textarea
        className="w-full h-200 bg-gray-2 p-6 rounded-lg text-xs text-white-1 outline-none resize-none border border-transparent focus:border-primary-2 transition-all font-mono leading-relaxed"
        placeholder="Write your markdown here..."
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onScroll={onScroll}
        ref={scrollRef}
      />

      <div className="flex justify-between items-center text-xs text-white-4 px-1">
        <p>Characters: {content.replace(/[\s#\\*]/g, "").length}</p>
      </div>
    </div>
  );
}

export default EditSection;
