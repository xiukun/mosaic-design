import React from 'react';
import { useApp } from '../../context/AppContext';
import { useGridLayout } from '../../hooks/useGridLayout';
import { useMosaicLayout } from '../../hooks/useMosaicLayout';
import { LAYOUT_TYPES } from '../../utils/constants';
import { Grid2x2, Image as ImageIcon, Move, RefreshCcw } from 'lucide-react';

const LayoutSelector: React.FC = () => {
  const { state, setLayoutConfig } = useApp();
  const { applyGridLayout } = useGridLayout();
  const { applyMosaicLayout } = useMosaicLayout();

  const handleLayoutChange = (type: 'grid' | 'mosaic' | 'free') => {
    setLayoutConfig({ type });
    if (type === 'grid') {
      setTimeout(applyGridLayout, 0);
    } else if (type === 'mosaic') {
      setTimeout(applyMosaicLayout, 0);
    }
  };

  const layoutIcons = [Grid2x2, ImageIcon, Move];

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Grid2x2 className="w-4 h-4 text-white" />
          </div>
          布局类型
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {LAYOUT_TYPES.map((layout, index) => {
            const Icon = layoutIcons[index];
            const isActive = state.layoutConfig.type === layout.type;
            return (
              <button
                key={layout.type}
                onClick={() => handleLayoutChange(layout.type as any)}
                className={`
                  flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200
                  ${isActive 
                    ? 'border-violet-500 bg-violet-50/50 shadow-md' 
                    : 'border-slate-100 hover:border-slate-200 bg-slate-50/30 hover:bg-slate-50/50'
                  }
                `}
              >
                <div className={`
                  w-8 h-8 rounded-xl flex items-center justify-center transition-all
                  ${isActive 
                    ? 'bg-violet-500 text-white' 
                    : 'bg-slate-200 text-slate-500'
                  }
                `}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-xs font-medium ${isActive ? 'text-violet-700' : 'text-slate-600'}`}>
                  {layout.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {state.layoutConfig.type === 'grid' && (
        <div className="space-y-4 pt-1">
          <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-4">
            <div>
              <label className="flex items-center justify-between text-xs text-slate-600 mb-2">
                <span>行数</span>
                <span className="font-semibold text-slate-800">{state.layoutConfig.gridRows}</span>
              </label>
              <input
                type="range"
                min="1"
                max="6"
                value={state.layoutConfig.gridRows}
                onChange={(e) => {
                  setLayoutConfig({ gridRows: parseInt(e.target.value) || 2 });
                  setTimeout(applyGridLayout, 0);
                }}
                className="w-full accent-violet-500"
              />
            </div>
            <div>
              <label className="flex items-center justify-between text-xs text-slate-600 mb-2">
                <span>列数</span>
                <span className="font-semibold text-slate-800">{state.layoutConfig.gridCols}</span>
              </label>
              <input
                type="range"
                min="1"
                max="6"
                value={state.layoutConfig.gridCols}
                onChange={(e) => {
                  setLayoutConfig({ gridCols: parseInt(e.target.value) || 2 });
                  setTimeout(applyGridLayout, 0);
                }}
                className="w-full accent-violet-500"
              />
            </div>
            <div>
              <label className="flex items-center justify-between text-xs text-slate-600 mb-2">
                <span>间距</span>
                <span className="font-semibold text-slate-800">{state.layoutConfig.spacing}px</span>
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={state.layoutConfig.spacing}
                onChange={(e) => {
                  setLayoutConfig({ spacing: parseInt(e.target.value) || 10 });
                  setTimeout(applyGridLayout, 0);
                }}
                className="w-full accent-violet-500"
              />
            </div>
          </div>
        </div>
      )}

      {state.layoutConfig.type === 'mosaic' && (
        <div className="pt-1">
          <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl border border-amber-100">
            <div className="text-center mb-3">
              <div className="text-xs text-amber-700/70 font-medium mb-1">马赛克布局</div>
              <p className="text-xs text-amber-600/60">每次点击都会生成新的随机布局</p>
            </div>
            <button
              onClick={applyMosaicLayout}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:-translate-y-0.5"
            >
              <RefreshCcw className="w-4 h-4" />
              重新生成
            </button>
          </div>
        </div>
      )}

      {state.layoutConfig.type === 'free' && (
        <div className="pt-1">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50/50 rounded-2xl border border-blue-100 text-center">
            <Move className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-xs text-blue-700/70 font-medium mb-1">自由拼接模式</div>
            <p className="text-xs text-blue-600/60">拖拽图片到任意位置，调整大小和旋转</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayoutSelector;
