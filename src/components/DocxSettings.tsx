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
  const [fileName, setFileName] = useState(initialSettings.fileName);
  const [template, setTemplate] = useState(initialSettings.template);
  const [includeToc, setIncludeToc] = useState(initialSettings.includeToc);
  const [includeFooter, setIncludeFooter] = useState(
    initialSettings.includeFooter,
  );
  const [footerText, setFooterText] = useState(initialSettings.footerText);

  const publishSettings = (nextSettings: DocxExportSettings) => {
    onSettingsChange?.(nextSettings);
  };

  const resolvedFileName = useMemo(() => {
    const cleaned = normalizeDocxBaseName(fileName);
    return `${cleaned || "document"}.docx`;
  }, [fileName]);

  const updateFileName = (value: string) => {
    const normalized = normalizeDocxBaseName(value);
    setFileName(normalized);
    publishSettings({
      fileName: normalized,
      template,
      includeToc,
      includeFooter,
      footerText,
    });
  };

  const updateTemplate = (value: "academic" | "modern") => {
    setTemplate(value);
    publishSettings({
      fileName,
      template: value,
      includeToc,
      includeFooter,
      footerText,
    });
  };

  const updateIncludeToc = (value: boolean) => {
    setIncludeToc(value);
    publishSettings({
      fileName,
      template,
      includeToc: value,
      includeFooter,
      footerText,
    });
  };

  const updateIncludeFooter = (value: boolean) => {
    setIncludeFooter(value);
    publishSettings({
      fileName,
      template,
      includeToc,
      includeFooter: value,
      footerText,
    });
  };

  const updateFooterText = (value: string) => {
    setFooterText(value);
    publishSettings({
      fileName,
      template,
      includeToc,
      includeFooter,
      footerText: value,
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
            value={fileName}
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
            updateTemplate(e.target.value as "academic" | "modern")
          }
          className="bg-gray-3 border border-primary-3 rounded-md p-2 text-sm outline-none focus:border-primary-2 cursor-pointer transition-colors"
        >
          <option value="academic">Academic Paper</option>
          <option value="modern">Modern Report</option>
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
              checked={includeFooter}
              onChange={(e) => updateIncludeFooter(e.target.checked)}
              className="w-4 h-4 rounded border-primary-3 bg-gray-3 checked:bg-primary-2 accent-primary-2"
            />
            <span className="text-sm text-white-3 group-hover:text-white-1 transition-colors">
              Footer Text
            </span>
          </label>
        </div>
      </div>

      {includeFooter ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-primary-2">
            <FileText size={18} />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Footer Content
            </h3>
          </div>
          <input
            type="text"
            value={footerText}
            onChange={(e) => updateFooterText(e.target.value)}
            placeholder="e.g. Confidential • 2026"
            className="bg-gray-3 border border-primary-3 rounded-md p-2 text-sm outline-none focus:border-primary-2"
          />
        </div>
      ) : null}
    </div>
  );
}

export default DocxSettings;
