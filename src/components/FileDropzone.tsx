import { useRef, useState } from "react";
import { Upload } from "lucide-react";

interface FileDropzoneProps {
  onFilesSelect: (files: File[]) => void;
}

function FileDropzone({ onFilesSelect }: FileDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelect(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelect(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div
      onClick={handleDivClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 ${
        isDragging 
        ? "border-primary-2 bg-primary-2/5 scale-[1.01]" 
        : "border-white-4/20 hover:border-white-4/40 bg-transparent"
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".md"
        multiple
      />
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className={isDragging ? "text-primary-2" : "text-white-3"} size={20} />
          <p className={`text-sm font-semibold ${isDragging ? "text-primary-2" : "text-white-2"}`}>
            Upload Files
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-center text-white-4 text-xs">
            Drag & drop markdown files here
            <br />
            or click to select files
          </p>
        </div>
      </div>
    </div>
  );
}

export default FileDropzone;
