import React from 'react';
import LayoutSelector from '../LayoutSelector';
import BackgroundControls from '../BackgroundControls';
import PlatformSelector from '../PlatformSelector';

const RightSidebar: React.FC = () => {
  return (
    <div className="w-80 bg-white border-l border-slate-200 overflow-y-auto">
      <div className="p-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-700">属性设置</h2>
      </div>
      <div className="p-4">
        <PlatformSelector />
        <LayoutSelector />
        <BackgroundControls />
      </div>
    </div>
  );
};

export default RightSidebar;