import { useState } from "react"
import { Edit, ChevronRight, FileText, Trash2 } from "lucide-react"

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
    const [isOpen, setIsOpen] = useState(false);

    const handleFileSwitch = (index: number) => {
        onIndexChange(index);
        setIsOpen(false);

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result;
            if (typeof text === "string") onContentLoad(text);
        };
        reader.readAsText(files[index]);
    };

    return (
        <div className="w-full p-5 flex flex-col gap-4 border border-primary-3 rounded-2xl relative">
            <div className="flex flex-row justify-between items-center text-white-3 border-b border-primary-3/20 pb-2">
                <div className="flex flex-row gap-4 items-center">
                    <Edit size={18} />
                    <h2 className="text-sm font-semibold">Editor</h2>
                </div>

                {files.length > 0 && (
                    <div className="relative">
                        {files.length === 1 ? (
                            <div className="flex flex-row items-center justify-center gap-2 text-xs text-white-4 border border-primary-3/30 rounded-lg p-1 pl-3 pr-3 w-max select-none">
                                <p className="truncate max-w-[150px]">{files[0].name}</p>
                            </div>
                        ) : (
                            <>
                                <div
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="flex flex-row items-center justify-center gap-2 text-xs text-white-4 border border-primary-2 rounded-lg p-1 pl-3 pr-3 w-max cursor-pointer hover:bg-primary-2/10 transition-colors"
                                >
                                    <p className="truncate max-w-[120px]">{files[selectedIndex]?.name}</p>
                                    <ChevronRight size={16} className={`transition-transform ${isOpen ? "rotate-90" : ""}`} />
                                </div>

                                {isOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-gray-2 border border-primary-3 rounded-xl shadow-xl z-50 overflow-hidden">
                                        <div className="p-2 max-h-60 overflow-y-auto">
                                            {files.map((file, idx) => (
                                                <div
                                                    key={`${file.name}-${idx}`}
                                                    onClick={() => handleFileSwitch(idx)}
                                                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs transition-colors ${idx === selectedIndex
                                                        ? "bg-primary-2 text-white-1"
                                                        : "text-white-4 hover:bg-gray-3 hover:text-white-2"
                                                        }`}
                                                >
                                                    <FileText size={14} />
                                                    <p className="truncate">{file.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            <textarea
                className="w-full h-120 bg-gray-2 p-6 rounded-lg text-xs text-white-1 outline-none resize-none border border-transparent focus:border-primary-2 transition-all"
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
