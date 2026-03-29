import { useState } from "react"
import { Eye, Settings, FileText, ExternalLink } from "lucide-react"
import DocxSettings from "./DocxSettings"
import MarkdownRenderer from "./MarkdownRenderer"
import FileSelector from "./FileSelector"

interface PreviewSectionProps {
  content: string;
  // Props baru untuk FileSelector
  showFileSelector?: boolean;
  files?: File[];
  selectedIndex?: number;
  onIndexChange?: (index: number) => void;
  onContentLoad?: (content: string) => void;
}

function PreviewSection({
  content,
  showFileSelector,
  files,
  selectedIndex,
  onIndexChange,
  onContentLoad
}: PreviewSectionProps) {
  const [activeTab, setActiveTab] = useState<"markdown" | "docx" | "settings">("markdown")

  return (
    <div className="w-full p-5 flex flex-col gap-4 border border-primary-3 rounded-2xl h-full">
      {/* Tab Navigation */}
      <div className="flex flex-row justify-between items-center text-white-3 border-b border-primary-3/20 pb-2">
        <div className="flex flex-row gap-6 items-center text-sm">
          <div
            onClick={() => setActiveTab("markdown")}
            className={`flex flex-row gap-2 items-center pb-1 cursor-pointer transition-all ${activeTab === "markdown" ? "border-b-2 border-primary-2 text-white-1" : "hover:text-white-1"
              }`}
          >
            <Eye size={18} />
            <span className={activeTab === "markdown" ? "font-semibold" : ""}>Live Preview</span>
          </div>
          <div
            onClick={() => setActiveTab("docx")}
            className={`flex flex-row gap-2 items-center pb-1 cursor-pointer transition-all relative ${activeTab === "docx" ? "border-b-2 border-primary-2 text-white-1" : "hover:text-white-1"
              }`}
          >
            <FileText size={18} />
            <span className={activeTab === "docx" ? "font-semibold" : ""}>Docx Preview</span>
          </div>
          <div
            onClick={() => setActiveTab("settings")}
            className={`flex flex-row gap-2 items-center pb-1 cursor-pointer transition-all ${activeTab === "settings" ? "border-b-2 border-primary-2 text-white-1" : "hover:text-white-1"
              }`}
          >
            <Settings size={18} />
            <span className={activeTab === "settings" ? "font-semibold" : ""}>Settings</span>
          </div>
        </div>

        {/* Render FileSelector hanya jika Editor sedang disembunyikan */}
        {showFileSelector && files && selectedIndex !== undefined && onIndexChange && onContentLoad && (
          <FileSelector
            files={files}
            selectedIndex={selectedIndex}
            onIndexChange={onIndexChange}
            onContentLoad={onContentLoad}
          />
        )}
      </div>

      <div className="relative min-h-80 flex flex-col">
        {activeTab === "markdown" && (
          <div className="relative group">
            <div className="w-full h-120 bg-gray-2 p-6 rounded-lg overflow-y-auto custom-scrollbar border border-transparent">
              <MarkdownRenderer content={content} />
            </div>
          </div>
        )}

        {activeTab === "docx" && (
          <div className="w-full h-120 bg-gray-2 rounded-lg flex flex-col items-center justify-center p-8 text-center gap-6 border border-dashed border-primary-3/30">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-primary-3/20 p-5 rounded-full">
                <FileText size={48} className="text-primary-2" />
              </div>
              <div className="space-y-2">
                <h3 className="text-white-1 font-bold text-lg">External Docx Preview</h3>
                <p className="text-white-4 text-xs max-w-xs mx-auto leading-relaxed text-white-3">
                  To save resources, real-time Docx rendering is handled in a dedicated viewer.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full items-center">
              <a
                href="/preview"
                target="_blank"
                className="bg-primary-2 hover:bg-primary-1 text-white-1 px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary-2/20"
              >
                <ExternalLink size={16} />
                Open Preview in New Tab
              </a>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <DocxSettings />
        )}
      </div>
    </div>
  )
}

export default PreviewSection
