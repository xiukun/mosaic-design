import React from 'react';
import { cn } from '@/lib/utils';

export type LayoutType = 'grid' | 'mosaic' | 'free';

export interface LayoutSelectorProps {
  layoutType: LayoutType;
  setLayoutType: (type: LayoutType) => void;
  gridRows: number;
  setGridRows: (rows: number) => void;
  gridColumns: number;
  setGridColumns: (columns: number) => void;
  gridGap: number;
  setGridGap: (gap: number) => void;
  className?: string;
}

export const LayoutSelector: React.FC<LayoutSelectorProps> = ({
  layoutType,
  setLayoutType,
  gridRows,
  setGridRows,
  gridColumns,
  setGridColumns,
  gridGap,
  setGridGap,
  className,
}) => {
  const layoutOptions: { value: LayoutType; label: string }[] = [
    { value: 'grid', label: '网格布局' },
    { value: 'mosaic', label: '马赛克布局' },
    { value: 'free', label: '自由布局' },
  ];

  return (
    <div className={cn('space-y-6', className)}>
      <div>
        <h3 className="text-sm font-medium mb-3">布局类型</h3>
        <div className="flex space-x-2">
          {layoutOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                layoutType === option.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              )}
              onClick={() => setLayoutType(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {layoutType === 'grid' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-3">网格参数</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm text-muted-foreground">行数</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={gridRows}
                  onChange={(e) => setGridRows(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm text-muted-foreground">列数</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={gridColumns}
                  onChange={(e) => setGridColumns(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm text-muted-foreground">间距 (px)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={gridGap}
                  onChange={(e) => setGridGap(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
