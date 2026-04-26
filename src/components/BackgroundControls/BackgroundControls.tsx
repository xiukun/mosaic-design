import React from 'react';
import { useApp } from '../../context/AppContext';

const BackgroundControls: React.FC = () => {
  const { state, setCanvasConfig } = useApp();

  return (
    <div className="card p-4 mb-4">
      <h3 className="font-semibold text-slate-700 mb-3">背景设置</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">背景颜色</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={state.canvasConfig.backgroundColor}
              onChange={(e) => setCanvasConfig({ backgroundColor: e.target.value })}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={state.canvasConfig.backgroundColor}
              onChange={(e) => setCanvasConfig({ backgroundColor: e.target.value })}
              className="input flex-1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            背景模糊: {state.canvasConfig.backgroundBlur}px
          </label>
          <input
            type="range"
            min="0"
            max="20"
            value={state.canvasConfig.backgroundBlur}
            onChange={(e) => setCanvasConfig({ backgroundBlur: parseInt(e.target.value) || 0 })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">圆角</label>
          <input
            type="range"
            min="0"
            max="50"
            value={state.canvasConfig.borderRadius}
            onChange={(e) => setCanvasConfig({ borderRadius: parseInt(e.target.value) || 0 })}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default BackgroundControls;