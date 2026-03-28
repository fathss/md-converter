import { Edit, Trash2 } from "lucide-react"
import FileSelector from "./FileSelector"

interface EditSectionProps {
    content: string;
    onChange: (content: string) => void;
    files: File[];
    selectedIndex: number;
    onIndexChange: (index: number) => void;
    onContentLoad: (content: string) => void;
}

function EditSection({
    content,
    onChange,
    files,
    selectedIndex,
    onIndexChange,
    onContentLoad
}: EditSectionProps) {
    return (
        <div className="w-full p-5 flex flex-col gap-4 border border-primary-3 rounded-2xl relative h-full">
            <div className="flex flex-row justify-between items-center text-white-3 border-b border-primary-3/20 pb-2">
                <div className="flex flex-row gap-4 items-center">
                    <Edit size={18} />
                    <h2 className="text-sm font-semibold">Editor</h2>
                </div>

                <FileSelector
                    files={files}
                    selectedIndex={selectedIndex}
                    onIndexChange={onIndexChange}
                    onContentLoad={onContentLoad}
                />
            </div>

            <textarea
                className="w-full h-120 bg-gray-2 p-6 rounded-lg text-xs text-white-1 outline-none resize-none border border-transparent focus:border-primary-2 transition-all font-mono leading-relaxed"
                placeholder="Write your markdown here..."
                value={content}
                onChange={(e) => onChange(e.target.value)}
            />

            <div className="flex justify-between items-center text-xs text-white-4 px-1">
                <p>Characters: {content.replace(/[\s#\*]/g, "").length}</p>
                <button
                    onClick={() => onChange("")}
                    className="flex items-center gap-1.5 hover:text-red-400 transition-colors cursor-pointer group"
                    title="Clear editor"
                >
                    <Trash2 size={14} className="group-hover:scale-110 transition-transform" />
                    <span>Clear</span>
                </button>
            </div>
        </div>
    )
}

export default EditSection
