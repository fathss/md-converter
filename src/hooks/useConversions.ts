import { useState } from "react";
import type { DocxExportSettings } from "../types/docxSettings";
import type {
  ConversionResult,
  RawConversionResponse,
} from "../types/conversions";

const API_BASE_URL = "http://localhost:8000";

const getErrorMessage = (err: unknown) =>
  err instanceof Error ? err.message : String(err);

const throwIfNotOk = async (response: Response, fallbackMessage: string) => {
  if (response.ok) return;
  const text = await response.text();
  throw new Error(text || response.statusText || fallbackMessage);
};

const mapConversionResult = (
  data: RawConversionResponse,
  fallbackFilename: string,
): Exclude<ConversionResult, null> => ({
  fileId: data.file_id ?? data.fileId ?? data.id ?? "",
  filename: data.filename ?? fallbackFilename,
  size: data.size,
});

const extractDownloadFilename = (
  disposition: string | null,
  fallbackFilename: string,
) => {
  const filenameMatch = (disposition ?? "").match(/filename=([^;]+)/i);
  return filenameMatch
    ? filenameMatch[1].replace(/['"]/g, "")
    : fallbackFilename;
};

const triggerFileDownload = (blob: Blob, filename: string) => {
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(downloadUrl);
};

export function useConversions() {
  const [conversionResult, setConversionResult] =
    useState<ConversionResult>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestConvert = async (
    content: string,
    settings: DocxExportSettings,
  ) => {
    const response = await fetch(`${API_BASE_URL}/convert-text/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        filename: settings.fileName,
        settings,
      }),
    });

    await throwIfNotOk(response, "Conversion failed");

    const data = (await response.json()) as RawConversionResponse;
    return mapConversionResult(data, settings.fileName);
  };

  const requestDownload = async (fileId: string) => {
    const response = await fetch(`${API_BASE_URL}/download/${fileId}`);
    await throwIfNotOk(response, "Download failed");
    return response;
  };

  const handleConvert = async (
    content: string,
    settings: DocxExportSettings,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const result = await requestConvert(content, settings);
      setConversionResult(result);
      return result;
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (
    content: string,
    settings: DocxExportSettings,
    fileId?: string,
  ) => {
    const latestConversion = await handleConvert(content, settings);
    const id = fileId ?? latestConversion.fileId ?? conversionResult?.fileId;
    if (!id) throw new Error("No file id available to download");

    try {
      const response = await requestDownload(id);
      const blob = await response.blob();
      const downloadFilename = extractDownloadFilename(
        response.headers.get("Content-Disposition"),
        latestConversion.filename.replace(/\.md$/i, ".docx"),
      );
      triggerFileDownload(blob, downloadFilename);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      throw err;
    }
  };

  return {
    conversionResult,
    loading,
    error,
    handleConvert,
    handleDownload,
    setConversionResult,
  };
}
