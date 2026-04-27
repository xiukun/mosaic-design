import React from 'react';
import { useApp } from '../../context/AppContext';
import { PLATFORM_PRESETS } from '../../utils/constants';
import { Image as ImageIcon, Music2 } from 'lucide-react';

const PlatformSelector: React.FC = () => {
  const { state, setCanvasConfig } = useApp();

  const handlePresetSelect = (width: number, height: number) => {
    setCanvasConfig({ width, height });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
            <ImageIcon className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-slate-700">小红书</h3>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {PLATFORM_PRESETS.slice(0, 3).map((preset) => {
            const isActive = state.canvasConfig.width === preset.width && 
                            state.canvasConfig.height === preset.height;
            return (
              <button
                key={preset.name}
                onClick={() => handlePresetSelect(preset.width, preset.height)}
                className={`
                  p-4 rounded-2xl border-2 text-left transition-all duration-200
                  ${isActive 
                    ? 'border-blue-500 bg-blue-50/50 shadow-md' 
                    : 'border-slate-100 hover:border-slate-200 bg-slate-50/30 hover:bg-slate-50/50'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-semibold text-sm ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>
                    {preset.name}
                  </span>
                  {isActive && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </div>
                <div className={`text-sm ${isActive ? 'text-blue-500' : 'text-slate-400'}`}>
                  {preset.width} × {preset.height}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-black to-slate-800 rounded-xl flex items-center justify-center">
            <Music2 className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-slate-700">抖音</h3>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {PLATFORM_PRESETS.slice(3).map((preset) => {
            const isActive = state.canvasConfig.width === preset.width && 
                            state.canvasConfig.height === preset.height;
            return (
              <button
                key={preset.name}
                onClick={() => handlePresetSelect(preset.width, preset.height)}
                className={`
                  p-4 rounded-2xl border-2 text-left transition-all duration-200
                  ${isActive 
                    ? 'border-slate-700 bg-slate-900/5 shadow-md' 
                    : 'border-slate-100 hover:border-slate-200 bg-slate-50/30 hover:bg-slate-50/50'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-semibold text-sm ${isActive ? 'text-slate-800' : 'text-slate-700'}`}>
                    {preset.name}
                  </span>
                  {isActive && (
                    <div className="w-2 h-2 bg-slate-700 rounded-full" />
                  )}
                </div>
                <div className={`text-sm ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>
                  {preset.width} × {preset.height}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
          <span className="w-1 h-1 bg-slate-400 rounded-full" />
          自定义尺寸
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">宽度</label>
            <div className="relative">
              <input
                type="number"
                min="200"
                max="4000"
                value={state.canvasConfig.width}
                onChange={(e) => setCanvasConfig({ width: parseInt(e.target.value) || 1080 })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">px</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">高度</label>
            <div className="relative">
              <input
                type="number"
                min="200"
                max="4000"
                value={state.canvasConfig.height}
                onChange={(e) => setCanvasConfig({ height: parseInt(e.target.value) || 1080 })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">px</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformSelector;
