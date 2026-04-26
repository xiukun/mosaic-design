import React from 'react';
import ImageUploader from '../ImageUploader';

const LeftSidebar: React.FC = () => {
  return (
    <div className="w-72 bg-white border-r border-slate-200 overflow-y-auto">
      <div className="p-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-700">图片管理</h2>
      </div>
      <ImageUploader />
    </div>
  );
};

export default LeftSidebar;