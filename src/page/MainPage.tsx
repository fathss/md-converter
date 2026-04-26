import { useState, type SetStateAction } from "react";
import Title from "../components/Title";
import FileUploader from "../components/FileUploader";
import FileWorkspace from "../components/FileWorkspace";

function MainPage() {
  const [markdownContent, setMarkdownContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const resolveNextFiles = (
    value: SetStateAction<File[]>,
    prevFiles: File[],
  ) => {
    if (typeof value === "function") {
      const updater = value as (previous: File[]) => File[];
      return updater(prevFiles);
    }

    return value;
  };

  const handleFilesChange = (value: SetStateAction<File[]>) => {
    setFiles((prevFiles) => {
      const nextFiles = resolveNextFiles(value, prevFiles);

      if (nextFiles.length === 0) {
        setMarkdownContent("");
      }

      return nextFiles;
    });
  };

  return (
    <>
      <div className="w-6xl flex flex-col items-center gap-8">
        <Title />
        <FileUploader
          files={files}
          setFiles={handleFilesChange}
          markdownContent={markdownContent}
          onContentLoad={setMarkdownContent}
          onIndexChange={setSelectedIndex}
        />
        <FileWorkspace
          externalContent={markdownContent}
          onExternalContentChange={setMarkdownContent}
          files={files}
          selectedIndex={selectedIndex}
          onIndexChange={setSelectedIndex}
          onContentLoad={setMarkdownContent}
        />
      </div>
    </>
  );
}

export default MainPage;
