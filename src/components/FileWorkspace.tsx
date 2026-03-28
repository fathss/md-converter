import { useState } from "react"
import EditSection from "./EditSection"
import PreviewSection from "./PreviewSection"

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

    const handleContentChange = (content: string) => {
        onExternalContentChange(content)
        setIsSynced(false)
    }

    const handleSync = () => {
        setIsSynced(true)
    }

    return (
        <div className="w-full flex flex-row place-content-between gap-4">
            <EditSection
                content={externalContent}
                onChange={handleContentChange}
                files={files}
                selectedIndex={selectedIndex}
                onIndexChange={onIndexChange}
                onContentLoad={onContentLoad}
            />
            <PreviewSection
                content={externalContent}
                isSynced={isSynced}
                onSync={handleSync}
            />
        </div>
    )
}

export default FileWorkspace