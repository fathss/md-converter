import { useState, useRef } from "react";
import FileDropzone from "./FileDropzone";
import FileItem from "./FileItem";
import { Download, RefreshCw, FileEdit } from "lucide-react";

interface FileUploaderProps {
  files: File[];
  markdownContent: string;
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  onContentLoad: (content: string) => void;
  onIndexChange: (index: number) => void;
}

interface ConversionResult {
  fileId: string;
  filename: string;
  size: number;
}

function FileUploader({
  files,
  setFiles,
  markdownContent,
  onContentLoad,
  onIndexChange,
}: FileUploaderProps) {
  const [conversionResult, setConversionResult] =
    useState<ConversionResult | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const readFileContent = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") onContentLoad(text);
    };
    reader.readAsText(file);
  };

  const handleFilesSelect = (newFiles: File[]) => {
    setConversionResult(null);
    setFiles(() => {
      const updatedFiles = [...newFiles];
      // Jika sebelumnya kosong, baca file pertama yang masuk
      if (newFiles.length > 0) {
        readFileContent(newFiles[0]);
        onIndexChange(0);
      }
      return updatedFiles;
    });
  };

  const handleRemoveFile = (index: number) => {
    setConversionResult(null);
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length > 0) {
        // Jika menghapus file yang sedang dipilih atau file sebelumnya
        onIndexChange(0);
        readFileContent(updated[0]);
      }
      return updated;
    });
  };

  const handleAddMoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelect(Array.from(e.target.files));
    }
  };

  const handleConvert = async () => {
    if (files.length === 0) return;

    const mdContent = markdownContent;

    try {
      setIsConverting(true);

      const response = await fetch("http://localhost:8000/convert-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: mdContent,
          filename: files[0].name,
        }),
      });

      if (!response.ok) {
        throw new Error("Conversion failed");
      }

      const data = await response.json();

      setConversionResult({
        fileId: data.file_id,
        filename: data.filename,
        size: data.size,
      });
    } catch (error) {
      console.error("Conversion error:", error);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = async (fileId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/download/${fileId}`);

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition");
      const filenameMatch = disposition?.match(/filename=([^;]+)/i);
      const filename =
        filenameMatch?.[1]?.replace(/["']/g, "") ??
        conversionResult?.filename ??
        "document.docx";

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 items-center">
      {/* Hidden input for "Add More Files" */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".md"
      />

      {files.length === 0 ? (
        <FileDropzone onFilesSelect={handleFilesSelect} />
      ) : (
        <div className="w-150 flex flex-col gap-3">
          {files.map((file, index) => (
            <FileItem
              key={
                conversionResult
                  ? conversionResult.fileId
                  : `${file.name}-${index}`
              }
              filename={
                conversionResult ? conversionResult.filename : file.name
              }
              fileSize={conversionResult ? conversionResult.size : file.size}
              isConverting={isConverting}
              onRemove={() => handleRemoveFile(index)}
            />
          ))}

          <div className="flex flex-row justify-between mt-2">
            <div
              onClick={handleAddMoreClick}
              className="flex flex-row gap-2 items-center bg-gray-3 p-3 px-5 rounded-lg cursor-pointer hover:bg-gray-3/80 transition-colors"
            >
              <FileEdit className="text-white-2" size={18} />
              <p className="text-sm text-white-2">Change File</p>
            </div>

            <div
              onClick={
                conversionResult
                  ? () => handleDownload(conversionResult.fileId)
                  : handleConvert
              }
              className="flex flex-row gap-2 items-center bg-primary-2 p-3 px-5 rounded-lg cursor-pointer hover:bg-primary-2/80 transition-colors shadow-lg shadow-primary-2/10"
            >
              {conversionResult == null ? (
                <>
                  <RefreshCw className="text-white-2" size={18} />
                  <p className="text-sm text-white-2 font-semibold">
                    {isConverting ? "Converting..." : "Convert to Docx"}
                  </p>
                </>
              ) : (
                <>
                  <Download className="text-white-2" size={18} />
                  <p className="text-sm text-white-2 font-semibold">
                    {files.length === 1 ? "Download Docx" : "Download All"}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
