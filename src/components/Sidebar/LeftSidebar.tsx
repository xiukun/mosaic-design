import React, { useState } from 'react';
import TemplateSelector from '../TemplateSelector/TemplateSelector';
import ImageUploader from '../ImageUploader/ImageUploader';
import LayoutPanel from '../LayoutPanel/LayoutPanel';
import BackgroundControls from '../BackgroundControls/BackgroundControls';

type PanelType = 'templates' | 'images' | 'layout' | 'background' | null;

// SVG 图标组件
const TemplateIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const ImageIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

const LayoutIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="18" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const BackgroundIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);

const LeftSidebar: React.FC = () => {
  const [activePanel, setActivePanel] = useState<PanelType>('templates');

  const togglePanel = (panel: PanelType) => {
    if (activePanel === panel) {
      setActivePanel(null);
    } else {
      setActivePanel(panel);
    }
  };

  const sidebarWidth = activePanel ? 260 : 64;

  const navItems = [
    { id: 'templates', icon: TemplateIcon, label: '模板' },
    { id: 'images', icon: ImageIcon, label: '图片' },
    { id: 'layout', icon: LayoutIcon, label: '布局' },
    { id: 'background', icon: BackgroundIcon, label: '背景' },
  ];

  return (
    <div className="h-full flex transition-all duration-300 ease-out" style={{ width: sidebarWidth }}>
      {/* 图标栏（始终可见） */}
      <div className="w-16 h-full bg-white flex flex-col items-center py-6 gap-2 border-r border-slate-200">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePanel === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => togglePanel(item.id as PanelType)}
              className={`
                group relative w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-200
                ${isActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-200/60'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-blue-600'
                }
              `}
            >
              <Icon className="w-7 h-7" />
              
              {/* 工具提示 */}
              {!activePanel && (
                <div className="absolute left-full ml-3 px-4 py-2 bg-white text-slate-800 text-sm rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 border border-slate-200 shadow-lg">
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 mr-1 border-4 border-transparent border-r-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 面板内容（仅展开时显示） */}
      {activePanel && (
        <div className="flex-1 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <h3 className="text-xl font-semibold text-slate-800">
              {navItems.find(item => item.id === activePanel)?.label}
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {activePanel === 'templates' && <TemplateSelector />}
            {activePanel === 'images' && <ImageUploader />}
            {activePanel === 'layout' && <LayoutPanel />}
            {activePanel === 'background' && <BackgroundControls />}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
