import React, { useState } from 'react';
import PlatformSelector from '../PlatformSelector';
import LayoutSelector from '../LayoutSelector';
import BackgroundControls from '../BackgroundControls';
import { Settings, Layout as LayoutIcon, Palette, Smartphone } from 'lucide-react';

type Tab = 'platform' | 'layout' | 'background';

const RightSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('platform');

  const tabs = [
    { id: 'platform' as Tab, icon: Smartphone, label: '尺寸' },
    { id: 'layout' as Tab, icon: LayoutIcon, label: '布局' },
    { id: 'background' as Tab, icon: Palette, label: '样式' },
  ];

  return (
    <div className="w-72 bg-white/90 backdrop-blur-xl border-l border-slate-200/50 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-100/50 bg-gradient-to-br from-white to-slate-50/50">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-indigo-500" />
          <h2 className="font-semibold text-slate-800">属性面板</h2>
        </div>
        <p className="text-xs text-slate-500">调整你的拼贴图设计</p>
      </div>
      
      <div className="px-3 pt-3">
        <div className="flex bg-slate-100/70 rounded-xl p-1.5 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          {activeTab === 'platform' && <PlatformSelector />}
          {activeTab === 'layout' && <LayoutSelector />}
          {activeTab === 'background' && <BackgroundControls />}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
