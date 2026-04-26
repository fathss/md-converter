import { Layout, FileText, Type, AlignLeft } from "lucide-react";

function DocxSettings() {
  return (
    <div className="w-full h-120 bg-gray-2 p-6 rounded-lg text-white-1 overflow-y-auto custom-scrollbar flex flex-col gap-6">
      {/* Template Selection */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-primary-2">
          <Layout size={18} />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Template Style
          </h3>
        </div>
        <select className="bg-gray-3 border border-primary-3 rounded-md p-2 text-sm outline-none focus:border-primary-2 cursor-pointer transition-colors">
          <option value="academic">Academic Paper (Standard)</option>
          <option value="formal">Formal Business Letter</option>
          <option value="minimalist">Minimalist / Clean</option>
          <option value="modern">Modern Report</option>
        </select>
      </div>

      {/* Document Elements */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-primary-2">
          <FileText size={18} />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Document Elements
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-primary-3 bg-gray-3 checked:bg-primary-2 accent-primary-2"
            />
            <span className="text-sm text-white-3 group-hover:text-white-1 transition-colors">
              Table of Contents
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-primary-3 bg-gray-3 checked:bg-primary-2 accent-primary-2"
              defaultChecked
            />
            <span className="text-sm text-white-3 group-hover:text-white-1 transition-colors">
              Page Numbers
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-primary-3 bg-gray-3 checked:bg-primary-2 accent-primary-2"
            />
            <span className="text-sm text-white-3 group-hover:text-white-1 transition-colors">
              Footer Text
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-primary-3 bg-gray-3 checked:bg-primary-2 accent-primary-2"
            />
            <span className="text-sm text-white-3 group-hover:text-white-1 transition-colors">
              Header Logo
            </span>
          </label>
        </div>
      </div>

      {/* Typography & Layout Improvisation */}
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-primary-2">
            <Type size={18} />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Font Size
            </h3>
          </div>
          <select className="bg-gray-3 border border-primary-3 rounded-md p-2 text-sm outline-none focus:border-primary-2 cursor-pointer transition-colors">
            <option value="11">11pt (Standard)</option>
            <option value="12">12pt (Formal)</option>
            <option value="10">10pt (Compact)</option>
          </select>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-primary-2">
            <AlignLeft size={18} />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Margins
            </h3>
          </div>
          <select className="bg-gray-3 border border-primary-3 rounded-md p-2 text-sm outline-none focus:border-primary-2 cursor-pointer transition-colors">
            <option value="normal">Normal (1 inch)</option>
            <option value="narrow">Narrow (0.5 inch)</option>
            <option value="wide">Wide (2 inch)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default DocxSettings;
