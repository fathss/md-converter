import { Settings, XCircle } from "lucide-react";

interface FileItemProps {
  file: File;
  onRemove: () => void;
}

function FileItem({ file, onRemove }: FileItemProps) {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-150 p-4 pl-6 pr-6 border border-primary-3 rounded-lg bg-gray-2">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-1 justify-center">
          <p className="text-white-2 font-medium truncate max-w-xs">
            {file.name}
          </p>
          <p className="text-xs text-white-4">{formatSize(file.size)}</p>
        </div>
        <div className="flex flex-row gap-6">
          <Settings className="text-white-4 cursor-pointer hover:text-white-2 transition-colors" size={20} />
          <XCircle
            className="text-white-4 cursor-pointer hover:text-red-400 transition-colors"
            size={20}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default FileItem;
