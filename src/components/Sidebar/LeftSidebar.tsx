import React from 'react';
import ImageUploader from '../ImageUploader';
import { Image as ImageIcon } from 'lucide-react';

const LeftSidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white/90 backdrop-blur-xl border-r border-slate-200/50 overflow-y-auto flex flex-col">
      <div className="p-5 border-b border-slate-100/50 bg-gradient-to-br from-white to-slate-50/50">
        <div className="flex items-center gap-2 mb-1">
          <ImageIcon className="w-5 h-5 text-blue-500" />
          <h2 className="font-semibold text-slate-800">图库</h2>
        </div>
        <p className="text-xs text-slate-500">添加图片到你的拼贴图</p>
      </div>
      <div className="flex-1 p-4">
        <ImageUploader />
      </div>
    </div>
  );
};

export default LeftSidebar;
