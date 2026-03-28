import { useState } from "react"
import EditSection from "./EditSection"
import PreviewSection from "./PreviewSection"

function FileWorkspace() {
    const [markdownContent, setMarkdownContent] = useState("")
    const [isSynced, setIsSynced] = useState(true)

    const handleContentChange = (content: string) => {
        setMarkdownContent(content)
        setIsSynced(false)
    }

    const handleSync = () => {
        setIsSynced(true)
    }

    return (
        <div className="w-full flex flex-row place-content-between gap-4">
            <EditSection
                content={markdownContent}
                onChange={handleContentChange}
            />
            <PreviewSection
                content={markdownContent}
                isSynced={isSynced}
                onSync={handleSync}
            />
        </div>
    )
}

export default FileWorkspace