import { useEffect, useRef, useState } from "react";
import Title from "../components/Title";
import FileUploader from "../components/FileUploader";
import FileWorkspace from "../components/FileWorkspace";

const getPreviewDebounceDelay = (contentLength: number) => {
  if (contentLength <= 20000) return 0;
  if (contentLength > 60000) return 800;
  if (contentLength > 40000) return 500;
  return 300;
};

function MainPage() {
  const [markdownContent, setMarkdownContent] = useState("");
  const [previewContent, setPreviewContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const previewTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (previewTimerRef.current !== null) {
        window.clearTimeout(previewTimerRef.current);
      }
    };
  }, []);

  const updateContent = (content: string) => {
    setMarkdownContent(content);

    if (previewTimerRef.current !== null) {
      window.clearTimeout(previewTimerRef.current);
      previewTimerRef.current = null;
    }

    const debounceDelay = getPreviewDebounceDelay(content.length);
    if (debounceDelay === 0) {
      setPreviewContent(content);
      return;
    }

    previewTimerRef.current = window.setTimeout(() => {
      setPreviewContent(content);
      previewTimerRef.current = null;
    }, debounceDelay);
  };

  return (
    <>
      <div className="w-6xl flex flex-col items-center gap-8">
        <Title />
        <FileUploader setFiles={setFiles} onContentLoad={updateContent} />
        <FileWorkspace
          externalContent={markdownContent}
          previewContent={previewContent}
          onExternalContentChange={updateContent}
          files={files}
          selectedIndex={selectedIndex}
          onIndexChange={setSelectedIndex}
        />
      </div>
    </>
  );
}

export default MainPage;
