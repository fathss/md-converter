import { useState, useRef, useEffect } from "react"
import EditSection from "./EditSection"
import PreviewSection from "./PreviewSection"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

interface FileWorkspaceProps {
  externalContent: string;
  onExternalContentChange: (content: string) => void;
  files: File[];
  selectedIndex: number;
  onIndexChange: (index: number) => void;
  onContentLoad: (content: string) => void;
}

function FileWorkspace({
  externalContent,
  onExternalContentChange,
  files,
  selectedIndex,
  onIndexChange,
  onContentLoad
}: FileWorkspaceProps) {
  const [isSynced, setIsSynced] = useState(true)
  const [leftWidth, setLeftWidth] = useState(40);
  const [showEditor, setShowEditor] = useState(true);
  const isResizing = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleContentChange = (content: string) => {
    onExternalContentChange(content)
    setIsSynced(false)
  }

  const handleSync = () => {
    setIsSynced(true)
  }

  const startResizing = () => {
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const stopResizing = () => {
    isResizing.current = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isResizing.current || !containerRef.current || !showEditor) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidthPercent = ((e.clientX - containerRect.left) / containerRect.width) * 100;

    if (newWidthPercent >= 25 && newWidthPercent <= 45) {
      setLeftWidth(newWidthPercent);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [showEditor]);

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Toolbar for Workspace Controls */}
      <div className="w-full flex justify-end px-2">
        <button
          onClick={() => setShowEditor(!showEditor)}
          className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-white-4 cursor-pointer hover:text-primary-2 transition-colors group"
          title={showEditor ? "Hide Editor" : "Show Editor"}
        >
          <span>{showEditor ? "Hide Editor" : "Show Editor"}</span>
          {showEditor ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </button>
      </div>

      <div
        ref={containerRef}
        className="w-full flex flex-row items-stretch"
      >
        {/* Left Panel: Editor */}
        {showEditor && (
          <div style={{ width: `${leftWidth}%` }} className="shrink-0 transition-all duration-300">
            <EditSection
              content={externalContent}
              onChange={handleContentChange}
              files={files}
              selectedIndex={selectedIndex}
              onIndexChange={onIndexChange}
              onContentLoad={onContentLoad}
            />
          </div>
        )}

        {/* Resizer Bar */}
        {showEditor && (
          <div
            onMouseDown={startResizing}
            className="w-4 flex items-center justify-center cursor-col-resize group active:w-6 transition-all"
          >
            <div className="w-[2px] h-24 bg-primary-3/30 rounded-full group-hover:bg-primary-2 group-active:bg-primary-1 transition-colors" />
          </div>
        )}

        {/* Right Panel: Preview */}
        <div className="flex-1 min-w-0 transition-all duration-300">
          <PreviewSection
            content={externalContent}
            isSynced={isSynced}
            onSync={handleSync}
            showFileSelector={!showEditor}
            files={files}
            selectedIndex={selectedIndex}
            onIndexChange={onIndexChange}
            onContentLoad={onContentLoad}
          />
        </div>
      </div>
    </div>
  )
}

export default FileWorkspace
