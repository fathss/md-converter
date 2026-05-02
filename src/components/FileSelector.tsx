import { useState } from "react";
import { ChevronRight, FileText } from "lucide-react";
import type { FileSelectorProps } from "../types/components";

function FileSelector({
  files,
  selectedIndex,
  onIndexChange,
  onContentLoad,
}: FileSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (files.length === 0) return null;

  const handleFileSwitch = (index: number) => {
    onIndexChange(index);
    setIsOpen(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") onContentLoad(text);
    };
    reader.readAsText(files[index]);
  };

  if (files.length === 1) {
    return (
      <div className="flex flex-row items-center justify-center gap-2 text-xs text-white-4 border border-primary-3/30 rounded-lg p-1 pl-3 pr-3 w-max select-none">
        <p className="truncate max-w-[150px]">{files[0].name}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-row items-center justify-center gap-2 text-xs text-white-4 border border-primary-2 rounded-lg p-1 pl-3 pr-3 w-max cursor-pointer hover:bg-primary-2/10 transition-colors"
      >
        <p className="truncate max-w-[120px]">{files[selectedIndex]?.name}</p>
        <ChevronRight
          size={16}
          className={`transition-transform ${isOpen ? "rotate-90" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-2 border border-primary-3 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-2 max-h-60 overflow-y-auto custom-scrollbar">
            {files.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                onClick={() => handleFileSwitch(idx)}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs transition-colors ${
                  idx === selectedIndex
                    ? "bg-primary-2 text-white-1"
                    : "text-white-4 hover:bg-gray-3 hover:text-white-2"
                }`}
              >
                <FileText size={14} />
                <p className="truncate">{file.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FileSelector;
