import type { Dispatch, RefObject, SetStateAction, UIEvent } from "react";

import type { DocxExportSettings } from "./docxSettings";

export interface FileUploaderProps {
  setFiles: Dispatch<SetStateAction<File[]>>;
  onContentLoad: (content: string) => void;
}

export interface FileDropzoneProps {
  onFilesSelect: (files: File[]) => void;
}

export interface FileItemProps {
  filename: string;
  fileSize: number;
  isConverting: boolean;
  onRemove: () => void;
}

export interface FileSelectorProps {
  files: File[];
  selectedIndex: number;
  onIndexChange: (index: number) => void;
  onContentLoad: (content: string) => void;
}

export interface FileWorkspaceProps {
  externalContent: string;
  previewContent: string;
  onExternalContentChange: (content: string) => void;
  files?: File[];
  selectedIndex?: number;
  onIndexChange?: (index: number) => void;
  onContentLoad?: (content: string) => void;
}

export interface EditSectionProps {
  content: string;
  onChange: (content: string) => void;
  onScroll?: (event: UIEvent<HTMLTextAreaElement>) => void;
  scrollRef?: RefObject<HTMLTextAreaElement | null>;
  files?: File[];
  selectedIndex?: number;
  onIndexChange?: (index: number) => void;
  onContentLoad?: (content: string) => void;
}

export interface PreviewSectionProps {
  content: string;
  onScroll?: (event: UIEvent<HTMLDivElement>) => void;
  scrollRef?: RefObject<HTMLDivElement | null>;
  files?: File[];
  selectedIndex?: number;
  onIndexChange?: (index: number) => void;
  onContentLoad?: (content: string) => void;
}

export interface DocxSettingsProps {
  initialSettings: DocxExportSettings;
  onSettingsChange?: (settings: DocxExportSettings) => void;
}

export interface MarkdownRendererProps {
  content: string;
}

export interface MermaidRendererProps {
  chart: string;
}
