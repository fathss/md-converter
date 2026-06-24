import { useEffect, useMemo, useRef, useState } from "react";
import { Eye, Settings, Upload } from "lucide-react";
import DocxSettings from "./DocxSettings";
import MarkdownRenderer from "./MarkdownRenderer";
import { useConversions } from "../hooks/useConversions";
import type { PreviewSectionProps } from "../types/components";
import {
  createDefaultDocxExportSettings,
  type DocxExportSettings,
} from "../types/docxSettings";

function PreviewSection({
  content,
  onScroll,
  scrollRef,
  files,
  selectedIndex = 0,
}: PreviewSectionProps) {
  const [activeTab, setActiveTab] = useState<"markdown" | "settings">(
    "markdown",
  );
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const { handleDownload, loading, error } = useConversions();
  const selectedFileName = files?.[selectedIndex]?.name;
  const initialDocxSettings = useMemo(
    () => createDefaultDocxExportSettings(selectedFileName),
    [selectedFileName],
  );
  const settingsRef = useRef<DocxExportSettings>(initialDocxSettings);

  const isEmpty = !content.trim();

  useEffect(() => {
    if (!exportMessage) return;
    const timeoutId = window.setTimeout(() => setExportMessage(null), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [exportMessage]);

  const updateSettingsRef = (nextSettings: DocxExportSettings) => {
    settingsRef.current = nextSettings;
  };

  const handleExportClick = async () => {
    if (isEmpty) {
      setExportMessage("Nothing to export, add/write a new .md file");
      return;
    }
    try {
      await handleDownload(content, settingsRef.current);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  return (
    <div className="w-full p-5 flex flex-col gap-4 border border-primary-3 rounded-2xl h-full">
      {/* Top Toolbar */}
      <div className="flex flex-row justify-between items-center text-white-3 border-b border-primary-3/20 pb-2">
        <div className="flex flex-row gap-6 items-center text-sm">
          <button
            onClick={() => setActiveTab("markdown")}
            className={`flex flex-row gap-2 items-center pb-1 transition-all cursor-pointer ${
              activeTab === "markdown"
                ? "text-white-1 font-semibold"
                : "text-white-3 hover:text-white-2"
            }`}
          >
            <Eye size={18} />
            <span>Live</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            title="Settings"
            className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-primary-3/10 hover:text-white-2 cursor-pointer"
            onClick={() =>
              setActiveTab((prev) =>
                prev === "settings" ? "markdown" : "settings",
              )
            }
          >
            <Settings size={14} />
            <span className="text-xs">Settings</span>
          </button>

          <button
            title="Export"
            className="flex items-center gap-2 px-3 py-1 rounded-md bg-primary-3/20 hover:bg-primary-3/30 hover:text-white-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleExportClick}
            disabled={loading}
          >
            <Upload size={14} />
            <span className="text-xs">
              {loading ? "Exporting..." : "Export"}
            </span>
          </button>
        </div>
      </div>

      {exportMessage ? (
        <p className="text-xs text-red-400">{exportMessage}</p>
      ) : null}
      {error ? <p className="text-xs text-red-400">{error}</p> : null}

      <div className="relative min-h-80 flex flex-col">
        {activeTab === "markdown" && (
          <div className="relative group">
            <div
              className="w-full h-200 bg-gray-2 p-6 rounded-lg overflow-y-auto custom-scrollbar border border-transparent"
              onScroll={onScroll}
              ref={scrollRef}
            >
              <MarkdownRenderer content={content} />
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <DocxSettings
            key={selectedFileName ?? "document"}
            initialSettings={initialDocxSettings}
            onSettingsChange={updateSettingsRef}
          />
        )}
      </div>
    </div>
  );
}

export default PreviewSection;
