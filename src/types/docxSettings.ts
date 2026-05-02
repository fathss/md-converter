export type DocxTemplate = "academic" | "modern";

export interface DocxExportSettings {
  fileName: string;
  template: DocxTemplate;
  includeToc: boolean;
  includeFooter: boolean;
  footerText: string;
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
  fileName: normalizeDocxBaseName(sourceFileName),
  template: "academic",
  includeToc: false,
  includeFooter: false,
  footerText: "",
});
