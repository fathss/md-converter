export type DocxTemplate = "academic" | "default";

export interface DocxExportSettings {
  filename: string;
  template: DocxTemplate;
  includeToc: boolean;
  includePageNumbers: boolean;
}

export const normalizeDocxBaseName = (name?: string) => {
  if (!name) return "document";
  const trimmed = name.trim();
  if (!trimmed) return "document";
  return trimmed.replace(/\.(md|markdown|docx)$/i, "");
};

export const createDefaultDocxExportSettings = (
  sourceFileName?: string,
): DocxExportSettings => ({
  filename: normalizeDocxBaseName(sourceFileName),
  template: "academic",
  includeToc: false,
  includePageNumbers: false,
});
