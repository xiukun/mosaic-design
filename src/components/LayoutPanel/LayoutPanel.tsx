import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutConfig } from '../../types';
import { PLATFORM_PRESETS } from '../../utils/constants';

const LayoutPanel: React.FC = () => {
  const { state, dispatch } = useApp();
  const { layoutConfig, canvasConfig } = state;

  // 折叠状态管理
  const [sections, setSections] = useState({
    size: true,
    layoutType: true,
    gridSettings: true,
    layoutAdjust: true
  });

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleLayoutTypeChange = (type: LayoutConfig['type']) => {
    dispatch({
      type: 'SET_LAYOUT_CONFIG',
      payload: { type }
    });
  };

  const handleGridRowsChange = (rows: number) => {
    dispatch({
      type: 'SET_LAYOUT_CONFIG',
      payload: { gridRows: rows }
    });
  };

  const handleGridColsChange = (cols: number) => {
    dispatch({
      type: 'SET_LAYOUT_CONFIG',
      payload: { gridCols: cols }
    });
  };

  const applyGridPreset = (rows: number, cols: number) => {
    dispatch({
      type: 'SET_LAYOUT_CONFIG',
      payload: { gridRows: rows, gridCols: cols }
    });
  };

  const handleSpacingChange = (spacing: number) => {
    dispatch({
      type: 'SET_LAYOUT_CONFIG',
      payload: { spacing }
    });
  };

  const handleBorderRadiusChange = (borderRadius: number) => {
    dispatch({
      type: 'SET_LAYOUT_CONFIG',
      payload: { borderRadius }
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* 画布尺寸 */}
      <div className="border-b border-slate-100">
        <button
          onClick={() => toggleSection('size')}
          className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <span className="font-medium text-slate-700">画布尺寸</span>
          <span className={`text-slate-500 transition-transform ${sections.size ? 'rotate-90' : ''}`}>
            ▶
          </span>
        </button>
        {sections.size && (
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {PLATFORM_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => dispatch({
                    type: 'SET_CANVAS_SIZE',
                    payload: { width: preset.width, height: preset.height }
                  })}
                  className={`
                    px-3 py-2 text-sm rounded-lg border transition-all
                    ${canvasConfig.width === preset.width && canvasConfig.height === preset.height
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }
                  `}
                >
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-xs text-slate-500">{preset.width}×{preset.height}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 布局类型 */}
      <div className="border-b border-slate-100">
        <button
          onClick={() => toggleSection('layoutType')}
          className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <span className="font-medium text-slate-700">布局类型</span>
          <span className={`text-slate-500 transition-transform ${sections.layoutType ? 'rotate-90' : ''}`}>
            ▶
          </span>
        </button>
        {sections.layoutType && (
          <div className="p-4">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleLayoutTypeChange('grid')}
                className={`
                  p-4 rounded-xl border-2 text-center transition-all
                  ${layoutConfig.type === 'grid'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }
                `}
              >
                <div className="text-2xl mb-1">▦</div>
                <div className="text-xs font-medium text-slate-700">网格</div>
              </button>
              <button
                onClick={() => handleLayoutTypeChange('mosaic')}
                className={`
                  p-4 rounded-xl border-2 text-center transition-all
                  ${layoutConfig.type === 'mosaic'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }
                `}
              >
                <div className="text-2xl mb-1">⊞</div>
                <div className="text-xs font-medium text-slate-700">马赛克</div>
              </button>
              <button
                onClick={() => handleLayoutTypeChange('free')}
                className={`
                  p-4 rounded-xl border-2 text-center transition-all
                  ${layoutConfig.type === 'free'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }
                `}
              >
                <div className="text-2xl mb-1">⬚</div>
                <div className="text-xs font-medium text-slate-700">自由</div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 网格设置（仅网格布局 */}
      {layoutConfig.type === 'grid' && (
        <div className="border-b border-slate-100">
          <button
            onClick={() => toggleSection('gridSettings')}
            className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <span className="font-medium text-slate-700">网格设置</span>
            <span className={`text-slate-500 transition-transform ${sections.gridSettings ? 'rotate-90' : ''}`}>
              ▶
            </span>
          </button>
          {sections.gridSettings && (
            <div className="p-4 space-y-4">
              {/* 网格预设按钮 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">常用预设</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { rows: 1, cols: 1, label: '1×1' },
                    { rows: 2, cols: 2, label: '2×2' },
                    { rows: 3, cols: 3, label: '3×3' },
                    { rows: 3, cols: 2, label: '3×2' },
                    { rows: 2, cols: 3, label: '2×3' },
                    { rows: 4, cols: 4, label: '4×4' },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => applyGridPreset(preset.rows, preset.cols)}
                      className={`
                        px-3 py-2 text-sm rounded-lg border transition-all
                        ${layoutConfig.gridRows === preset.rows && layoutConfig.gridCols === preset.cols
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }
                      `}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 行数、列数滑块 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  行数: {layoutConfig.gridRows}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={layoutConfig.gridRows}
                  onChange={(e) => handleGridRowsChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  列数: {layoutConfig.gridCols}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={layoutConfig.gridCols}
                  onChange={(e) => handleGridColsChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 布局调整 */}
      <div className="border-b border-slate-100">
        <button
          onClick={() => toggleSection('layoutAdjust')}
          className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <span className="font-medium text-slate-700">布局调整</span>
          <span className={`text-slate-500 transition-transform ${sections.layoutAdjust ? 'rotate-90' : ''}`}>
            ▶
          </span>
        </button>
        {sections.layoutAdjust && (
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                间距: {layoutConfig.spacing}%
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={layoutConfig.spacing}
                onChange={(e) => handleSpacingChange(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                圆角: {layoutConfig.borderRadius}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={layoutConfig.borderRadius}
                onChange={(e) => handleBorderRadiusChange(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LayoutPanel;
