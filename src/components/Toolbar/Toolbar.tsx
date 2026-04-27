import React from 'react';
import { useExport } from '../../hooks/useExport';
import { Download, Image, Layers } from 'lucide-react';

const Toolbar: React.FC = () => {
  const { exportAsImage } = useExport();

  return (
    <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            拼接图设计器
          </h1>
          <p className="text-xs text-slate-500">Photo Collage Studio</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          onClick={() => exportAsImage('png')}
          className="group flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all duration-300 hover:shadow-md"
        >
          <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          <span className="font-medium">导出 PNG</span>
        </button>
        <button
          onClick={() => exportAsImage('jpeg', 0.9)}
          className="group flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
        >
          <Image className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          <span className="font-semibold">导出 JPG</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
