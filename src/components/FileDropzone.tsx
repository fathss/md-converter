import { useRef } from "react";
import { Upload } from "lucide-react";

interface FileDropzoneProps {
  onFilesSelect: (files: File[]) => void;
}

function FileDropzone({ onFilesSelect }: FileDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelect(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelect(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div
      onClick={handleDivClick}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="w-full h-32 border-2 border-dashed border-primary-3 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-2 transition-colors"
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
          <Upload className="text-white-2" size={20} />
          <p className="text-sm text-white-2 font-semibold">Upload Files</p>
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
