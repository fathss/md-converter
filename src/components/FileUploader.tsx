import { useState } from "react";
import FileDropzone from "./FileDropzone";
import type { FileUploaderProps } from "../types/components";

function FileUploader({ setFiles, onContentLoad }: FileUploaderProps) {
  const [error, setError] = useState<string | null>(null);

  const readFileContent = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") onContentLoad(text);
    };
    reader.readAsText(file);
  };

  const isValidMdFile = (file: File) => file.name.endsWith(".md");

  const handleFilesSelect = (newFiles: File[]) => {
    const invalidFiles = newFiles.filter((f) => !isValidMdFile(f));
    if (invalidFiles.length > 0) {
      setError(`Only .md files are allowed.`);
      return;
    }
    setError(null);
    setFiles(() => {
      const updatedFiles = [...newFiles];
      if (newFiles.length > 0) {
        readFileContent(newFiles[0]);
      }
      return updatedFiles;
    });
  };

  return (
    <div className="w-full flex flex-col gap-4 items-center">
      <FileDropzone onFilesSelect={handleFilesSelect} />
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
    </div>
  );
}

export default FileUploader;
