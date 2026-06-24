import { useState } from "react";
import mermaid from "mermaid";
import type { DocxExportSettings } from "../types/docxSettings";
import type {
  ConversionResult,
  RawConversionResponse,
} from "../types/conversions";

const API_BASE_URL = "/api";

mermaid.initialize({ startOnLoad: false });

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

async function svgToPng(svg: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return reject(new Error("Canvas context unavailable"));

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svg, "image/svg+xml");
    const svgEl = svgDoc.querySelector("svg");
    if (!svgEl) return reject(new Error("Invalid SVG"));

    const viewBox = svgEl.getAttribute("viewBox");
    let width = parseFloat(svgEl.getAttribute("width") ?? "0");
    let height = parseFloat(svgEl.getAttribute("height") ?? "0");

    if ((!width || !height) && viewBox) {
      const parts = viewBox.split(" ").map(Number);
      width = parts[2];
      height = parts[3];
    }

    const scale = 2;
    canvas.width = (width || 800) * scale;
    canvas.height = (height || 600) * scale;

    svgEl.setAttribute("width", String(canvas.width));
    svgEl.setAttribute("height", String(canvas.height));

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgEl);
    const base64 = btoa(unescape(encodeURIComponent(svgString)));

    const img = new Image();
    img.src = `data:image/svg+xml;base64,${base64}`;

    img.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = () => reject(new Error("Failed to load SVG as image"));
  });
}

async function preprocessMermaid(markdown: string): Promise<string> {
  const pattern = /```mermaid\s*\r?\n([\s\S]*?)```/g;
  const matches = [...markdown.matchAll(pattern)];

  let processed = markdown;

  // render inside a visible but zero-opacity container so layout is fully computed
  const container = document.createElement("div");
  container.style.cssText = [
    "position:fixed",
    "top:0",
    "left:0",
    "opacity:0",
    "pointer-events:none",
    "width:2000px",
    "overflow:visible",
    "z-index:-1",
  ].join(";");
  document.body.appendChild(container);

  try {
    for (const match of matches) {
      const diagram = match[1].trim();
      const id = `mermaid-${crypto.randomUUID()}`;

      const { svg } = await mermaid.render(id, diagram);

      container.innerHTML = svg;
      const mountedSvg = container.querySelector("svg");
      if (!mountedSvg) continue;

      // wait for layout to fully settle
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await new Promise((resolve) => requestAnimationFrame(resolve));

      // read viewBox from the mounted SVG — most reliable source of true dimensions
      const viewBox = mountedSvg.getAttribute("viewBox");
      let width = parseFloat(mountedSvg.getAttribute("width") ?? "0");
      let height = parseFloat(mountedSvg.getAttribute("height") ?? "0");

      if ((!width || !height) && viewBox) {
        const parts = viewBox.split(" ").map(Number);
        width = parts[2];
        height = parts[3];
      }

      // last resort — scrollWidth/scrollHeight from the DOM
      if (!width) width = mountedSvg.scrollWidth;
      if (!height) height = mountedSvg.scrollHeight;

      mountedSvg.setAttribute("width", String(width));
      mountedSvg.setAttribute("height", String(height));

      const resolvedSvg = new XMLSerializer().serializeToString(mountedSvg);
      const png = await svgToPng(resolvedSvg);
      processed = processed.replace(match[0], `![diagram](${png})`);
    }
  } finally {
    document.body.removeChild(container);
  }

  return processed;
}

export function useConversions() {
  const [conversionResult, setConversionResult] =
    useState<ConversionResult>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestConvert = async (
    content: string,
    settings: DocxExportSettings,
  ) => {
    const processedContent = await preprocessMermaid(content);

    const response = await fetch(`${API_BASE_URL}/convert-text/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: processedContent,
        settings,
      }),
    });

    await throwIfNotOk(response, "Conversion failed");

    const data = (await response.json()) as RawConversionResponse;
    return mapConversionResult(data, settings.filename);
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