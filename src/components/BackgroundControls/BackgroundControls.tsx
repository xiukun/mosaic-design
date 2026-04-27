import React from 'react';
import { useApp } from '../../context/AppContext';
import { Palette, Droplets, Radius } from 'lucide-react';

const BackgroundControls: React.FC = () => {
  const { state, setCanvasConfig } = useApp();

  const presetColors = [
    '#FFFFFF',
    '#F8FAFC',
    '#F1F5F9',
    '#DBEAFE',
    '#FDF4FF',
    '#FFF7ED',
    '#F0FDF4',
    '#FEFCE8',
  ];

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
            <Palette className="w-4 h-4 text-white" />
          </div>
          背景颜色
        </h3>
        <div className="grid grid-cols-8 gap-1.5">
          {presetColors.map((color, index) => {
            const isActive = state.canvasConfig.backgroundColor === color;
            return (
              <button
                key={index}
                onClick={() => setCanvasConfig({ backgroundColor: color })}
                className={`
                  w-full aspect-square rounded-xl border-2 transition-all duration-200
                  ${isActive ? 'border-slate-800 scale-110 shadow-lg' : 'border-transparent hover:scale-105'}
                `}
                style={{ backgroundColor: color }}
              >
                {isActive && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-slate-800 rounded-full" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={state.canvasConfig.backgroundColor}
              onChange={(e) => setCanvasConfig({ backgroundColor: e.target.value })}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
            />
            <div 
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded border border-slate-200"
              style={{ backgroundColor: state.canvasConfig.backgroundColor }}
            />
          </div>
          <div className="relative">
            <input
              type="color"
              value={state.canvasConfig.backgroundColor}
              onChange={(e) => setCanvasConfig({ backgroundColor: e.target.value })}
              className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer bg-transparent"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-1">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Droplets className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex items-center justify-between flex-1">
              <label className="text-xs text-slate-600 font-medium">背景模糊</label>
              <span className="text-xs font-semibold text-slate-800">{state.canvasConfig.backgroundBlur}px</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            value={state.canvasConfig.backgroundBlur}
            onChange={(e) => setCanvasConfig({ backgroundBlur: parseInt(e.target.value) || 0 })}
            className="w-full accent-cyan-500"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
              <Radius className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex items-center justify-between flex-1">
              <label className="text-xs text-slate-600 font-medium">圆角</label>
              <span className="text-xs font-semibold text-slate-800">{state.canvasConfig.borderRadius}px</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            value={state.canvasConfig.borderRadius}
            onChange={(e) => setCanvasConfig({ borderRadius: parseInt(e.target.value) || 0 })}
            className="w-full accent-emerald-500"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50/50 rounded-2xl border border-indigo-100">
          <div className="text-center">
            <div className="text-xs text-indigo-700/70 font-medium mb-1">实时预览</div>
            <p className="text-xs text-indigo-600/60">所有更改都会立即反映在画布上</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundControls;
