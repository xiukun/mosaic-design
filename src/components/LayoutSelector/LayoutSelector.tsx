import React from 'react';
import { useApp } from '../../context/AppContext';
import { useGridLayout } from '../../hooks/useGridLayout';
import { useMosaicLayout } from '../../hooks/useMosaicLayout';
import { LAYOUT_TYPES } from '../../utils/constants';

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

  return (
    <div className="card p-4 mb-4">
      <h3 className="font-semibold text-slate-700 mb-3">布局选择</h3>
      <div className="grid grid-cols-3 gap-2">
        {LAYOUT_TYPES.map((layout) => (
          <button
            key={layout.type}
            onClick={() => handleLayoutChange(layout.type as any)}
            className={`
              p-3 rounded-lg text-center transition-all
              ${state.layoutConfig.type === layout.type
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}
            `}
          >
            <div className="text-2xl mb-1">{layout.icon}</div>
            <div className="text-sm">{layout.name}</div>
          </button>
        ))}
      </div>

      {state.layoutConfig.type === 'grid' && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">行数</label>
            <input
              type="number"
              min="1"
              max="10"
              value={state.layoutConfig.gridRows}
              onChange={(e) => {
                setLayoutConfig({ gridRows: parseInt(e.target.value) || 2 });
                setTimeout(applyGridLayout, 0);
              }}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">列数</label>
            <input
              type="number"
              min="1"
              max="10"
              value={state.layoutConfig.gridCols}
              onChange={(e) => {
                setLayoutConfig({ gridCols: parseInt(e.target.value) || 2 });
                setTimeout(applyGridLayout, 0);
              }}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              间距: {state.layoutConfig.spacing}px
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={state.layoutConfig.spacing}
              onChange={(e) => {
                setLayoutConfig({ spacing: parseInt(e.target.value) || 10 });
                if (state.layoutConfig.type === 'grid') {
                  setTimeout(applyGridLayout, 0);
                } else if (state.layoutConfig.type === 'mosaic') {
                  setTimeout(applyMosaicLayout, 0);
                }
              }}
              className="w-full"
            />
          </div>
        </div>
      )}

      {state.layoutConfig.type === 'mosaic' && (
        <div className="mt-4">
          <button
            onClick={applyMosaicLayout}
            className="btn-secondary w-full"
          >
            🔄 重新生成马赛克布局
          </button>
        </div>
      )}
    </div>
  );
};

export default LayoutSelector;
