import { useState } from "react";
import Title from "../components/Title";
import FileUploader from "../components/FileUploader";
import FileWorkspace from "../components/FileWorkspace";

function MainPage() {
  const [markdownContent, setMarkdownContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <>
      <div className="w-6xl flex flex-col items-center gap-8">
        <Title />
        <FileUploader setFiles={setFiles} onContentLoad={setMarkdownContent} />
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
