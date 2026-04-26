import React from 'react';
import { useExport } from '../../hooks/useExport';

const Toolbar: React.FC = () => {
  const { exportAsImage } = useExport();

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="text-2xl">🎨</div>
        <h1 className="text-xl font-bold text-slate-800">拼接图设计器</h1>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          onClick={() => exportAsImage('png')}
          className="btn-secondary flex items-center gap-2"
        >
          <span>📥</span>
          <span>导出 PNG</span>
        </button>
        <button
          onClick={() => exportAsImage('jpeg', 0.9)}
          className="btn-primary flex items-center gap-2"
        >
          <span>📤</span>
          <span>导出 JPG</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
