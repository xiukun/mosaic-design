import React, { useState } from 'react';
import ImageUploader from '../ImageUploader';
import TemplateSelector from '../TemplateSelector';
import { Image as ImageIcon, Layout as LayoutIcon } from 'lucide-react';

const LeftSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'templates' | 'images'>('templates');

  return (
    <div className="w-64 bg-white/90 backdrop-blur-xl border-r border-slate-200/50 overflow-y-auto flex flex-col">
      {/* 选项卡导航 */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors ${activeTab === 'templates'
            ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-500'
            : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
        >
          <LayoutIcon className="w-4 h-4" />
          <span className="text-sm font-medium">模板</span>
        </button>
        <button
          onClick={() => setActiveTab('images')}
          className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors ${activeTab === 'images'
            ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-500'
            : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span className="text-sm font-medium">图库</span>
        </button>
      </div>

      {/* 选项卡内容 */}
      <div className="flex-1">
        {activeTab === 'templates' && <TemplateSelector />}
        {activeTab === 'images' && (
          <div className="p-4">
            <ImageUploader />
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
