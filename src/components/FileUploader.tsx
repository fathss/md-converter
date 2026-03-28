import { useState, useRef } from "react";
import FileDropzone from "./FileDropzone";
import FileItem from "./FileItem";
import { FilePlus, RefreshCw } from "lucide-react";

interface FileUploaderProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  onContentLoad: (content: string) => void;
  onIndexChange: (index: number) => void;
}

function FileUploader({ files, setFiles, onContentLoad, onIndexChange }: FileUploaderProps) {
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
    setFiles((prev) => {
        const updatedFiles = [...prev, ...newFiles];
        // Jika sebelumnya kosong, baca file pertama yang masuk
        if (prev.length === 0 && newFiles.length > 0) {
            readFileContent(newFiles[0]);
            onIndexChange(0);
        }
        return updatedFiles;
    });
  };

  const handleRemoveFile = (index: number) => {
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

  const handleConvert = () => {
    if (files.length === 0) return;

    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
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
        multiple
      />

      {files.length === 0 ? (
        <FileDropzone onFilesSelect={handleFilesSelect} />
      ) : (
        <div className="w-150 flex flex-col gap-3">
          {files.map((file, index) => (
            <FileItem
              key={`${file.name}-${index}`}
              file={file}
              onRemove={() => handleRemoveFile(index)}
            />
          ))}

          <div className="flex flex-row justify-between mt-2">
            <div
              onClick={handleAddMoreClick}
              className="flex flex-row gap-2 items-center bg-gray-3 p-3 px-5 rounded-lg cursor-pointer hover:bg-gray-3/80 transition-colors"
            >
              <FilePlus className="text-white-2" size={18} />
              <p className="text-sm text-white-2">Add More Files</p>
            </div>

            <div
              onClick={handleConvert}
              className="flex flex-row gap-2 items-center bg-primary-2 p-3 px-5 rounded-lg cursor-pointer hover:bg-primary-2/80 transition-colors"
            >
              <RefreshCw className="text-white-2" size={18} />
              <p className="text-sm text-white-2 font-semibold">
                {files.length === 1 ? "Convert" : "Convert All"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
