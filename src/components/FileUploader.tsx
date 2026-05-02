import FileDropzone from "./FileDropzone";
import type { FileUploaderProps } from "../types/components";

function FileUploader({ setFiles, onContentLoad }: FileUploaderProps) {
  const readFileContent = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") onContentLoad(text);
    };
    reader.readAsText(file);
  };

  const handleFilesSelect = (newFiles: File[]) => {
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
    </div>
  );
}

export default FileUploader;
