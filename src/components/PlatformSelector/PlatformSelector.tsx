import React from 'react';
import { useApp } from '../../context/AppContext';
import { PLATFORM_PRESETS } from '../../utils/constants';

const PlatformSelector: React.FC = () => {
  const { state, setCanvasConfig } = useApp();

  const handlePresetSelect = (width: number, height: number) => {
    setCanvasConfig({ width, height });
  };

  return (
    <div className="card p-4 mb-4">
      <h3 className="font-semibold text-slate-700 mb-3">平台预设</h3>
      
      <div className="space-y-2 mb-4">
        {PLATFORM_PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handlePresetSelect(preset.width, preset.height)}
            className={`
              w-full p-3 rounded-lg text-left transition-all flex items-center gap-3
              ${state.canvasConfig.width === preset.width && state.canvasConfig.height === preset.height
                ? 'bg-primary-50 border-2 border-primary-500'
                : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'}
            `}
          >
            <span className="text-2xl">{preset.icon}</span>
            <div>
              <div className="font-medium text-slate-700">{preset.name}</div>
              <div className="text-sm text-slate-500">{preset.width} × {preset.height}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="border-t border-slate-100 pt-4">
        <h4 className="text-sm font-medium text-slate-600 mb-3">自定义尺寸</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">宽度</label>
            <input
              type="number"
              min="200"
              max="4000"
              value={state.canvasConfig.width}
              onChange={(e) => setCanvasConfig({ width: parseInt(e.target.value) || 1080 })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">高度</label>
            <input
              type="number"
              min="200"
              max="4000"
              value={state.canvasConfig.height}
              onChange={(e) => setCanvasConfig({ height: parseInt(e.target.value) || 1080 })}
              className="input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformSelector;
