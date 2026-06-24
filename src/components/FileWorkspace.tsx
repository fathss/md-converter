import { useState, useRef, useEffect, useCallback } from "react";
import EditSection from "./EditSection";
import PreviewSection from "./PreviewSection";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import type { FileWorkspaceProps } from "../types/components";

function FileWorkspace({
  externalContent,
  previewContent,
  onExternalContentChange,
  files = [],
  selectedIndex = 0,
  onIndexChange,
  onContentLoad,
}: FileWorkspaceProps) {
  const [leftWidth, setLeftWidth] = useState(40);
  const [showEditor, setShowEditor] = useState(true);
  const isResizing = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const editorPanelRef = useRef<HTMLDivElement>(null);
  const leftWidthRef = useRef(leftWidth);
  const editorScrollRef = useRef<HTMLTextAreaElement>(null);
  const previewScrollRef = useRef<HTMLDivElement>(null);
  const isSyncingScroll = useRef(false);

  const handleContentChange = (content: string) => {
    onExternalContentChange(content);
  };

  const syncScroll = (
    source: "editor" | "preview",
    scrollTop: number,
    scrollHeight: number,
    clientHeight: number,
  ) => {
    if (isSyncingScroll.current) return;

    const sourceScrollableHeight = scrollHeight - clientHeight;
    if (sourceScrollableHeight <= 0) return;

    const targetElement =
      source === "editor" ? previewScrollRef.current : editorScrollRef.current;
    if (!targetElement) return;

    const targetScrollableHeight =
      targetElement.scrollHeight - targetElement.clientHeight;
    if (targetScrollableHeight <= 0) return;

    const ratio = scrollTop / sourceScrollableHeight;
    isSyncingScroll.current = true;
    targetElement.scrollTop = ratio * targetScrollableHeight;
    window.requestAnimationFrame(() => {
      isSyncingScroll.current = false;
    });
  };

  const handleEditorScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    syncScroll(
      "editor",
      target.scrollTop,
      target.scrollHeight,
      target.clientHeight,
    );
  };

  const handlePreviewScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    syncScroll(
      "preview",
      target.scrollTop,
      target.scrollHeight,
      target.clientHeight,
    );
  };

  const startResizing = () => {
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = "default";
    document.body.style.userSelect = "auto";
    setLeftWidth(leftWidthRef.current);
  }, []);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing.current || !containerRef.current || !editorPanelRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      // Clamp resizing using pixel limits to avoid shrinking toolbar areas
      const minLeftPx = 400; // preferred minimum for editor panel
      const maxLeftPx = 640; // preferred maximum for editor panel
      const minRightPx = 360; // preferred minimum for preview panel to keep toolbars visible
      const totalPx = containerRect.width;
      let newLeftPx = e.clientX - containerRect.left;

      let effectiveMinPx: number;
      let effectiveMaxPx: number;
      if (totalPx >= minLeftPx + minRightPx) {
        // normal case: reserve min pixels for both panels
        effectiveMinPx = minLeftPx;
        effectiveMaxPx = Math.min(maxLeftPx, totalPx - minRightPx);
      } else {
        // small screens: fall back to percentage but avoid extreme collapse
        effectiveMinPx = Math.max(140, totalPx * 0.28);
        effectiveMaxPx = Math.max(effectiveMinPx + 1, totalPx - 120);
      }

      newLeftPx = Math.max(effectiveMinPx, Math.min(effectiveMaxPx, newLeftPx));
      const newWidthPercent = (newLeftPx / totalPx) * 100;
      leftWidthRef.current = newWidthPercent;
      editorPanelRef.current.style.width = `${newWidthPercent}%`;
    },
    [],
  );

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [onMouseMove, stopResizing]);

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
          {showEditor ? (
            <PanelLeftClose size={16} />
          ) : (
            <PanelLeftOpen size={16} />
          )}
        </button>
      </div>

      <div ref={containerRef} className="w-full flex flex-row items-stretch">
        {/* Left Panel: Editor */}
        {showEditor && (
          <div
            ref={editorPanelRef}
            style={{ width: `${leftWidth}%` }}
            className="shrink-0"
          >
            <EditSection
              content={externalContent}
              onChange={handleContentChange}
              onScroll={handleEditorScroll}
              scrollRef={editorScrollRef}
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
        <div className="flex-1 min-w-0">
          <PreviewSection
            content={previewContent}
            onScroll={handlePreviewScroll}
            scrollRef={previewScrollRef}
            files={files}
            selectedIndex={selectedIndex}
            onIndexChange={onIndexChange}
            onContentLoad={onContentLoad}
          />
        </div>
      </div>
    </div>
  );
}

export default FileWorkspace;
