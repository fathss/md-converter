import { useMemo, useState } from "react";
import { Layout, FileText, PencilLine } from "lucide-react";
import {
  normalizeDocxBaseName,
  type DocxExportSettings,
} from "../types/docxSettings";
import type { DocxSettingsProps } from "../types/components";

function DocxSettings({
  initialSettings,
  onSettingsChange,
}: DocxSettingsProps) {
  const [filename, setFileName] = useState(initialSettings.filename);
  const [template, setTemplate] = useState(initialSettings.template);
  const [includeToc, setIncludeToc] = useState(initialSettings.includeToc);
  const [includePageNumbers, setIncludePageNumbers] = useState(
    initialSettings.includePageNumbers,
  );

  const publishSettings = (nextSettings: DocxExportSettings) => {
    onSettingsChange?.(nextSettings);
  };

  const resolvedFileName = useMemo(() => {
    const cleaned = normalizeDocxBaseName(filename);
    return `${cleaned || "document"}.docx`;
  }, [filename]);

  const updateFileName = (value: string) => {
    const normalized = normalizeDocxBaseName(value);
    setFileName(normalized);
    publishSettings({
      filename: normalized,
      template,
      includeToc,
      includePageNumbers,
    });
  };

  const updateTemplate = (value: "academic" | "default") => {
    setTemplate(value);
    publishSettings({
      filename,
      template: value,
      includeToc,
      includePageNumbers,
    });
  };

  const updateIncludeToc = (value: boolean) => {
    setIncludeToc(value);
    publishSettings({
      filename,
      template,
      includeToc: value,
      includePageNumbers,
    });
  };

  const updateIncludePageNumbers = (value: boolean) => {
    setIncludePageNumbers(value);
    publishSettings({
      filename,
      template,
      includeToc,
      includePageNumbers: value,
    });
  };

  return (
    <div className="w-full h-200 bg-gray-2 p-6 rounded-lg text-white-1 overflow-y-auto custom-scrollbar flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-primary-2">
          <PencilLine size={18} />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            File Name
          </h3>
        </div>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={filename}
            onChange={(e) => updateFileName(e.target.value)}
            placeholder="Enter file name"
            className="bg-gray-3 border border-primary-3 rounded-md p-2 text-sm outline-none focus:border-primary-2"
          />
          <p className="text-xs text-white-4">Output: {resolvedFileName}</p>
        </div>
      </div>

      {/* Template Selection */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-primary-2">
          <Layout size={18} />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Template Style
          </h3>
        </div>
        <select
          value={template}
          onChange={(e) =>
            updateTemplate(e.target.value as "academic" | "default")
          }
          className="bg-gray-3 border border-primary-3 rounded-md p-2 text-sm outline-none focus:border-primary-2 cursor-pointer transition-colors"
        >
          <option value="academic">Academic Paper</option>
          <option value="default">Default</option>
        </select>
      </div>

      {/* Document Elements */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-primary-2">
          <FileText size={18} />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Document Elements
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={includeToc}
              onChange={(e) => updateIncludeToc(e.target.checked)}
              className="w-4 h-4 rounded border-primary-3 bg-gray-3 checked:bg-primary-2 accent-primary-2"
            />
            <span className="text-sm text-white-3 group-hover:text-white-1 transition-colors">
              Table of Contents
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={includePageNumbers}
              onChange={(e) => updateIncludePageNumbers(e.target.checked)}
              className="w-4 h-4 rounded border-primary-3 bg-gray-3 checked:bg-primary-2 accent-primary-2"
            />
            <span className="text-sm text-white-3 group-hover:text-white-1 transition-colors">
              Page Numbers
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default DocxSettings;
