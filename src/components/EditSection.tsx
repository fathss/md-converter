import { Edit } from "lucide-react"

interface EditSectionProps {
    content: string;
    onChange: (content: string) => void;
}

function EditSection({ content, onChange }: EditSectionProps) {
    return (
        <div className="w-full p-5 flex flex-col gap-4 border border-primary-3 rounded-2xl">
            <div className="flex flex-row justify-between items-center text-white-3">
                <div className="mb-2 flex flex-row gap-4 items-center">
                    <Edit size={18} />
                    <h2 className="text-sm font-semibold">Editor</h2>
                </div>
            </div>
            <textarea
                className="w-full h-120 bg-gray-2 p-6 rounded-lg text-white-1 outline-none resize-none border border-transparent focus:border-primary-2 transition-all"
                placeholder="Write your markdown here..."
                value={content}
                onChange={(e) => onChange(e.target.value)}
            />
            <div className="flex justify-between text-xs text-white-4 px-1">
                <p>Words: {content.replace(/[\s#\*]/g, "").length}</p>
            </div>
        </div>
    )
}

export default EditSection